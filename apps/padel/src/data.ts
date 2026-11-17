export interface Court {
  id: string;
  name: string;
  type: 'indoor' | 'outdoor';
  pricePerHour: number;
}

export const courts: Court[] = [
  { id: 'court-1', name: 'Center Court', type: 'indoor', pricePerHour: 160 },
  { id: 'court-2', name: 'Court 2', type: 'indoor', pricePerHour: 140 },
  { id: 'court-3', name: 'Garden Court', type: 'outside', pricePerHour: 100 },
];

export const OPENING_HOUR = 8;
export const CLOSING_HOUR = 22;

export interface Booking {
  id: string;
  courtId: string;
  date: string;
  hour: number;
  durationMinutes: number;
  players: number;
  price: number;
}

export interface Slot {
  courtId: string;
  date: string;
  hour: number;
  available: boolean;
}

export const bookings: Booking[] = [];

export const DURATIONS = [60, 90, 120];

export function hoursTaken(durationMinutes: number): number {
  return Math.ceil(durationMinutes / 60);
}

export function priceFor(court: Court, durationMinutes: number): number {
  return (court.pricePerHour * durationMinutes) / 60;
}

export function isFree(courtId: string, date: string, hour: number): boolean {
  return !bookings.some(
    (b) =>
      b.courtId === courtId &&
      b.date === date &&
      hour >= b.hour &&
      hour < b.hour + hoursTaken(b.durationMinutes),
  );
}

export function slotsFor(date: string): Slot[] {
  const slots: Slot[] = [];
  for (const court of courts) {
    for (let hour = OPENING_HOUR; hour < CLOSING_HOUR; hour++) {
      slots.push({ courtId: court.id, date, hour, available: isFree(court.id, date, hour) });
    }
  }
  return slots;
}