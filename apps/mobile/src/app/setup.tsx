import React, { useState } from 'react';
import { THEME_COLORS } from '@proffkit/shared-ui';

export default function SetupWizardScreen(): React.ReactElement {
  const [step, setStep] = useState<number>(1);
  const [hotelName, setHotelName] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['booking', 'airbnb']);

  const toggleChannel = (ch: string) => {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  return (
    <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 20px' }}>
      <div
        style={{
          backgroundColor: THEME_COLORS.surface,
          borderRadius: '16px',
          padding: '32px',
          border: `1px solid ${THEME_COLORS.border}`,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: THEME_COLORS.primary }}>
            Step {step} of 3: {step === 1 ? 'Property Details' : step === 2 ? 'Channels & OTAs' : 'Confirm & Launch'}
          </span>
          <span style={{ fontSize: '13px', color: THEME_COLORS.textSecondary }}>Setup Wizard</span>
        </div>

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '22px', margin: '0 0 8px 0' }}>Welcome to Proffkit</h2>
            <p style={{ color: THEME_COLORS.textSecondary, fontSize: '14px', marginBottom: '24px' }}>
              Let's configure your property and connect your multi-channel inventory.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Hotel / Property Name
              </label>
              <input
                type="text"
                placeholder="e.g. Grand Palace Resort"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${THEME_COLORS.border}`,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                Operating Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${THEME_COLORS.border}`,
                }}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="INR">INR (₹)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <button
              onClick={() => setStep(2)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: THEME_COLORS.primary,
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continue to Channels →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '22px', margin: '0 0 8px 0' }}>Select OTA Channels</h2>
            <p style={{ color: THEME_COLORS.textSecondary, fontSize: '14px', marginBottom: '20px' }}>
              Choose which channels to sync availability and rates with automatically.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {[
                { id: 'booking', name: 'Booking.com', color: '#003580' },
                { id: 'airbnb', name: 'Airbnb', color: '#FF385C' },
                { id: 'expedia', name: 'Expedia', color: '#00355F' },
                { id: 'mmt', name: 'MakeMyTrip', color: '#E23744' },
                { id: 'agoda', name: 'Agoda', color: '#5E2E91' },
              ].map((channel) => {
                const active = selectedChannels.includes(channel.id);
                return (
                  <div
                    key={channel.id}
                    onClick={() => toggleChannel(channel.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${active ? channel.color : THEME_COLORS.border}`,
                      backgroundColor: active ? `${channel.color}10` : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: channel.color }} />
                      <strong style={{ fontSize: '14px' }}>{channel.name}</strong>
                    </div>
                    <span>{active ? '✓ Connected' : '+ Add'}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: '#E5E7EB',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: THEME_COLORS.primary,
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Review Setup →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '22px', margin: '0 0 8px 0' }}>Setup Summary</h2>
            <p style={{ color: THEME_COLORS.textSecondary, fontSize: '14px', marginBottom: '20px' }}>
              Review your initial hotel configuration before entering the Executive Dashboard.
            </p>

            <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <div><strong>Property:</strong> {hotelName || 'My Boutique Hotel'}</div>
              <div style={{ marginTop: '8px' }}><strong>Base Currency:</strong> {currency}</div>
              <div style={{ marginTop: '8px' }}><strong>Connected Channels:</strong> {selectedChannels.join(', ')}</div>
            </div>

            <a
              href="/(exec)/dashboard"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '14px',
                borderRadius: '8px',
                backgroundColor: THEME_COLORS.success,
                color: '#FFFFFF',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Launch Executive Dashboard 🚀
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

