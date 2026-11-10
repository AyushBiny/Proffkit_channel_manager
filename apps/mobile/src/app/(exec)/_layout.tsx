import React from 'react';
import { THEME_COLORS } from '@proffkit/shared-ui';

interface ExecLayoutProps {
  children?: React.ReactNode;
}

const NAV_ITEMS = [
  { href: '/(exec)/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/(exec)/distribution', label: 'Distribution', icon: '🌐' },
  { href: '/(exec)/rooms-rates', label: 'Rooms & Rates', icon: '🛏️' },
  { href: '/(exec)/reservations', label: 'Reservations', icon: '📋' },
  { href: '/(exec)/insights', label: 'Insights', icon: '📈' },
  { href: '/(exec)/direct-booking', label: 'Direct Booking', icon: '⚡' },
  { href: '/(exec)/payments-integrations', label: 'Payments & Hardware', icon: '💳' },
  { href: '/(exec)/website-coupons', label: 'Coupons & Promos', icon: '🎟️' },
];

export default function ExecModuleLayout({ children }: ExecLayoutProps): React.ReactElement {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: THEME_COLORS.background }}>
      {/* Executive Sidebar Navigation */}
      <aside
        style={{
          width: '240px',
          backgroundColor: THEME_COLORS.surface,
          borderRight: `1px solid ${THEME_COLORS.border}`,
          padding: '20px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div style={{ padding: '0 12px 16px 12px', borderBottom: `1px solid ${THEME_COLORS.border}`, marginBottom: '12px' }}>
          <div style={{ fontWeight: 700, fontSize: '15px', color: THEME_COLORS.primaryDark }}>
            Proffkit Exec
          </div>
          <div style={{ fontSize: '11px', color: THEME_COLORS.textSecondary }}>
            Channel Manager & PMS
          </div>
        </div>

        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 500,
              color: THEME_COLORS.textPrimary,
              transition: 'background-color 0.15s ease',
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </aside>

      {/* Main Module Content */}
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}

