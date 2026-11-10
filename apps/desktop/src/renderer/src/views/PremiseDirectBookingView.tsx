import React, { useState } from 'react';
import type { Room, RoomType, Reservation } from '@proffkit/db-types';
import { calculateReservationQuote } from '@proffkit/business-logic';
import {
  PriceSummaryCard,
  THEME_COLORS,
  formatCurrency,
} from '@proffkit/shared-ui';

interface PremiseDirectBookingViewProps {
  onCompleteBooking?: (reservation: Partial<Reservation>) => void;
  onCancel?: () => void;
}

export function PremiseDirectBookingView({
  onCompleteBooking,
  onCancel,
}: PremiseDirectBookingViewProps): React.ReactElement {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [checkIn, setCheckIn] = useState('2026-11-15');
  const [checkOut, setCheckOut] = useState('2026-11-18');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('204');
  const [nightlyRate, setNightlyRate] = useState(160);
  const [discountPercent, setDiscountPercent] = useState(0);

  const quote = calculateReservationQuote({
    checkInDate: checkIn,
    checkOutDate: checkOut,
    basePricePerNight: nightlyRate,
    adultCount: 2,
    childCount: 0,
    discountPercent,
  });

  const handleConfirm = () => {
    onCompleteBooking?.({
      guestId: `${firstName} ${lastName}`.trim() || 'Walk-in Guest',
      checkInDate: checkIn,
      checkOutDate: checkOut,
      nightlyRate,
      totalNights: quote.nights,
      subtotalAmount: quote.taxableSubtotal,
      taxAmount: quote.taxAmount,
      totalAmount: quote.totalAmount,
      depositPaid: quote.depositRequired,
      channel: 'FRONT_DESK',
      status: 'CONFIRMED',
    });
  };

  return (
    <div style={{ backgroundColor: THEME_COLORS.surface, borderRadius: '12px', padding: '24px', border: `1px solid ${THEME_COLORS.border}` }}>
      <div style={{ marginBottom: '20px', borderBottom: `1px solid ${THEME_COLORS.border}`, paddingBottom: '12px' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>Front Desk Walk-In Booking</h2>
        <span style={{ fontSize: '12px', color: THEME_COLORS.textSecondary }}>
          Create instant direct reservation and assign room
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Form fields */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>First Name</label>
              <input
                type="text"
                placeholder="Guest first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${THEME_COLORS.border}`, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Last Name</label>
              <input
                type="text"
                placeholder="Guest last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${THEME_COLORS.border}`, boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Phone Number</label>
              <input
                type="text"
                placeholder="+1 555-0199"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${THEME_COLORS.border}`, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Email Address</label>
              <input
                type="email"
                placeholder="guest@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${THEME_COLORS.border}`, boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Check-In</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${THEME_COLORS.border}`, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Check-Out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${THEME_COLORS.border}`, boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Assign Room</label>
              <select
                value={selectedRoomNumber}
                onChange={(e) => setSelectedRoomNumber(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: `1px solid ${THEME_COLORS.border}`, boxSizing: 'border-box' }}
              >
                <option value="101">Room 101 (Standard)</option>
                <option value="204">Room 204 (Deluxe)</option>
                <option value="305">Room 305 (Ocean View)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            {onCancel && (
              <button
                onClick={onCancel}
                style={{ padding: '10px 18px', borderRadius: '6px', border: `1px solid ${THEME_COLORS.border}`, backgroundColor: '#FFFFFF', cursor: 'pointer' }}
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleConfirm}
              style={{ padding: '10px 24px', borderRadius: '6px', border: 'none', backgroundColor: THEME_COLORS.primary, color: '#FFFFFF', fontWeight: 600, cursor: 'pointer' }}
            >
              Complete Check-In ({formatCurrency(quote.totalAmount)})
            </button>
          </div>
        </div>

        {/* Live quote preview */}
        <div>
          <PriceSummaryCard quote={quote} />
        </div>
      </div>
    </div>
  );
}

export default PremiseDirectBookingView;
