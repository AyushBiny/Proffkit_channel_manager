import React from 'react';
import { THEME_COLORS } from '@proffkit/shared-ui';

export default function PaymentsAndIntegrationsPage(): React.ReactElement {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>Payments & Hardware Bridges</h1>
        <p style={{ color: THEME_COLORS.textSecondary, fontSize: '13px', margin: 0 }}>
          Manage online payment gateways, reception thermal printers, and RFID keycard encoders
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Payment Gateways */}
        <div style={{ backgroundColor: THEME_COLORS.surface, borderRadius: '12px', padding: '20px', border: `1px solid ${THEME_COLORS.border}` }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Payment Processing</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', border: `1px solid ${THEME_COLORS.border}` }}>
              <div>
                <strong>Stripe Payments</strong>
                <div style={{ fontSize: '12px', color: THEME_COLORS.textSecondary }}>Credit cards, Apple Pay, Google Pay</div>
              </div>
              <span style={{ color: THEME_COLORS.success, fontWeight: 600, fontSize: '12px' }}>✓ Connected</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', border: `1px solid ${THEME_COLORS.border}` }}>
              <div>
                <strong>Razorpay</strong>
                <div style={{ fontSize: '12px', color: THEME_COLORS.textSecondary }}>UPI, NetBanking & Cards</div>
              </div>
              <span style={{ color: THEME_COLORS.textSecondary, fontSize: '12px' }}>Configure</span>
            </div>
          </div>
        </div>

        {/* Reception Hardware */}
        <div style={{ backgroundColor: THEME_COLORS.surface, borderRadius: '12px', padding: '20px', border: `1px solid ${THEME_COLORS.border}` }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Reception Hardware Bridges</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', border: `1px solid ${THEME_COLORS.border}` }}>
              <div>
                <strong>ESC/POS Thermal Printer</strong>
                <div style={{ fontSize: '12px', color: THEME_COLORS.textSecondary }}>Epson TM-T88VI (USB/Network)</div>
              </div>
              <span style={{ color: THEME_COLORS.success, fontWeight: 600, fontSize: '12px' }}>● Ready</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '8px', border: `1px solid ${THEME_COLORS.border}` }}>
              <div>
                <strong>Mifare RFID Encoder</strong>
                <div style={{ fontSize: '12px', color: THEME_COLORS.textSecondary }}>VingCard / Saflok USB Bridge</div>
              </div>
              <span style={{ color: THEME_COLORS.success, fontWeight: 600, fontSize: '12px' }}>● Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

