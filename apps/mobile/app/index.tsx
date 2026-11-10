import React from 'react';
import { calculateHotelKpis } from '@proffkit/business-logic';
import {
  KpiMetricCard,
  THEME_COLORS,
  formatCurrency,
} from '@proffkit/shared-ui';

export default function ExecDashboardScreen(): React.ReactElement {
  // Live KPI calculation powered by @proffkit/business-logic
  const kpis = calculateHotelKpis({
    totalRooms: 120,
    occupiedRooms: 94,
    outOfServiceRooms: 4,
    roomRevenue: 17860,
    ancillaryRevenue: 3420,
    operatingExpenses: 6800,
  });

  return (
    <div>
      {/* Page Title */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0', color: THEME_COLORS.textPrimary }}>
          Today's Property Performance
        </h2>
        <span style={{ fontSize: '13px', color: THEME_COLORS.textSecondary }}>
          Real-time metrics aggregated across Front Desk, Web, and OTA channels
        </span>
      </div>

      {/* KPI Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <KpiMetricCard
          title="Occupancy Rate"
          value={`${kpis.occupancyRatePercent}%`}
          subtitle={`${kpis.occupiedRooms} / ${kpis.availableRooms} rooms sold`}
          trend={{ direction: 'UP', label: '+4.2% vs yesterday' }}
        />
        <KpiMetricCard
          title="ADR (Avg Daily Rate)"
          value={formatCurrency(kpis.adr)}
          subtitle="Per occupied room"
          trend={{ direction: 'UP', label: '+$12.50 vs target' }}
        />
        <KpiMetricCard
          title="RevPAR"
          value={formatCurrency(kpis.revPar)}
          subtitle="Per available room"
          trend={{ direction: 'UP', label: '+8.1% vs last week' }}
        />
        <KpiMetricCard
          title="Total Daily Revenue"
          value={formatCurrency(kpis.totalRevenue)}
          subtitle="Rooms + F&B + Ancillary"
        />
      </div>

      {/* Quick Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div
          style={{
            backgroundColor: THEME_COLORS.surface,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${THEME_COLORS.border}`,
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: THEME_COLORS.textPrimary }}>
            Channel Revenue Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>Direct Website</span>
              <strong>{formatCurrency(8450)} (47%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>Front Desk Walk-Ins</span>
              <strong>{formatCurrency(4120)} (23%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>Booking.com (OTA)</span>
              <strong>{formatCurrency(3690)} (21%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>Expedia (OTA)</span>
              <strong>{formatCurrency(1600)} (9%)</strong>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: THEME_COLORS.surface,
            borderRadius: '12px',
            padding: '20px',
            border: `1px solid ${THEME_COLORS.border}`,
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: THEME_COLORS.textPrimary }}>
            Today's Front Desk Operations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>Scheduled Arrivals</span>
              <strong>28 Guests</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>Scheduled Departures</span>
              <strong>22 Guests</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>In-House VIP Guests</span>
              <strong style={{ color: THEME_COLORS.primaryDark }}>6 VIPs</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>Out of Order Rooms</span>
              <strong style={{ color: THEME_COLORS.warning }}>{kpis.outOfServiceRooms} Rooms</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

