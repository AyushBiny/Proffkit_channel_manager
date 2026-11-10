-- ==============================================================================
-- 0002_rates_otas_and_mappings.sql
-- Rate Plans, OTA Channel Mappings, and Dynamic Pricing Rules
-- ==============================================================================

-- 1. Supported Booking & OTA Channels Enum
DO $$ BEGIN
    CREATE TYPE public.booking_channel AS ENUM (
        'DIRECT_WEB',
        'FRONT_DESK',
        'MOBILE_APP',
        'OTA_BOOKING_COM',
        'OTA_EXPEDIA',
        'OTA_AIRBNB',
        'OTA_AGODA'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 2. OTA Channel Connection Credentials & Settings
CREATE TABLE IF NOT EXISTS public.channel_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    channel public.booking_channel NOT NULL,
    channel_hotel_id TEXT NOT NULL, -- Property ID in OTA system (e.g., Booking.com Hotel ID)
    api_key_encrypted TEXT,
    api_secret_encrypted TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sync_inventory BOOLEAN NOT NULL DEFAULT true,
    sync_rates BOOLEAN NOT NULL DEFAULT true,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_channel_connections_hotel_channel UNIQUE (hotel_id, channel)
);

-- 3. Rate Plans (Standard, Non-Refundable, Bed & Breakfast, etc.)
CREATE TABLE IF NOT EXISTS public.rate_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    code TEXT NOT NULL, -- e.g. 'BAR' (Best Available Rate), 'NONREF'
    name TEXT NOT NULL,
    cancellation_policy_type TEXT NOT NULL DEFAULT 'FLEXIBLE' CHECK (cancellation_policy_type IN ('FLEXIBLE', 'MODERATE', 'STRICT', 'NON_REFUNDABLE')),
    meal_plan TEXT NOT NULL DEFAULT 'ROOM_ONLY' CHECK (meal_plan IN ('ROOM_ONLY', 'BREAKFAST', 'HALF_BOARD', 'ALL_INCLUSIVE')),
    price_modifier_type TEXT NOT NULL DEFAULT 'PERCENTAGE' CHECK (price_modifier_type IN ('PERCENTAGE', 'FIXED_AMOUNT')),
    price_modifier_value NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- e.g. -10.00 for 10% discount on non-ref
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_rate_plans_hotel_code UNIQUE (hotel_id, code)
);

-- 4. OTA Room Type Mapping
-- Maps internal RoomType to each external OTA's room identifier
CREATE TABLE IF NOT EXISTS public.ota_room_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_connection_id UUID NOT NULL REFERENCES public.channel_connections(id) ON DELETE CASCADE,
    room_type_id UUID NOT NULL REFERENCES public.room_types(id) ON DELETE CASCADE,
    channel_room_id TEXT NOT NULL, -- OTA room code
    channel_room_name TEXT,
    is_sync_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_ota_room_mappings UNIQUE (channel_connection_id, room_type_id)
);

-- 5. Daily Rates, Availability, and Restrictions Calendar (ARI)
CREATE TABLE IF NOT EXISTS public.daily_inventory_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    room_type_id UUID NOT NULL REFERENCES public.room_types(id) ON DELETE CASCADE,
    rate_plan_id UUID NOT NULL REFERENCES public.rate_plans(id) ON DELETE CASCADE,
    calendar_date DATE NOT NULL,
    base_rate NUMERIC(10, 2) NOT NULL,
    effective_rate NUMERIC(10, 2) NOT NULL,
    allotment_override INT, -- Optional manual override of sellable rooms
    stop_sell BOOLEAN NOT NULL DEFAULT false, -- Blocks all sales on this date
    closed_to_arrival BOOLEAN NOT NULL DEFAULT false, -- CTA
    closed_to_departure BOOLEAN NOT NULL DEFAULT false, -- CTD
    min_length_of_stay INT NOT NULL DEFAULT 1,
    max_length_of_stay INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_daily_calendar_slot UNIQUE (hotel_id, room_type_id, rate_plan_id, calendar_date)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_calendar_lookup ON public.daily_inventory_calendar (hotel_id, room_type_id, calendar_date);
CREATE INDEX IF NOT EXISTS idx_channel_conn_hotel ON public.channel_connections (hotel_id);
CREATE INDEX IF NOT EXISTS idx_ota_room_mappings ON public.ota_room_mappings (channel_connection_id);

-- Enable RLS
ALTER TABLE public.channel_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ota_room_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_inventory_calendar ENABLE ROW LEVEL SECURITY;
