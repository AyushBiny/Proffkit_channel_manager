/**
 * @proffkit/shared-ui
 * Shared design tokens, status badges, and pricing cards.
 * Consumed by Reception Desktop, Hotel Website, and Exec Mobile/Web.
 */

import React from 'react';
import type { ReservationStatus, RoomStatus } from '@proffkit/db-types';
import type { PricingQuote } from '@proffkit/business-logic';

export const THEME_COLORS = {
  primary: '#1E40AF', // Royal Blue
  primaryDark: '#1E3A8A',
  success: '#15803D', // Forest Green
  warning: '#B45309', // Amber
  danger: '#B91C1C', // Crimson
  neutral: '#4B5563', // Slate Gray
  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
} as const;

export const STATUS_STYLES: Record<
  ReservationStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  CONFIRMED: {
    label: 'Confirmed',
    bg: '#EFF6FF',
    text: '#1D4ED8',
    border: '#BFDBFE',
  },
  CHECKED_IN: {
    label: 'Checked In',
    bg: '#F0FDF4',
    text: '#15803D',
    border: '#BBF7D0',
  },
  CHECKED_OUT: {
    label: 'Checked Out',
    bg: '#F3F4F6',
    text: '#374151',
    border: '#E5E7EB',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: '#FEF2F2',
    text: '#B91C1C',
    border: '#FECACA',
  },
  NO_SHOW: {
    label: 'No Show',
    bg: '#FFFBEB',
    text: '#B45309',
    border: '#FDE68A',
  },
};

export const ROOM_STATUS_STYLES: Record<
  RoomStatus,
  { label: string; bg: string; text: string }
> = {
  AVAILABLE: { label: 'Available', bg: '#DCFCE7', text: '#15803D' },
  OCCUPIED: { label: 'Occupied', bg: '#DBEAFE', text: '#1D4ED8' },
  DIRTY: { label: 'Dirty', bg: '#FEE2E2', text: '#B91C1C' },
  CLEANING_IN_PROGRESS: { label: 'Cleaning', bg: '#FEF3C7', text: '#B45309' },
  INSPECTION_PENDING: { label: 'Inspect', bg: '#EDE9FE', text: '#6D28D9' },
  MAINTENANCE: { label: 'Maintenance', bg: '#FFEDD5', text: '#C2410C' },
  OUT_OF_SERVICE: { label: 'Out of Service', bg: '#F3F4F6', text: '#4B5563' },
};

/**
 * Currency Formatter
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Universal Reservation Badge Component
 */
export function ReservationBadge({ status }: { status: ReservationStatus }): React.ReactElement {
  const style = STATUS_STYLES[status] || STATUS_STYLES.CONFIRMED;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        letterSpacing: '0.025em',
      }}
    >
      {style.label}
    </span>
  );
}

/**
 * Universal Room Status Indicator
 */
export function RoomStatusIndicator({ status }: { status: RoomStatus }): React.ReactElement {
  const style = ROOM_STATUS_STYLES[status] || ROOM_STATUS_STYLES.AVAILABLE;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 500,
        backgroundColor: style.bg,
        color: style.text,
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: style.text,
        }}
      />
      {style.label}
    </span>
  );
}

/**
 * Universal Price Breakdown Card
 */
export function PriceSummaryCard({ quote }: { quote: PricingQuote }): React.ReactElement {
  return (
    <div
      style={{
        backgroundColor: THEME_COLORS.surface,
        border: `1px solid ${THEME_COLORS.border}`,
        borderRadius: '10px',
        padding: '16px',
        maxWidth: '360px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '10px',
          borderBottom: `1px solid ${THEME_COLORS.border}`,
          paddingBottom: '8px',
        }}
      >
        <span style={{ fontWeight: 600, color: THEME_COLORS.textPrimary }}>
          Stay Duration
        </span>
        <span style={{ color: THEME_COLORS.textSecondary }}>
          {quote.nights} {quote.nights === 1 ? 'Night' : 'Nights'}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '6px 0', fontSize: '14px' }}>
        <span style={{ color: THEME_COLORS.textSecondary }}>Gross Subtotal</span>
        <span style={{ color: THEME_COLORS.textPrimary }}>{formatCurrency(quote.grossTotal, quote.currency)}</span>
      </div>

      {quote.discountAmount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '6px 0', fontSize: '14px', color: THEME_COLORS.success }}>
          <span>Discount</span>
          <span>-{formatCurrency(quote.discountAmount, quote.currency)}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '6px 0', fontSize: '14px' }}>
        <span style={{ color: THEME_COLORS.textSecondary }}>Taxes & Levies</span>
        <span style={{ color: THEME_COLORS.textPrimary }}>{formatCurrency(quote.taxAmount, quote.currency)}</span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: `1px solid ${THEME_COLORS.border}`,
          fontWeight: 700,
          fontSize: '16px',
          color: THEME_COLORS.textPrimary,
        }}
      >
        <span>Total Due</span>
        <span>{formatCurrency(quote.totalAmount, quote.currency)}</span>
      </div>

      <div
        style={{
          marginTop: '8px',
          fontSize: '12px',
          color: THEME_COLORS.primary,
          fontWeight: 500,
        }}
      >
        Required Deposit: {formatCurrency(quote.depositRequired, quote.currency)}
      </div>
    </div>
  );
}

