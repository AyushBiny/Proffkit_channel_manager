import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Proffkit Hospitality Guest Portal',
  description: 'Direct multi-tenant hotel reservation engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}

