import type { APIRequestContext, APIResponse } from '@playwright/test';

export interface BookingRequest {
  courtId: string;
  date: string;
  hour: number;
  durationMinutes: number;
  players: number;
}

export interface Booking extends BookingRequest {
  id: string;
  price: number;
}

export class PadelApi {
  private token = '';
  private readonly created: string[] = [];

  constructor(private readonly request: APIRequestContext) {}

  private get headers() {
    return { Authorization: `Bearer ${this.token}` };
  }

  async login(username: string, password: string): Promise<void> {
    const response = await this.request.post('/api/login', { data: { username, password } });
    if (!response.ok()) throw new Error(`Login failed with status ${response.status()}`);
    this.token = (await response.json()).token;
  }

  async book(booking: BookingRequest): Promise<APIResponse> {
    const response = await this.request.post('/api/bookings', { data: booking, headers: this.headers });
    if (response.status() === 201) this.created.push((await response.json()).id);
    return response;
  }

  async cleanup(): Promise<void> {
    for (const id of this.created) {
      await this.cancelWithRetry(id);
    }
  }

  private async cancelWithRetry(id: string): Promise<void> {
    for (let attempt = 1; attempt <= 3; attempt++) {
      const response = await this.request.delete(`/api/bookings/${id}`, { headers: this.headers });
      if (response.status() === 204 || response.status() === 404) return;
      if (response.status() !== 503) break;
    }
    throw new Error(`Cleanup failed: booking ${id} is still in the system`);
  }
}