-- ==============================================================================
-- 0001_core_tenant_and_rooms.sql
-- Core Multi-Tenant Architecture, Hotels, Room Types, and Physical Rooms
-- ==============================================================================

-- Enable required Postgres extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tenants (Hospitality Chains, Independent Owners, Property Groups)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    custom_domain TEXT UNIQUE,
    plan TEXT NOT NULL DEFAULT 'PROFESSIONAL' CHECK (plan IN ('FREE', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE')),
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'TRIAL')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Hotels (Physical properties belonging to a Tenant)
CREATE TABLE IF NOT EXISTS public.hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    time_zone TEXT NOT NULL DEFAULT 'UTC',
    currency TEXT NOT NULL DEFAULT 'USD',
    address JSONB NOT NULL DEFAULT '{}'::jsonb,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    check_in_time TIME NOT NULL DEFAULT '14:00',
    check_out_time TIME NOT NULL DEFAULT '11:00',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_hotels_tenant_code UNIQUE (tenant_id, code)
);

-- 3. Room Types (Sellable Categories: Deluxe Suite, King Bed, Penthouse, etc.)
CREATE TABLE IF NOT EXISTS public.room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    base_occupancy INT NOT NULL DEFAULT 2,
    max_occupancy INT NOT NULL DEFAULT 4,
    base_price_per_night NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
    total_rooms INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_room_types_hotel_code UNIQUE (hotel_id, code)
);

-- 4. Room Status Enum
DO $$ BEGIN
    CREATE TYPE public.room_status AS ENUM (
        'AVAILABLE',
        'OCCUPIED',
        'DIRTY',
        'CLEANING_IN_PROGRESS',
        'INSPECTION_PENDING',
        'MAINTENANCE',
        'OUT_OF_SERVICE'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 5. Physical Rooms (Specific Room Numbers: 101, 102, 204...)
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    room_type_id UUID NOT NULL REFERENCES public.room_types(id) ON DELETE RESTRICT,
    room_number TEXT NOT NULL,
    floor INT NOT NULL DEFAULT 1,
    status public.room_status NOT NULL DEFAULT 'AVAILABLE',
    key_card_uid TEXT,
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_rooms_hotel_number UNIQUE (hotel_id, room_number)
);

-- Indices for rapid lookup & low-latency API queries
CREATE INDEX IF NOT EXISTS idx_hotels_tenant_id ON public.hotels(tenant_id);
CREATE INDEX IF NOT EXISTS idx_room_types_hotel_id ON public.room_types(hotel_id);
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_status ON public.rooms(hotel_id, status);
CREATE INDEX IF NOT EXISTS idx_rooms_type_id ON public.rooms(room_type_id);

-- Enable Row Level Security (RLS) on all tenant resources
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
