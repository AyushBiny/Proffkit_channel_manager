/**
 * @proffkit/business-logic - Two-Way Channel Manager & Inventory Pooling
 *
 * Prevents overbooking across OTAs and PMS:
 * - Central Inventory Pooling (Single source of truth for room stock)
 * - Rate Parity Monitoring (Audits OTA rates against Direct Website rates)
 * - ARI (Availability, Rates & Inventory) Sync Payloads
 */

import type { BookingChannel, Room, Reservation, RoomType } from '@proffkit/db-types';

export interface RoomAvailabilityQuery {
  hotelId: string;
  roomTypeId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface DailyInventorySlot {
  date: string;
  totalRooms: number;
  maintenanceRooms: number;
  reservedRooms: number;
  sellableInventory: number;
  baseRate: number;
  stopSell: boolean;
  minStay: number;
}

export interface RateParityDiscrepancy {
  channel: BookingChannel;
  roomTypeId: string;
  date: string;
  directWebRate: number;
  otaRate: number;
  difference: number;
  violatesParity: boolean;
}

/**
 * Calculates sellable inventory across a date range for a specific room type.
 */
export function calculateSellableInventory(
  roomType: RoomType,
  rooms: Room[],
  activeReservations: Reservation[],
  startDate: string,
  endDate: string
): DailyInventorySlot[] {
  const matchingRooms = rooms.filter((r) => r.roomTypeId === roomType.id);
  const outOfOrderCount = matchingRooms.filter(
    (r) => r.status === 'MAINTENANCE' || r.status === 'OUT_OF_SERVICE'
  ).length;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

  const inventoryCalendar: DailyInventorySlot[] = [];

  for (let i = 0; i < diffDays; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];

    // Find overlapping reservations for this specific night
    const reservedCount = activeReservations.filter((res) => {
      if (res.roomTypeId !== roomType.id) return false;
      if (res.status === 'CANCELLED' || res.status === 'CHECKED_OUT' || res.status === 'NO_SHOW') return false;
      return res.checkInDate <= dateStr && res.checkOutDate > dateStr;
    }).length;

    const sellable = Math.max(0, matchingRooms.length - outOfOrderCount - reservedCount);

    inventoryCalendar.push({
      date: dateStr,
      totalRooms: matchingRooms.length,
      maintenanceRooms: outOfOrderCount,
      reservedRooms: reservedCount,
      sellableInventory: sellable,
      baseRate: roomType.basePricePerNight,
      stopSell: sellable === 0,
      minStay: 1,
    });
  }

  return inventoryCalendar;
}

/**
 * Rate Parity Auditor:
 * Flags any OTA that lists rates cheaper than the hotel's Direct Web channel.
 */
export function auditRateParity(
  directWebRate: number,
  otaRates: Array<{ channel: BookingChannel; rate: number }>,
  roomTypeId: string,
  date: string
): RateParityDiscrepancy[] {
  return otaRates.map((ota) => {
    const diff = ota.rate - directWebRate;
    // Parity violation occurs if OTA rate is strictly lower than direct website
    const violatesParity = ota.rate < directWebRate;

    return {
      channel: ota.channel,
      roomTypeId,
      date,
      directWebRate,
      otaRate: ota.rate,
      difference: Math.round(diff * 100) / 100,
      violatesParity,
    };
  });
}

