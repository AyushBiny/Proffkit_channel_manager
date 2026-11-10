import React from 'react';
import { THEME_COLORS, formatCurrency, ReservationBadge } from '@proffkit/shared-ui';

export default function ReservationsPage(): React.ReactElement {
  const bookings = [
    { id: 'PRF-1092', guest: 'Eleanor Vance', room: '204 (Deluxe King)', checkIn: '2026-11-10', checkOut: '2026-11-14', channel: 'Direct Web', total: 960, status: 'CHECKED_IN' as const },
    { id: 'PRF-1093', guest: 'Marcus Sterling', room: '305 (Ocean Suite)', checkIn: '2026-11-11', checkOut: '2026-11-16', channel: 'Booking.com', total: 1600, status: 'CONFIRMED' as const },
    { id: 'PRF-1094', guest: 'Dr. Sarah Connor', room: '108 (Standard Queen)', checkIn: '2026-11-09', checkOut: '2026-11-11', channel: 'Expedia', total: 320, status: 'CHECKED_OUT' as const },
    { id: 'PRF-1095', guest: 'Arthur Pendelton', room: '401 (Presidential)', checkIn: '2026-11-12', checkOut: '2026-11-18', channel: 'Front Desk', total: 5100, status: 'CONFIRMED' as const },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>Master Reservations</h1>
        <p style={{ color: THEME_COLORS.textSecondary, fontSize: '13px', margin: 0 }}>
          Central booking log unified across all OTA channels and Reception Desk
        </p>
      </div>

      <div style={{ backgroundColor: THEME_COLORS.surface, borderRadius: '12px', border: `1px solid ${THEME_COLORS.border}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: `1px solid ${THEME_COLORS.border}` }}>
              <th style={{ padding: '12px 16px' }}>Booking Ref</th>
              <th style={{ padding: '12px 16px' }}>Guest Name</th>
              <th style={{ padding: '12px 16px' }}>Room Allocation</th>
              <th style={{ padding: '12px 16px' }}>Dates</th>
              <th style={{ padding: '12px 16px' }}>Channel</th>
              <th style={{ padding: '12px 16px' }}>Total Amount</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} style={{ borderBottom: `1px solid ${THEME_COLORS.border}` }}>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{b.id}</td>
                <td style={{ padding: '14px 16px' }}>{b.guest}</td>
                <td style={{ padding: '14px 16px', color: THEME_COLORS.textSecondary }}>{b.room}</td>
                <td style={{ padding: '14px 16px' }}>{b.checkIn} → {b.checkOut}</td>
                <td style={{ padding: '14px 16px' }}>{b.channel}</td>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>{formatCurrency(b.total)}</td>
                <td style={{ padding: '14px 16px' }}>
                  <ReservationBadge status={b.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
