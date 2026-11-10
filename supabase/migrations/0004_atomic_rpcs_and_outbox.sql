-- ==============================================================================
-- 0004_atomic_rpcs_and_outbox.sql
-- Atomic Booking RPCs, Transactional Outbox Pattern, and Realtime Subscriptions
-- ==============================================================================

-- 1. Transactional Outbox Table for Asynchronous OTA Sync & Client Push
-- Implements the Transactional Outbox Pattern to guarantee at-least-once delivery
-- to Booking.com, Expedia, Airbnb, and Offline Reception PCs without dual-write hazards.
CREATE TABLE IF NOT EXISTS public.sync_outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- e.g. 'RESERVATION_CREATED', 'ROOM_STATUS_UPDATED', 'RATE_MODIFIED'
    aggregate_type TEXT NOT NULL, -- 'RESERVATION', 'ROOM', 'RATE'
    aggregate_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'DELIVERED', 'FAILED')),
    retry_count INT NOT NULL DEFAULT 0,
    max_retries INT NOT NULL DEFAULT 5,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sync_outbox_status ON public.sync_outbox (status, created_at)
WHERE status IN ('PENDING', 'FAILED');

-- 2. Atomic Reservation Stored Procedure (RPC)
-- Handles guest creation/lookup, reservation insertion, folio initialization,
-- and outbox event enqueue in a single ACID transaction.
CREATE OR REPLACE FUNCTION public.create_reservation_atomic(
    p_hotel_id UUID,
    p_tenant_id UUID,
    p_guest_first_name TEXT,
    p_guest_last_name TEXT,
    p_guest_email TEXT,
    p_guest_phone TEXT,
    p_room_type_id UUID,
    p_check_in_date DATE,
    p_check_out_date DATE,
    p_adult_count INT,
    p_child_count INT,
    p_nightly_rate NUMERIC,
    p_channel public.booking_channel,
    p_channel_ref_id TEXT DEFAULT NULL,
    p_room_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_guest_id UUID;
    v_reservation_id UUID;
    v_folio_id UUID;
    v_res_number TEXT;
    v_nights INT;
    v_subtotal NUMERIC;
    v_tax NUMERIC;
    v_total NUMERIC;
    v_deposit NUMERIC;
BEGIN
    -- Calculate nights
    v_nights := (p_check_out_date - p_check_in_date);
    IF v_nights <= 0 THEN
        RAISE EXCEPTION 'Check-out date must be after check-in date.';
    END IF;

    -- Financial calculations (using default 12% tax & 20% deposit)
    v_subtotal := ROUND((p_nightly_rate * v_nights)::numeric, 2);
    v_tax := ROUND((v_subtotal * 0.12)::numeric, 2);
    v_total := v_subtotal + v_tax;
    v_deposit := ROUND((v_total * 0.20)::numeric, 2);

    -- Generate reservation number: PRF-YYYYMMDD-XXXX
    v_res_number := 'PRF-' || to_char(p_check_in_date, 'YYYYMMDD') || '-' || upper(substring(gen_random_uuid()::text from 1 for 4));

    -- Step 1: Upsert or find guest
    SELECT id INTO v_guest_id
    FROM public.guests
    WHERE tenant_id = p_tenant_id AND email = lower(p_guest_email)
    LIMIT 1;

    IF v_guest_id IS NULL THEN
        INSERT INTO public.guests (
            tenant_id, first_name, last_name, email, phone
        ) VALUES (
            p_tenant_id, p_guest_first_name, p_guest_last_name, lower(p_guest_email), p_guest_phone
        ) RETURNING id INTO v_guest_id;
    END IF;

    -- Step 2: Insert Reservation (GiST exclusion constraint automatically verifies physical room availability)
    INSERT INTO public.reservations (
        hotel_id,
        reservation_number,
        guest_id,
        room_type_id,
        room_id,
        check_in_date,
        check_out_date,
        adult_count,
        child_count,
        status,
        channel,
        channel_reference_id,
        nightly_rate,
        total_nights,
        subtotal_amount,
        tax_amount,
        total_amount,
        deposit_paid,
        currency
    ) VALUES (
        p_hotel_id,
        v_res_number,
        v_guest_id,
        p_room_type_id,
        p_room_id,
        p_check_in_date,
        p_check_out_date,
        p_adult_count,
        p_child_count,
        'CONFIRMED',
        p_channel,
        p_channel_ref_id,
        p_nightly_rate,
        v_nights,
        v_subtotal,
        v_tax,
        v_total,
        v_deposit,
        'USD'
    ) RETURNING id INTO v_reservation_id;

    -- Step 3: Initialize Guest Folio
    INSERT INTO public.folios (
        reservation_id,
        hotel_id,
        status,
        total_charges,
        total_payments,
        balance,
        currency
    ) VALUES (
        v_reservation_id,
        p_hotel_id,
        'OPEN',
        v_total,
        v_deposit,
        (v_total - v_deposit),
        'USD'
    ) RETURNING id INTO v_folio_id;

    -- Step 4: Record Initial Room Charge and Deposit on Folio
    INSERT INTO public.folio_items (folio_id, description, category, amount, posted_by)
    VALUES
        (v_folio_id, 'Accommodation Charge (' || v_nights || ' nights)', 'ROOM_CHARGE', v_subtotal, 'RESERVATION_ENGINE'),
        (v_folio_id, 'Occupancy Taxes & Levies', 'TAX', v_tax, 'RESERVATION_ENGINE'),
        (v_folio_id, 'Deposit Payment Received', 'PAYMENT', -v_deposit, 'PAYMENT_GATEWAY');

    -- Step 5: Enqueue Transactional Outbox Event for 24/7 Cloud Worker & OTAs
    INSERT INTO public.sync_outbox (
        hotel_id,
        event_type,
        aggregate_type,
        aggregate_id,
        payload
    ) VALUES (
        p_hotel_id,
        'RESERVATION_CREATED',
        'RESERVATION',
        v_reservation_id::text,
        jsonb_build_object(
            'reservation_id', v_reservation_id,
            'reservation_number', v_res_number,
            'hotel_id', p_hotel_id,
            'room_type_id', p_room_type_id,
            'room_id', p_room_id,
            'check_in_date', p_check_in_date,
            'check_out_date', p_check_out_date,
            'channel', p_channel,
            'total_amount', v_total,
            'deposit_paid', v_deposit
        )
    );

    -- Return JSON summary
    RETURN jsonb_build_object(
        'success', true,
        'reservation_id', v_reservation_id,
        'reservation_number', v_res_number,
        'guest_id', v_guest_id,
        'folio_id', v_folio_id,
        'total_amount', v_total,
        'deposit_paid', v_deposit
    );
END;
$$;

-- 3. Enable Supabase Realtime Publication for Live Front Desk & Mobile Updates
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sync_outbox;
EXCEPTION
    WHEN undefined_object THEN NULL;
    WHEN duplicate_object THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE public.sync_outbox ENABLE ROW LEVEL SECURITY;
