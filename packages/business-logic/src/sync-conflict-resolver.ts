/**
 * @proffkit/business-logic - Offline Sync & Conflict Resolution Engine
 *
 * Deterministic business rules for resolving state collisions between:
 * - Offline Reception PC Desktop actions
 * - 24/7 Cloud Worker OTA events (Booking.com, Expedia, Airbnb)
 * - Executive Mobile Manager updates
 */

import type {
  SyncTransaction,
  Reservation,
  ReservationStatus,
  RoomStatus,
} from '@proffkit/db-types';

export interface ConflictResolutionResult<T = Record<string, unknown>> {
  resolved: boolean;
  winner: 'CLIENT' | 'SERVER' | 'MERGED';
  finalPayload: T;
  reason: string;
}

// State precedence hierarchy for Room Cleaning & Status lifecycle
const ROOM_STATUS_RANK: Record<RoomStatus, number> = {
  OUT_OF_SERVICE: 100,
  MAINTENANCE: 90,
  OCCUPIED: 80,
  DIRTY: 30,
  CLEANING_IN_PROGRESS: 40,
  INSPECTION_PENDING: 50,
  AVAILABLE: 60,
};

// Permissible reservation lifecycle transitions
const ALLOWED_RESERVATION_TRANSITIONS: Record<ReservationStatus, ReservationStatus[]> = {
  CONFIRMED: ['CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
  CHECKED_IN: ['CHECKED_OUT'],
  CHECKED_OUT: [], // Terminal state
  CANCELLED: [],   // Terminal state
  NO_SHOW: ['CONFIRMED'], // Can be reinstated by manager
};

/**
 * Resolves conflicting room status updates between offline front desk and mobile housekeeping.
 */
export function resolveRoomStatusConflict(
  clientTx: SyncTransaction,
  serverCurrentStatus: RoomStatus,
  clientProposedStatus: RoomStatus
): ConflictResolutionResult<{ status: RoomStatus }> {
  // Rule 1: Safety/Maintenance always overrides housekeeping or availability
  if (clientProposedStatus === 'MAINTENANCE' || clientProposedStatus === 'OUT_OF_SERVICE') {
    return {
      resolved: true,
      winner: 'CLIENT',
      finalPayload: { status: clientProposedStatus },
      reason: 'Physical maintenance and safety locks always take precedence.',
    };
  }

  // Rule 2: If guest is already physically checked in at desk, do not revert to dirty or available
  if (serverCurrentStatus === 'OCCUPIED' && clientProposedStatus !== 'OCCUPIED') {
    return {
      resolved: true,
      winner: 'SERVER',
      finalPayload: { status: 'OCCUPIED' },
      reason: 'Room is occupied by active guest check-in; cannot change status until checkout.',
    };
  }

  // Rule 3: Housekeeping progression rank
  const clientRank = ROOM_STATUS_RANK[clientProposedStatus] ?? 0;
  const serverRank = ROOM_STATUS_RANK[serverCurrentStatus] ?? 0;

  if (clientRank >= serverRank) {
    return {
      resolved: true,
      winner: 'CLIENT',
      finalPayload: { status: clientProposedStatus },
      reason: `Client status (${clientProposedStatus}) advances room workflow beyond server status (${serverCurrentStatus}).`,
    };
  }

  return {
    resolved: true,
    winner: 'SERVER',
    finalPayload: { status: serverCurrentStatus },
    reason: `Server status (${serverCurrentStatus}) is already ahead of incoming offline status (${clientProposedStatus}).`,
  };
}

/**
 * Resolves reservation status conflicts between local Reception desk and incoming OTA events.
 */
export function resolveReservationConflict(
  localReservation: Reservation,
  incomingReservation: Reservation,
  origin: 'RECEPTION_DESK' | 'OTA_CLOUD'
): ConflictResolutionResult<Reservation> {
  // Critical hospitality rule: If guest is already physically in front of reception and checked in,
  // an incoming OTA cancellation must NOT eject the guest.
  if (localReservation.status === 'CHECKED_IN' && incomingReservation.status === 'CANCELLED') {
    return {
      resolved: true,
      winner: 'CLIENT',
      finalPayload: {
        ...localReservation,
        specialRequests: `${localReservation.specialRequests || ''} [CONFLICT NOTE: OTA sent cancellation while guest was checked in]`.trim(),
      },
      reason: 'Physical check-in at reception takes absolute precedence over remote OTA cancellation.',
    };
  }

  // Verify state transition validity
  const validTransitions = ALLOWED_RESERVATION_TRANSITIONS[localReservation.status] || [];
  if (validTransitions.includes(incomingReservation.status)) {
    return {
      resolved: true,
      winner: origin === 'RECEPTION_DESK' ? 'CLIENT' : 'SERVER',
      finalPayload: incomingReservation,
      reason: `Valid reservation lifecycle transition from ${localReservation.status} to ${incomingReservation.status}.`,
    };
  }

  // Last-Write-Wins fallback based on highest version / latest timestamp
  const localTime = new Date(localReservation.updatedAt).getTime();
  const incomingTime = new Date(incomingReservation.updatedAt).getTime();

  if (incomingTime >= localTime) {
    return {
      resolved: true,
      winner: 'SERVER',
      finalPayload: incomingReservation,
      reason: 'Incoming update has newer timestamp.',
    };
  }

  return {
    resolved: true,
    winner: 'CLIENT',
    finalPayload: localReservation,
    reason: 'Local modification is newer than incoming update.',
  };
}

