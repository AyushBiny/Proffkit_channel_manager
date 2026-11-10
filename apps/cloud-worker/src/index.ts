/**
 * @proffkit/cloud-worker
 * 24/7 Node.js Background Sync Engine.
 *
 * Direct consumer of:
 * - @proffkit/db-types (SyncTransaction, Reservation, Room, Folio)
 * - @proffkit/business-logic (calculateReservationQuote, validateOccupancy)
 */

import type {
  SyncTransaction,
  Reservation,
  RoomStatus,
} from '@proffkit/db-types';
import {
  calculateReservationQuote,
  validateOccupancy,
} from '@proffkit/business-logic';

export class CloudSyncEngine {
  private isRunning: boolean = false;
  private syncQueue: SyncTransaction[] = [];

  constructor(private readonly workerId: string = 'cloud-sync-worker-1') {}

  public start(): void {
    this.isRunning = true;
    console.log(`[${this.workerId}] 24/7 Cloud Sync Engine started.`);
  }

  public stop(): void {
    this.isRunning = false;
    console.log(`[${this.workerId}] 24/7 Cloud Sync Engine stopped.`);
  }

  /**
   * Processes incoming sync batch from Reception PC or external OTA channels.
   */
  public async processSyncBatch(transactions: SyncTransaction[]): Promise<{
    processed: number;
    failed: number;
  }> {
    let processed = 0;
    let failed = 0;

    for (const tx of transactions) {
      try {
        console.log(`[Sync] Processing ${tx.operation} on ${tx.entityType} (${tx.entityId}) from ${tx.origin}`);

        if (tx.entityType === 'RESERVATION') {
          const reservation = tx.payload as unknown as Reservation;

          // Re-verify pricing formula integrity with @proffkit/business-logic
          const quote = calculateReservationQuote({
            checkInDate: reservation.checkInDate,
            checkOutDate: reservation.checkOutDate,
            basePricePerNight: reservation.nightlyRate,
            adultCount: reservation.adultCount,
            childCount: reservation.childCount,
          });

          if (Math.abs(quote.totalAmount - reservation.totalAmount) > 0.05) {
            console.warn(
              `[Discrepancy] Reservation ${reservation.reservationNumber} total mismatch: recorded ${reservation.totalAmount}, calculated ${quote.totalAmount}`
            );
          }
        }

        processed++;
      } catch (err) {
        console.error(`[Sync Failure] Transaction ${tx.id} failed:`, err);
        failed++;
      }
    }

    return { processed, failed };
  }
}

// Instantiate engine instance
const engine = new CloudSyncEngine();
engine.start();

