import React from 'react';
import { calculateHotelKpis } from '@proffkit/business-logic';
import {
  KpiMetricCard,
  THEME_COLORS,
  formatCurrency,
} from '@proffkit/shared-ui';

export default function ExecDashboardPage(): React.ReactElement {
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
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>Executive Dashboard</h1>
        <p style={{ color: THEME_COLORS.textSecondary, fontSize: '13px', margin: 0 }}>
          Real-time aggregated PMS & Channel Manager performance
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <KpiMetricCard
          title="Occupancy"
          value={`${kpis.occupancyRatePercent}%`}
          subtitle={`${kpis.occupiedRooms}/${kpis.availableRooms} rooms`}
          trend={{ direction: 'UP', label: '+4.2%' }}
        />
        <KpiMetricCard
          title="ADR"
          value={formatCurrency(kpis.adr)}
          subtitle="Average Daily Rate"
          trend={{ direction: 'UP', label: '+$14.00' }}
        />
        <KpiMetricCard
          title="RevPAR"
          value={formatCurrency(kpis.revPar)}
          subtitle="Per available room"
          trend={{ direction: 'UP', label: '+8.1%' }}
        />
        <KpiMetricCard
          title="Total Revenue"
          value={formatCurrency(kpis.totalRevenue)}
          subtitle="Rooms + F&B"
        />
      </div>
    </div>
  );
}
