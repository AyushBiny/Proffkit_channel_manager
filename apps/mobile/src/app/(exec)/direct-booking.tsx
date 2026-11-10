import React from 'react';
import { THEME_COLORS } from '@proffkit/shared-ui';

export default function DirectBookingPage(): React.ReactElement {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>Direct Booking Engine</h1>
        <p style={{ color: THEME_COLORS.textSecondary, fontSize: '13px', margin: 0 }}>
          Manage your high-converting, zero-commission Next.js guest booking portal
        </p>
      </div>

      <div style={{ backgroundColor: THEME_COLORS.surface, borderRadius: '12px', padding: '24px', border: `1px solid ${THEME_COLORS.border}`, maxWidth: '640px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Direct Booking Portal URL
          </label>
          <input
            type="text"
            readOnly
            value="https://grandpalace.proffkit.com"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${THEME_COLORS.border}`, backgroundColor: '#F9FAFB' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Required Booking Deposit (%)
          </label>
          <input
            type="number"
            defaultValue={20}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${THEME_COLORS.border}` }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            Direct Guest Incentive (Discount %)
          </label>
          <input
            type="number"
            defaultValue={10}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${THEME_COLORS.border}` }}
          />
          <span style={{ fontSize: '11px', color: THEME_COLORS.textSecondary }}>
            Offer guests 10% off to beat OTA prices while still saving ~5% in net fees
          </span>
        </div>

        <button
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: THEME_COLORS.primary,
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Save Engine Settings
        </button>
      </div>
    </div>
  );
}

