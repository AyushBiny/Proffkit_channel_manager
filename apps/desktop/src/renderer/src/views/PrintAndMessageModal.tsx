import React, { useState } from 'react';
import type { Reservation } from '@proffkit/db-types';
import { THEME_COLORS, formatCurrency } from '@proffkit/shared-ui';

interface PrintAndMessageModalProps {
  reservation: Reservation;
  isOpen: boolean;
  onClose: () => void;
  onPrintThermal?: (res: Reservation) => void;
  onSendWhatsApp?: (phone: string, text: string) => void;
}

export function PrintAndMessageModal({
  reservation,
  isOpen,
  onClose,
  onPrintThermal,
  onSendWhatsApp,
}: PrintAndMessageModalProps): React.ReactElement | null {
  const [phoneNumber, setPhoneNumber] = useState('+1 555-0199');
  const [isPrinting, setIsPrinting] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    onPrintThermal?.(reservation);
    setTimeout(() => setIsPrinting(false), 800);
  };

  const handleSendMessage = () => {
    const text = `Hello! Your reservation #${reservation.reservationNumber} at Grand Palace is confirmed for ${reservation.checkInDate}. Total due: ${reservation.currency} ${reservation.totalAmount}.`;
    onSendWhatsApp?.(phoneNumber, text);
    setMessageSent(true);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '460px',
          padding: '24px',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Folio Actions: #{reservation.reservationNumber}</h3>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer', color: '#6B7280' }}
          >
            ✕
          </button>
        </div>

        {/* Folio Quick Summary */}
        <div style={{ backgroundColor: '#F9FAFB', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Guest:</span>
            <strong>{reservation.guestId}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Stay:</span>
            <span>{reservation.checkInDate} → {reservation.checkOutDate}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: THEME_COLORS.primary }}>
            <span>Total Amount:</span>
            <span>{formatCurrency(reservation.totalAmount, reservation.currency)}</span>
          </div>
        </div>

        {/* Action 1: Print Thermal Receipt */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: `1px solid ${THEME_COLORS.border}`,
              backgroundColor: '#FFFFFF',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>🖨️</span>
            <span>{isPrinting ? 'Printing to 80mm POS...' : 'Print Thermal Receipt (80mm)'}</span>
          </button>
        </div>

        {/* Action 2: Send WhatsApp Confirmation */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
            Send WhatsApp / SMS Confirmation
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Guest mobile number"
              style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: `1px solid ${THEME_COLORS.border}` }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: messageSent ? THEME_COLORS.success : '#25D366',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {messageSent ? '✓ Sent' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintAndMessageModal;
