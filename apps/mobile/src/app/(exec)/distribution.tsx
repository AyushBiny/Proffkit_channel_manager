import React from 'react';
import { THEME_COLORS, formatCurrency } from '@proffkit/shared-ui';

interface ChannelStatus {
  id: string;
  name: string;
  color: string;
  status: 'ACTIVE' | 'SYNCING' | 'ERROR';
  syncedRooms: number;
  lastSyncTime: string;
  todayBookings: number;
  rateDiscrepancies: number;
}

const CHANNELS: ChannelStatus[] = [
  { id: 'booking', name: 'Booking.com', color: '#003580', status: 'ACTIVE', syncedRooms: 45, lastSyncTime: '2 mins ago', todayBookings: 12, rateDiscrepancies: 0 },
  { id: 'airbnb', name: 'Airbnb', color: '#FF385C', status: 'ACTIVE', syncedRooms: 30, lastSyncTime: '1 min ago', todayBookings: 8, rateDiscrepancies: 0 },
  { id: 'expedia', name: 'Expedia', color: '#00355F', status: 'ACTIVE', syncedRooms: 25, lastSyncTime: 'Just now', todayBookings: 5, rateDiscrepancies: 1 },
  { id: 'agoda', name: 'Agoda', color: '#5E2E91', status: 'ACTIVE', syncedRooms: 20, lastSyncTime: '5 mins ago', todayBookings: 4, rateDiscrepancies: 0 },
  { id: 'mmt', name: 'MakeMyTrip', color: '#E23744', status: 'ACTIVE', syncedRooms: 15, lastSyncTime: '10 mins ago', todayBookings: 3, rateDiscrepancies: 0 },
];

export default function DistributionPage(): React.ReactElement {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>Channel Distribution Manager</h1>
        <p style={{ color: THEME_COLORS.textSecondary, fontSize: '13px', margin: 0 }}>
          Live ARI (Availability, Rates & Inventory) two-way synchronization
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {CHANNELS.map((ch) => (
          <div
            key={ch.id}
            style={{
              backgroundColor: THEME_COLORS.surface,
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${THEME_COLORS.border}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: ch.color }} />
                <strong style={{ fontSize: '16px' }}>{ch.name}</strong>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                }}
              >
                ● {ch.status}
              </span>
            </div>

            <div style={{ fontSize: '13px', color: THEME_COLORS.textSecondary, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>Synced Inventory: <strong style={{ color: THEME_COLORS.textPrimary }}>{ch.syncedRooms} Rooms</strong></div>
              <div>Today's Bookings: <strong style={{ color: THEME_COLORS.textPrimary }}>{ch.todayBookings}</strong></div>
              <div>Last Synced: <strong>{ch.lastSyncTime}</strong></div>
              {ch.rateDiscrepancies > 0 && (
                <div style={{ color: THEME_COLORS.warning, fontWeight: 600 }}>
                  ⚠️ {ch.rateDiscrepancies} Rate Parity Discrepancy Flagged
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

