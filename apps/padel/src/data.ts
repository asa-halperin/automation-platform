export interface Court {
  id: string;
  name: string;
  type: 'indoor' | 'outdoor';
  pricePerHour: number;
}

export const courts: Court[] = [
  { id: 'court-1', name: 'Center Court', type: 'indoor', pricePerHour: 160 },
  { id: 'court-2', name: 'Court 2', type: 'indoor', pricePerHour: 140 },
  { id: 'court-3', name: 'Garden Court', type: 'outdoor', pricePerHour: 100 },
];

export const OPENING_HOUR = 8;
export const CLOSING_HOUR = 22;

export interface Booking {
  id: string;
  courtId: string;
  date: string;
  hour: number;
}

export interface Slot {
  courtId: string;
  date: string;
  hour: number;
  available: boolean;
}

export const bookings: Booking[] = [];

export function slotsFor(date: string): Slot[] {
  const slots: Slot[] = [];
  for (const court of courts) {
    for (let hour = OPENING_HOUR; hour < CLOSING_HOUR; hour++) {
      const taken = bookings.some(
        (b) => b.courtId === court.id && b.date === date && b.hour === hour,
      );
      slots.push({ courtId: court.id, date, hour, available: !taken });
    }
  }
  return slots;
}