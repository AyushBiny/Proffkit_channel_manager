import React from 'react';
import type { Reservation, RoomStatus } from '@proffkit/db-types';
import { calculateReservationQuote } from '@proffkit/business-logic';
import {
  THEME_COLORS,
  formatCurrency,
  STATUS_STYLES,
  ROOM_STATUS_STYLES,
} from '@proffkit/shared-ui';

export function ExecMobileApp(): React.ReactElement {
  // Real-time calculation using shared business-logic
  const quote = calculateReservationQuote({
    checkInDate: '2026-11-20',
    checkOutDate: '2026-11-25',
    basePricePerNight: 210,
    adultCount: 2,
    childCount: 0,
    discountPercent: 15,
  });

  const reservation: Reservation = {
    id: 'res_mobile_99',
    hotelId: 'htl_01',
    reservationNumber: 'EXEC-7729',
    guestId: 'gst_vip_04',
    roomTypeId: 'rmt_presidential',
    checkInDate: '2026-11-20',
    checkOutDate: '2026-11-25',
    adultCount: 2,
    childCount: 0,
    status: 'CONFIRMED',
    channel: 'MOBILE_APP',
    nightlyRate: 210,
    totalNights: quote.nights,
    subtotalAmount: quote.taxableSubtotal,
    taxAmount: quote.taxAmount,
    totalAmount: quote.totalAmount,
    depositPaid: quote.depositRequired,
    currency: 'USD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const statusStyle = STATUS_STYLES[reservation.status];

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: THEME_COLORS.background,
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <header style={{ marginBottom: '16px' }}>
        <h2 style={{ color: THEME_COLORS.primaryDark, margin: '0 0 4px 0' }}>
          Proffkit Executive Mobile & Web
        </h2>
        <span style={{ fontSize: '13px', color: THEME_COLORS.textSecondary }}>
          Real-time Property Analytics & VIP Check-In
        </span>
      </header>

      <div
        style={{
          backgroundColor: THEME_COLORS.surface,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${THEME_COLORS.border}`,
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>{reservation.reservationNumber}</strong>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 600,
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
            }}
          >
            {statusStyle.label}
          </span>
        </div>

        <div style={{ marginTop: '12px', fontSize: '14px', color: THEME_COLORS.textPrimary }}>
          <div>Dates: {reservation.checkInDate} → {reservation.checkOutDate} ({quote.nights} nights)</div>
          <div style={{ marginTop: '6px', fontWeight: 600 }}>
            Revenue: {formatCurrency(quote.totalAmount, quote.currency)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExecMobileApp;

