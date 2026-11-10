import React from 'react';
import { THEME_COLORS } from '@proffkit/shared-ui';

export default function WebsiteCouponsPage(): React.ReactElement {
  const coupons = [
    { code: 'DIRECT10', discount: '10% OFF', validUntil: '2026-12-31', uses: 142, status: 'ACTIVE' },
    { code: 'EARLYBIRD', discount: '15% OFF', validUntil: '2026-11-30', uses: 89, status: 'ACTIVE' },
    { code: 'SUMMER2026', discount: '$50 OFF', validUntil: '2026-08-31', uses: 210, status: 'EXPIRED' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>Coupons & Promotions</h1>
          <p style={{ color: THEME_COLORS.textSecondary, fontSize: '13px', margin: 0 }}>
            Create promotional codes and direct booking discounts for guests
          </p>
        </div>
        <button
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            backgroundColor: THEME_COLORS.primary,
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Create Coupon
        </button>
      </div>

      <div style={{ backgroundColor: THEME_COLORS.surface, borderRadius: '12px', border: `1px solid ${THEME_COLORS.border}`, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: `1px solid ${THEME_COLORS.border}` }}>
              <th style={{ padding: '12px 16px' }}>Promo Code</th>
              <th style={{ padding: '12px 16px' }}>Discount</th>
              <th style={{ padding: '12px 16px' }}>Expiration Date</th>
              <th style={{ padding: '12px 16px' }}>Total Redemptions</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.code} style={{ borderBottom: `1px solid ${THEME_COLORS.border}` }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: THEME_COLORS.primary }}>{c.code}</td>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{c.discount}</td>
                <td style={{ padding: '14px 16px', color: THEME_COLORS.textSecondary }}>{c.validUntil}</td>
                <td style={{ padding: '14px 16px' }}>{c.uses} bookings</td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: c.status === 'ACTIVE' ? '#DCFCE7' : '#F3F4F6',
                      color: c.status === 'ACTIVE' ? '#15803D' : '#6B7280',
                    }}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
