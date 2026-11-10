import React from 'react';
import { THEME_COLORS } from '@proffkit/shared-ui';

export default function RootAppLayout({
  children,
}: {
  children?: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: THEME_COLORS.background,
        color: THEME_COLORS.textPrimary,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
