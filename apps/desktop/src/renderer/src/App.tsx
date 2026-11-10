import React, { useState } from 'react';
import type { Reservation, RoomStatus } from '@proffkit/db-types';
import { calculateReservationQuote } from '@proffkit/business-logic';
import {
  ReservationBadge,
  RoomStatusIndicator,
  PriceSummaryCard,
} from '@proffkit/shared-ui';

export function ReceptionApp(): React.ReactElement {
  const [selectedRoomStatus, setSelectedRoomStatus] = useState<RoomStatus>('AVAILABLE');

  // Unified quote calculated from shared pricing formula
  const activeQuote = calculateReservationQuote({
    checkInDate: '2026-11-15',
    checkOutDate: '2026-11-18',
    basePricePerNight: 160,
    adultCount: 2,
    childCount: 1,
    discountPercent: 10,
  });

  const mockReservation: Reservation = {
    id: 'res_001',
    hotelId: 'htl_nyc_01',
    reservationNumber: 'PRF-8821',
    guestId: 'gst_991',
    roomTypeId: 'rmt_dlx',
    roomId: 'rm_204',
    checkInDate: '2026-11-15',
    checkOutDate: '2026-11-18',
    adultCount: 2,
    childCount: 1,
    status: 'CHECKED_IN',
    channel: 'FRONT_DESK',
    nightlyRate: 160,
    totalNights: activeQuote.nights,
    subtotalAmount: activeQuote.taxableSubtotal,
    taxAmount: activeQuote.taxAmount,
    totalAmount: activeQuote.totalAmount,
    depositPaid: activeQuote.depositRequired,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Proffkit Reception PC (Electron)</h1>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
        <span>Reservation {mockReservation.reservationNumber}:</span>
        <ReservationBadge status={mockReservation.status} />
        <span>Room 204:</span>
        <RoomStatusIndicator status={selectedRoomStatus} />
      </div>

      <PriceSummaryCard quote={activeQuote} />
    </div>
  );
}

export default ReceptionApp;

