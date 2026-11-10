/**
 * @proffkit/business-logic
 * Core domain rules, unified pricing engine, and validations.
 * Shared across Mobile, Desktop, Website, and Cloud-Worker.
 */

import type { Reservation, RoomType, ReservationStatus } from '@proffkit/db-types';

export interface PricingParameters {
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  basePricePerNight: number;
  adultCount: number;
  childCount: number;
  baseOccupancy?: number;
  maxOccupancy?: number;
  extraGuestSurchargePerNight?: number;
  taxRatePercent?: number; // e.g. 12 for 12%
  discountPercent?: number; // e.g. 10 for 10%
  depositRequiredPercent?: number; // e.g. 20 for 20%
}

export interface NightlyRateDetail {
  date: string;
  baseRate: number;
  extraGuestFee: number;
  effectiveRate: number;
}

export interface PricingQuote {
  nights: number;
  nightlyRates: NightlyRateDetail[];
  grossTotal: number;
  discountAmount: number;
  taxableSubtotal: number;
  taxAmount: number;
  totalAmount: number;
  depositRequired: number;
  currency: string;
}

/**
 * Calculates number of nights between check-in and check-out.
 */
export function calculateStayNights(checkInDate: string, checkOutDate: string): number {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error(`Invalid date format. Expected YYYY-MM-DD. Received: ${checkInDate}, ${checkOutDate}`);
  }

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    throw new Error(`Check-out date (${checkOutDate}) must be after check-in date (${checkInDate}).`);
  }

  return diffDays;
}

/**
 * Unified Pricing Formula:
 * Guaranteed 100% identical quotation whether run on:
 * - Next.js guest web booking engine
 * - Desktop Electron front desk check-in
 * - Executive Mobile booking manager
 * - Node.js Cloud Worker background OTA synchronizer
 */
export function calculateReservationQuote(
  params: PricingParameters,
  currency: string = 'USD'
): PricingQuote {
  const {
    checkInDate,
    checkOutDate,
    basePricePerNight,
    adultCount,
    childCount,
    baseOccupancy = 2,
    extraGuestSurchargePerNight = 25,
    taxRatePercent = 12,
    discountPercent = 0,
    depositRequiredPercent = 20,
  } = params;

  const nights = calculateStayNights(checkInDate, checkOutDate);
  const totalGuests = adultCount + childCount;
  const extraGuests = Math.max(0, totalGuests - baseOccupancy);
  const nightlyExtraFee = extraGuests * extraGuestSurchargePerNight;

  const nightlyRates: NightlyRateDetail[] = [];
  const startDate = new Date(checkInDate);

  for (let i = 0; i < nights; i++) {
    const currentNight = new Date(startDate);
    currentNight.setDate(startDate.getDate() + i);
    const dateStr = currentNight.toISOString().split('T')[0];

    nightlyRates.push({
      date: dateStr,
      baseRate: basePricePerNight,
      extraGuestFee: nightlyExtraFee,
      effectiveRate: basePricePerNight + nightlyExtraFee,
    });
  }

  const grossTotal = nightlyRates.reduce((acc, night) => acc + night.effectiveRate, 0);
  const discountAmount = Math.round(grossTotal * (discountPercent / 100) * 100) / 100;
  const taxableSubtotal = Math.max(0, grossTotal - discountAmount);
  const taxAmount = Math.round(taxableSubtotal * (taxRatePercent / 100) * 100) / 100;
  const totalAmount = Math.round((taxableSubtotal + taxAmount) * 100) / 100;
  const depositRequired = Math.round(totalAmount * (depositRequiredPercent / 100) * 100) / 100;

  return {
    nights,
    nightlyRates,
    grossTotal,
    discountAmount,
    taxableSubtotal,
    taxAmount,
    totalAmount,
    depositRequired,
    currency,
  };
}

/**
 * Validates whether guest count conforms to room capacity.
 */
export function validateOccupancy(
  roomType: Pick<RoomType, 'baseOccupancy' | 'maxOccupancy' | 'name'>,
  adults: number,
  children: number
): { valid: boolean; reason?: string } {
  const totalGuests = adults + children;
  if (adults < 1) {
    return { valid: false, reason: 'At least one adult guest is required.' };
  }
  if (totalGuests > roomType.maxOccupancy) {
    return {
      valid: false,
      reason: `Guest count (${totalGuests}) exceeds max capacity (${roomType.maxOccupancy}) for ${roomType.name}.`,
    };
  }
  return { valid: true };
}

/**
 * Calculates standard cancellation refund policy.
 */
export function calculateCancellationFee(
  reservation: Pick<Reservation, 'checkInDate' | 'totalAmount' | 'depositPaid'>,
  cancellationDateIso: string = new Date().toISOString()
): { fee: number; refundAmount: number; policyApplied: string } {
  const checkIn = new Date(reservation.checkInDate).getTime();
  const cancelTime = new Date(cancellationDateIso).getTime();
  const hoursRemaining = (checkIn - cancelTime) / (1000 * 60 * 60);

  if (hoursRemaining >= 48) {
    return {
      fee: 0,
      refundAmount: reservation.depositPaid,
      policyApplied: 'Free Cancellation (48+ hrs prior to check-in)',
    };
  } else if (hoursRemaining >= 24) {
    const fee = Math.round(reservation.depositPaid * 0.5 * 100) / 100;
    return {
      fee,
      refundAmount: Math.max(0, reservation.depositPaid - fee),
      policyApplied: 'Late Cancellation (24-48 hrs: 50% deposit penalty)',
    };
  } else {
    return {
      fee: reservation.depositPaid,
      refundAmount: 0,
      policyApplied: 'No Refund (<24 hrs prior to check-in)',
    };
  }
}

export * from './sync-conflict-resolver';


