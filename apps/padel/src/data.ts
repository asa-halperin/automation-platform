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