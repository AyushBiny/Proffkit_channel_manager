/**
 * @proffkit/business-logic - Hospitality KPI & Revenue Analytics Engine
 *
 * Core financial metrics standard in hotel revenue management:
 * - ADR (Average Daily Rate)
 * - RevPAR (Revenue Per Available Room)
 * - TRevPAR (Total Revenue Per Available Room)
 * - Occupancy Percentage
 * - GOPPAR (Gross Operating Profit Per Available Room)
 */

export interface HotelKpiInputs {
  totalRooms: number;
  occupiedRooms: number;
  outOfServiceRooms: number;
  roomRevenue: number;
  ancillaryRevenue?: number; // F&B, Spa, Parking, etc.
  operatingExpenses?: number;
}

export interface HotelKpiMetrics {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  outOfServiceRooms: number;
  occupancyRatePercent: number; // e.g. 78.5%
  adr: number; // Average Daily Rate ($)
  revPar: number; // Revenue Per Available Room ($)
  tRevPar: number; // Total Revenue Per Available Room ($)
  totalRevenue: number;
  gopPar?: number; // Gross Operating Profit Per Available Room
}

/**
 * Calculates essential hotel management KPIs.
 * Handles edge cases like 100% out of service or zero occupancy gracefully.
 */
export function calculateHotelKpis(inputs: HotelKpiInputs): HotelKpiMetrics {
  const {
    totalRooms,
    occupiedRooms,
    outOfServiceRooms,
    roomRevenue,
    ancillaryRevenue = 0,
    operatingExpenses = 0,
  } = inputs;

  const availableRooms = Math.max(0, totalRooms - outOfServiceRooms);
  const totalRevenue = roomRevenue + ancillaryRevenue;

  // Occupancy rate = (Occupied Rooms / Available Rooms) * 100
  const occupancyRatePercent =
    availableRooms > 0
      ? Math.min(100, Math.round((occupiedRooms / availableRooms) * 10000) / 100)
      : 0;

  // ADR = Room Revenue / Rooms Sold (Occupied Rooms)
  const adr =
    occupiedRooms > 0
      ? Math.round((roomRevenue / occupiedRooms) * 100) / 100
      : 0;

  // RevPAR = Room Revenue / Available Rooms (or ADR * Occupancy Rate)
  const revPar =
    availableRooms > 0
      ? Math.round((roomRevenue / availableRooms) * 100) / 100
      : 0;

  // TRevPAR = Total Revenue / Available Rooms
  const tRevPar =
    availableRooms > 0
      ? Math.round((totalRevenue / availableRooms) * 100) / 100
      : 0;

  // GOPPAR = (Total Revenue - Operating Expenses) / Available Rooms
  const gopPar =
    availableRooms > 0
      ? Math.round(((totalRevenue - operatingExpenses) / availableRooms) * 100) / 100
      : undefined;

  return {
    totalRooms,
    availableRooms,
    occupiedRooms,
    outOfServiceRooms,
    occupancyRatePercent,
    adr,
    revPar,
    tRevPar,
    totalRevenue,
    gopPar,
  };
}

