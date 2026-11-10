'use client';

import React from 'react';
import type { Hotel, RoomType } from '@proffkit/db-types';
import { calculateReservationQuote } from '@proffkit/business-logic';
import { PriceSummaryCard, ReservationBadge } from '@proffkit/shared-ui';

export default function GuestBookingPage(): React.ReactElement {
  const currentHotel: Hotel = {
    id: 'htl_grand_palace',
    tenantId: 'tnt_luxury_resorts',
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
    contactEmail: 'concierge@grandpalace.com',
    contactPhone: '+1-305-555-0199',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const selectedRoom: RoomType = {
    id: 'rmt_ocean_view',
    hotelId: currentHotel.id,
    code: 'OCN-STE',
    name: 'Ocean View Executive Suite',
    baseOccupancy: 2,
    maxOccupancy: 4,
    basePricePerNight: 280,
    amenities: ['King Bed', 'Private Balcony', 'Ocean View', 'Complimentary Breakfast', 'High-Speed Wi-Fi'],
    totalRooms: 12,
  };

  // Uses identical pricing engine from @proffkit/business-logic
  const quote = calculateReservationQuote(
    {
      checkInDate: '2026-12-20',
      checkOutDate: '2026-12-24',
      basePricePerNight: selectedRoom.basePricePerNight,
      adultCount: 2,
      childCount: 1,
      discountPercent: 5,
    },
    currentHotel.currency
  );

  return (
    <main style={{ maxWidth: '960px', margin: '40px auto', padding: '0 20px' }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>{currentHotel.name}</h1>
        <p style={{ color: '#666' }}>{currentHotel.address.city}, {currentHotel.address.country}</p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
        <div>
          <h2>{selectedRoom.name}</h2>
          <div style={{ marginBottom: '12px' }}>
            <ReservationBadge status="CONFIRMED" />
          </div>
          <p>Amenities: {selectedRoom.amenities.join(' • ')}</p>
        </div>

        <div>
          <PriceSummaryCard quote={quote} />
        </div>
      </section>
    </main>
  );
}

