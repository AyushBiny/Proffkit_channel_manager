import React from 'react';
import { THEME_COLORS, formatCurrency } from '@proffkit/shared-ui';

export default function InsightsPage(): React.ReactElement {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>Revenue & Yield Insights</h1>
        <p style={{ color: THEME_COLORS.textSecondary, fontSize: '13px', margin: 0 }}>
          Channel commission breakdown, net yield analysis, and pricing optimization
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: THEME_COLORS.surface, borderRadius: '12px', padding: '24px', border: `1px solid ${THEME_COLORS.border}` }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Channel Commission Analysis</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Direct Web (0% Commission)</span>
              <strong style={{ color: THEME_COLORS.success }}>Net Yield: 100%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Airbnb (3% Host Fee)</span>
              <strong style={{ color: THEME_COLORS.primary }}>Net Yield: 97%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Booking.com (15% Commission)</span>
              <strong style={{ color: THEME_COLORS.warning }}>Net Yield: 85%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Expedia (18% Commission)</span>
              <strong style={{ color: THEME_COLORS.danger }}>Net Yield: 82%</strong>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: THEME_COLORS.surface, borderRadius: '12px', padding: '24px', border: `1px solid ${THEME_COLORS.border}` }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Direct Booking Savings</h3>
          <p style={{ fontSize: '14px', color: THEME_COLORS.textSecondary }}>
            By driving bookings through your direct Next.js website this month, you saved:
          </p>
          <div style={{ fontSize: '32px', fontWeight: 700, color: THEME_COLORS.success, margin: '12px 0' }}>
            {formatCurrency(2480)}
          </div>
          <span style={{ fontSize: '12px', color: THEME_COLORS.textSecondary }}>
            Calculated against standard 15% average OTA commission rate
          </span>
        </div>
      </div>
    </div>
  );
}

