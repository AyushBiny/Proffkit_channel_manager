'use client';

import React, { useState } from 'react';
import type { Hotel, RoomType } from '@proffkit/db-types';
import { calculateReservationQuote } from '@proffkit/business-logic';
import {
  PriceSummaryCard,
  ReservationBadge,
  THEME_COLORS,
  formatCurrency,
} from '@proffkit/shared-ui';

interface TenantPageProps {
  params: { tenantSlug: string };
}

// Mock hotel registry (in production loaded from DB/Redis based on tenantSlug)
const TENANT_HOTELS: Record<string, Hotel> = {
  grandpalace: {
    id: 'htl_grandpalace_01',
    tenantId: 'tnt_grandpalace',
    name: 'The Grand Palace Resort & Spa',
    code: 'GPRS-MIA',
    timeZone: 'America/New_York',
    currency: 'USD',
    address: {
      street: '100 Ocean Drive',
      city: 'Miami Beach',
      state: 'FL',
      country: 'USA',
      postalCode: '33139',
    },
    contactEmail: 'reservations@grandpalace.com',
    contactPhone: '+1-305-555-0100',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  alpinelodge: {
    id: 'htl_alpinelodge_02',
    tenantId: 'tnt_alpinelodge',
    name: 'Alpine Vista Ski Chalet',
    code: 'AVSC-ASP',
    timeZone: 'America/Denver',
    currency: 'USD',
    address: {
      street: '450 Mountain Ridge Way',
      city: 'Aspen',
      state: 'CO',
      country: 'USA',
      postalCode: '81611',
    },
    contactEmail: 'stay@alpinelodge.com',
    contactPhone: '+1-970-555-0240',
    checkInTime: '16:00',
    checkOutTime: '10:00',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

const SAMPLE_ROOMS: RoomType[] = [
  {
    id: 'rmt_deluxe_ocean',
    hotelId: 'htl_grandpalace_01',
    code: 'DLX-OCN',
    name: 'Deluxe Oceanfront Suite',
    description: 'Spacious suite with king bed, ocean view balcony, marble soaking tub, and lounge area.',
    baseOccupancy: 2,
    maxOccupancy: 4,
    basePricePerNight: 290,
    amenities: ['Oceanfront Balcony', 'King Size Bed', 'Complimentary Breakfast', 'High-Speed Wi-Fi', 'Espresso Machine'],
    totalRooms: 15,
  },
  {
    id: 'rmt_standard_king',
    hotelId: 'htl_grandpalace_01',
    code: 'STD-KNG',
    name: 'Classic King Room',
    description: 'Comfortable king room with city skyline views and executive workspace.',
    baseOccupancy: 2,
    maxOccupancy: 2,
    basePricePerNight: 185,
    amenities: ['City View', 'King Size Bed', 'Work Desk', 'Smart TV'],
    totalRooms: 25,
  },
];

export default function TenantHotelWebsite({ params }: TenantPageProps): React.ReactElement {
  const slug = params?.tenantSlug || 'grandpalace';
  const hotel = TENANT_HOTELS[slug] || TENANT_HOTELS.grandpalace;

  const [selectedRoomId, setSelectedRoomId] = useState<string>(SAMPLE_ROOMS[0].id);
  const [checkIn, setCheckIn] = useState<string>('2026-12-15');
  const [checkOut, setCheckOut] = useState<string>('2026-12-19');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  const selectedRoom = SAMPLE_ROOMS.find((r) => r.id === selectedRoomId) || SAMPLE_ROOMS[0];

  // Guaranteed unified pricing via shared @proffkit/business-logic
  const quote = calculateReservationQuote(
    {
      checkInDate: checkIn,
      checkOutDate: checkOut,
      basePricePerNight: selectedRoom.basePricePerNight,
      adultCount: adults,
      childCount: children,
      discountPercent: 10,
    },
    hotel.currency
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hotel Hero Banner */}
      <header
        style={{
          backgroundColor: THEME_COLORS.primaryDark,
          color: '#FFFFFF',
          padding: '48px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>
            Direct Booking Portal • Tenant: {slug}
          </span>
          <h1 style={{ fontSize: '36px', margin: '12px 0 8px 0' }}>{hotel.name}</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            {hotel.address.street}, {hotel.address.city}, {hotel.address.state} • {hotel.contactPhone}
          </p>
        </div>
      </header>

      {/* Main Reservation Engine */}
      <main style={{ maxWidth: '1100px', margin: '32px auto', padding: '0 20px' }}>
        {/* Booking Controls */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            marginBottom: '32px',
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>
              Check-In
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>
              Check-Out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>
              Adults
            </label>
            <select
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Adult' : 'Adults'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4B5563', marginBottom: '4px' }}>
              Children
            </label>
            <select
              value={children}
              onChange={(e) => setChildren(Number(e.target.value))}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
            >
              {[0, 1, 2, 3].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Child' : 'Children'}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Content Layout: Room Selection + Live Quote */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
          <div>
            <h2 style={{ fontSize: '22px', marginBottom: '16px', color: '#1F2937' }}>Select Your Accommodation</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {SAMPLE_ROOMS.map((room) => {
                const isSelected = room.id === selectedRoomId;
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '20px',
                      border: `2px solid ${isSelected ? THEME_COLORS.primary : '#E5E7EB'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#111827' }}>{room.name}</h3>
                        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#4B5563' }}>{room.description}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '20px', fontWeight: 700, color: THEME_COLORS.primaryDark }}>
                          {formatCurrency(room.basePricePerNight, hotel.currency)}
                        </span>
                        <span style={{ fontSize: '12px', color: '#6B7280', display: 'block' }}>/ night</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {room.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          style={{
                            fontSize: '11px',
                            backgroundColor: '#F3F4F6',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            color: '#374151',
                          }}
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Price Summary via Shared UI */}
          <div>
            <h2 style={{ fontSize: '22px', marginBottom: '16px', color: '#1F2937' }}>Reservation Breakdown</h2>
            <PriceSummaryCard quote={quote} />

            <button
              onClick={() => alert(`Direct booking initiated for ${hotel.name} - Room: ${selectedRoom.name}`)}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: THEME_COLORS.primary,
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Confirm & Pay Deposit ({formatCurrency(quote.depositRequired, quote.currency)})
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
