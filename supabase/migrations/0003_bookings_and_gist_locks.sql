-- ==============================================================================
-- 0003_bookings_and_gist_locks.sql
-- Bookings, Guests, Folios, and GiST Exclusion Constraints for Overbooking Prevention
-- ==============================================================================

-- Enable btree_gist extension for combining scalar equality (room_id) with range overlap (daterange)
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 1. Reservation Status Enum
DO $$ BEGIN
    CREATE TYPE public.reservation_status AS ENUM (
        'CONFIRMED',
        'CHECKED_IN',
        'CHECKED_OUT',
        'CANCELLED',
        'NO_SHOW'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 2. Guests Table
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    id_type TEXT CHECK (id_type IN ('PASSPORT', 'DRIVERS_LICENSE', 'NATIONAL_ID')),
    id_number TEXT,
    nationality TEXT,
    vip_status BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Reservations Table with GiST Overbooking Prevention Constraint
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    reservation_number TEXT NOT NULL,
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE RESTRICT,
    room_type_id UUID NOT NULL REFERENCES public.room_types(id) ON DELETE RESTRICT,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL, -- Assigned physical room (or null if unallocated)
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    adult_count INT NOT NULL DEFAULT 1 CHECK (adult_count >= 1),
    child_count INT NOT NULL DEFAULT 0 CHECK (child_count >= 0),
    status public.reservation_status NOT NULL DEFAULT 'CONFIRMED',
    channel public.booking_channel NOT NULL DEFAULT 'DIRECT_WEB',
    channel_reference_id TEXT, -- Booking ID from Booking.com, Expedia, etc.
    nightly_rate NUMERIC(10, 2) NOT NULL,
    total_nights INT NOT NULL CHECK (total_nights >= 1),
    subtotal_amount NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    deposit_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'USD',
    special_requests TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_reservation_dates CHECK (check_out_date > check_in_date),
    CONSTRAINT uq_hotel_reservation_number UNIQUE (hotel_id, reservation_number),

    -- =========================================================================
    -- MISSION-CRITICAL POSTGRESQL GIST EXCLUSION LOCK:
    -- Mathematically guarantees zero overbooking at the database level!
    -- Blocks overlapping check_in_date to check_out_date dateranges on the same
    -- physical room_id across all concurrent transactions (web, desk, and OTAs).
    -- =========================================================================
    CONSTRAINT prevent_overlapping_room_bookings
    EXCLUDE USING gist (
        room_id WITH =,
        daterange(check_in_date, check_out_date, '[)') WITH &&
    ) WHERE (room_id IS NOT NULL AND status NOT IN ('CANCELLED', 'NO_SHOW', 'CHECKED_OUT'))
);

-- 4. Folios (Guest billing accounts)
CREATE TABLE IF NOT EXISTS public.folios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES public.reservations(id) ON DELETE CASCADE,
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'SETTLED', 'VOID')),
    total_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_payments NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'USD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Folio Items (Charges, taxes, room nights, and payments)
CREATE TABLE IF NOT EXISTS public.folio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio_id UUID NOT NULL REFERENCES public.folios(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('ROOM_CHARGE', 'FOOD_BEVERAGE', 'LAUNDRY', 'SPA', 'TAX', 'PAYMENT', 'REFUND')),
    amount NUMERIC(10, 2) NOT NULL,
    posted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    posted_by TEXT NOT NULL DEFAULT 'SYSTEM'
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_reservations_hotel_dates ON public.reservations (hotel_id, check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations (status);
CREATE INDEX IF NOT EXISTS idx_reservations_room_id ON public.reservations (room_id);
CREATE INDEX IF NOT EXISTS idx_guests_email ON public.guests (tenant_id, email);
CREATE INDEX IF NOT EXISTS idx_folios_reservation_id ON public.folios (reservation_id);

-- Enable RLS
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folio_items ENABLE ROW LEVEL SECURITY;
