import React from 'react';
import { THEME_COLORS } from '@proffkit/shared-ui';

interface TapeChartBooking {
  id: string;
  roomNumber: string;
  guestName: string;
  channel: string;
  channelColor: string;
  startDayIndex: number;
  spanDays: number;
}

const TAPE_DAYS = ['Nov 15', 'Nov 16', 'Nov 17', 'Nov 18', 'Nov 19', 'Nov 20', 'Nov 21'];

const TAPE_ROOMS = [
  { number: '101', type: 'STD-QUN', status: 'AVAILABLE' },
  { number: '102', type: 'STD-QUN', status: 'OCCUPIED' },
  { number: '201', type: 'DLX-KNG', status: 'DIRTY' },
  { number: '204', type: 'DLX-KNG', status: 'OCCUPIED' },
  { number: '305', type: 'OCN-VIEW', status: 'AVAILABLE' },
];

const SAMPLE_BOOKINGS: TapeChartBooking[] = [
  { id: 'b1', roomNumber: '102', guestName: 'Sarah Connor', channel: 'Booking.com', channelColor: '#003580', startDayIndex: 0, spanDays: 3 },
  { id: 'b2', roomNumber: '204', guestName: 'Eleanor Vance', channel: 'Direct Web', channelColor: '#10B981', startDayIndex: 1, spanDays: 4 },
  { id: 'b3', roomNumber: '305', guestName: 'Marcus Sterling', channel: 'Airbnb', channelColor: '#FF385C', startDayIndex: 4, spanDays: 3 },
];

export function ReceptionTapeChartView(): React.ReactElement {
  return (
    <div style={{ backgroundColor: THEME_COLORS.surface, borderRadius: '12px', border: `1px solid ${THEME_COLORS.border}`, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${THEME_COLORS.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 2px 0', fontSize: '16px' }}>Reception Tape Chart (Room Matrix)</h2>
          <span style={{ fontSize: '12px', color: THEME_COLORS.textSecondary }}>7-Day interactive room allocation timeline</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', fontSize: '11px', fontWeight: 600 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#003580' }} /> Booking.com
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF385C' }} /> Airbnb
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} /> Direct
          </span>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '700px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: `1px solid ${THEME_COLORS.border}` }}>
              <th style={{ width: '120px', padding: '10px 14px', textAlign: 'left', borderRight: `1px solid ${THEME_COLORS.border}` }}>
                Room
              </th>
              {TAPE_DAYS.map((day) => (
                <th key={day} style={{ padding: '10px 8px', textAlign: 'center', borderRight: `1px solid ${THEME_COLORS.border}` }}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TAPE_ROOMS.map((room) => {
              const booking = SAMPLE_BOOKINGS.find((b) => b.roomNumber === room.number);
              return (
                <tr key={room.number} style={{ height: '48px', borderBottom: `1px solid ${THEME_COLORS.border}` }}>
                  <td style={{ padding: '0 14px', fontWeight: 600, borderRight: `1px solid ${THEME_COLORS.border}`, backgroundColor: '#FFFFFF' }}>
                    <div>Room {room.number}</div>
                    <span style={{ fontSize: '10px', color: THEME_COLORS.textSecondary }}>{room.type}</span>
                  </td>

                  {/* Day cells */}
                  {TAPE_DAYS.map((_, dayIndex) => {
                    const isBookingStart = booking && booking.startDayIndex === dayIndex;
                    const isInsideBooking =
                      booking &&
                      dayIndex >= booking.startDayIndex &&
                      dayIndex < booking.startDayIndex + booking.spanDays;

                    if (isBookingStart) {
                      return (
                        <td
                          key={dayIndex}
                          colSpan={booking.spanDays}
                          style={{
                            padding: '4px',
                            backgroundColor: '#FFFFFF',
                            borderRight: `1px solid ${THEME_COLORS.border}`,
                          }}
                        >
                          <div
                            style={{
                              backgroundColor: `${booking.channelColor}20`,
                              borderLeft: `4px solid ${booking.channelColor}`,
                              borderRadius: '4px',
                              padding: '6px 8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: booking.channelColor,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {booking.guestName} ({booking.channel})
                          </div>
                        </td>
                      );
                    }

                    if (isInsideBooking) {
                      // Handled by colSpan above
                      return null;
                    }

                    return (
                      <td
                        key={dayIndex}
                        style={{
                          borderRight: `1px solid ${THEME_COLORS.border}`,
                          backgroundColor: '#FFFFFF',
                          textAlign: 'center',
                        }}
                      >
                        <span style={{ color: '#E5E7EB', fontSize: '11px' }}>•</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReceptionTapeChartView;
