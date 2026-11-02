import type { APIRequestContext, APIResponse } from '@playwright/test';

export class GiteaApi {
  private request: APIRequestContext;
  private authHeader: string;

  constructor(request: APIRequestContext, user: string, password: string) {
    this.request = request;
    this.authHeader = 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64');
  }

  private headers() {
    return { Authorization: this.authHeader };
  }

  async createRepo(name: string): Promise<APIResponse> {
    return this.request.post('/api/v1/user/repos', {
      headers: this.headers(),
      data: { name, auto_init: true },
    });
  }

  async getRepo(owner: string, name: string): Promise<APIResponse> {
    return this.request.get(`/api/v1/repos/${owner}/${name}`, { headers: this.headers() });
  }

  async listMyRepos(): Promise<APIResponse> {
    return this.request.get('/api/v1/user/repos', { headers: this.headers() });
  }

  async deleteRepo(owner: string, name: string): Promise<APIResponse> {
    return this.request.delete(`/api/v1/repos/${owner}/${name}`, { headers: this.headers() });
  }
    async getVersion(): Promise<APIResponse> {
    return this.request.get('/api/v1/version');
  }
}