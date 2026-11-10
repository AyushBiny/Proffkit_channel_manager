import React from 'react';
import { THEME_COLORS } from '@proffkit/shared-ui';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: THEME_COLORS.background,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Executive App Bar */}
      <header
        style={{
          backgroundColor: THEME_COLORS.surface,
          borderBottom: `1px solid ${THEME_COLORS.border}`,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: THEME_COLORS.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '14px',
            }}
          >
            P
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: THEME_COLORS.textPrimary }}>
              Proffkit Executive
            </h1>
            <span style={{ fontSize: '11px', color: THEME_COLORS.textSecondary }}>
              Grand Palace Resort • Mobile & Exec Web
            </span>
          </div>
        </div>

        {/* Global Quick Navigation */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          <a
            href="/"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              color: THEME_COLORS.primary,
              backgroundColor: '#EFF6FF',
            }}
          >
            Overview
          </a>
          <a
            href="/rooms"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              color: THEME_COLORS.textSecondary,
            }}
          >
            Rooms
          </a>
          <a
            href="/reservations"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              color: THEME_COLORS.textSecondary,
            }}
          >
            Bookings
          </a>
        </nav>
      </header>

      {/* Main Screen Content */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '24px 20px' }}>
        {children}
      </main>
    </div>
  );
}

