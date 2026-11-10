import React from 'react';
import { THEME_COLORS, formatCurrency } from '@proffkit/shared-ui';

export default function RoomsAndRatesPage(): React.ReactElement {
  const roomTypes = [
    { code: 'DLX-KNG', name: 'Deluxe King Suite', basePrice: 240, total: 20, available: 6, stopSell: false },
    { code: 'OCN-VIEW', name: 'Oceanfront Balcony Suite', basePrice: 320, total: 15, available: 2, stopSell: false },
    { code: 'STD-QUN', name: 'Standard Queen Room', basePrice: 160, total: 40, available: 12, stopSell: false },
    { code: 'PRZ-STE', name: 'Presidential Penthouse', basePrice: 850, total: 2, available: 0, stopSell: true },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>Rooms & Rate Plans</h1>
        <p style={{ color: THEME_COLORS.textSecondary, fontSize: '13px', margin: 0 }}>
          Manage room inventory, base prices, and channel restrictions
        </p>
      </div>

      <div style={{ backgroundColor: THEME_COLORS.surface, borderRadius: '12px', border: `1px solid ${THEME_COLORS.border}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: `1px solid ${THEME_COLORS.border}` }}>
              <th style={{ padding: '12px 16px' }}>Code</th>
              <th style={{ padding: '12px 16px' }}>Room Type</th>
              <th style={{ padding: '12px 16px' }}>Base Nightly Rate</th>
              <th style={{ padding: '12px 16px' }}>Total Rooms</th>
              <th style={{ padding: '12px 16px' }}>Available Today</th>
              <th style={{ padding: '12px 16px' }}>Restriction</th>
            </tr>
          </thead>
          <tbody>
            {roomTypes.map((rt) => (
              <tr key={rt.code} style={{ borderBottom: `1px solid ${THEME_COLORS.border}` }}>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{rt.code}</td>
                <td style={{ padding: '14px 16px' }}>{rt.name}</td>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: THEME_COLORS.primary }}>
                  {formatCurrency(rt.basePrice)}
                </td>
                <td style={{ padding: '14px 16px' }}>{rt.total}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontWeight: 600, color: rt.available > 0 ? THEME_COLORS.success : THEME_COLORS.danger }}>
                    {rt.available} left
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {rt.stopSell ? (
                    <span style={{ color: THEME_COLORS.danger, fontWeight: 600 }}>Stop Sell</span>
                  ) : (
                    <span style={{ color: THEME_COLORS.textSecondary }}>Open</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
