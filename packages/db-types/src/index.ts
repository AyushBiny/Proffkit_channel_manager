/**
 * Proffkit Shared Database Types & Domain Models
 */

export type EntityId = string;

export interface Tenant {
  id: EntityId;
  name: string;
  slug: string;
  customDomain?: string;
  plan: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  createdAt: string;
  updatedAt: string;
}

export interface Hotel {
  id: EntityId;
  tenantId: EntityId;
  name: string;
  code: string; // e.g., 'GRND-NYC'
  timeZone: string;
  currency: string; // e.g., 'USD', 'INR', 'EUR'
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  contactEmail: string;
  contactPhone: string;
  checkInTime: string; // e.g., '14:00'
  checkOutTime: string; // e.g., '11:00'
  createdAt: string;
  updatedAt: string;
}

export interface RoomType {
  id: EntityId;
  hotelId: EntityId;
  code: string; // e.g., 'DLX-KNG'
  name: string; // e.g., 'Deluxe King Suite'
  description?: string;
  baseOccupancy: number;
  maxOccupancy: number;
  basePricePerNight: number;
  amenities: string[];
  totalRooms: number;
}

export type RoomStatus =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'DIRTY'
  | 'CLEANING_IN_PROGRESS'
  | 'INSPECTION_PENDING'
  | 'MAINTENANCE'
  | 'OUT_OF_SERVICE';

export interface Room {
  id: EntityId;
  hotelId: EntityId;
  roomTypeId: EntityId;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  keyCardUid?: string;
  notes?: string;
  updatedAt: string;
}

export interface Guest {
  id: EntityId;
  tenantId: EntityId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idType?: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID';
  idNumber?: string;
  nationality?: string;
  vipStatus: boolean;
  notes?: string;
  createdAt: string;
}

export type ReservationStatus =
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELLED'
  | 'NO_SHOW';

export type BookingChannel =
  | 'DIRECT_WEB'
  | 'FRONT_DESK'
  | 'MOBILE_APP'
  | 'OTA_BOOKING_COM'
  | 'OTA_EXPEDIA'
  | 'OTA_AIRBNB';

export interface Reservation {
  id: EntityId;
  hotelId: EntityId;
  reservationNumber: string;
  guestId: EntityId;
  roomTypeId: EntityId;
  roomId?: EntityId;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  adultCount: number;
  childCount: number;
  status: ReservationStatus;
  channel: BookingChannel;
  channelReferenceId?: string;
  nightlyRate: number;
  totalNights: number;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  depositPaid: number;
  currency: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolioItem {
  id: EntityId;
  folioId: EntityId;
  description: string;
  category: 'ROOM_CHARGE' | 'FOOD_BEVERAGE' | 'LAUNDRY' | 'SPA' | 'TAX' | 'PAYMENT' | 'REFUND';
  amount: number;
  postedAt: string;
  postedBy: string;
}

export interface Folio {
  id: EntityId;
  reservationId: EntityId;
  hotelId: EntityId;
  status: 'OPEN' | 'SETTLED' | 'VOID';
  totalCharges: number;
  totalPayments: number;
  balance: number;
  currency: string;
  items: FolioItem[];
}

export type SyncOperation = 'CREATE' | 'UPDATE' | 'DELETE';
export type SyncOrigin = 'RECEPTION_PC' | 'CLOUD_ENGINE' | 'MOBILE_APP' | 'GUEST_WEB';

export interface SyncTransaction {
  id: EntityId;
  hotelId: EntityId;
  entityType: 'RESERVATION' | 'ROOM_STATUS' | 'GUEST' | 'FOLIO';
  entityId: EntityId;
  operation: SyncOperation;
  payload: Record<string, unknown>;
  origin: SyncOrigin;
  version: number;
  clientTimestamp: number;
  serverTimestamp?: number;
  synced: boolean;
}

