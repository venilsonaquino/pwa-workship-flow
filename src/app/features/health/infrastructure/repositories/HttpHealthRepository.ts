import type { IHealthRepository } from '../../domain/repositories/IHealthRepository';
import { HealthStatus } from '../../domain/entities/HealthStatus';

const DEFAULT_API_URL = import.meta.env.VITE_API_BASE_URL || '';

export class HttpHealthRepository implements IHealthRepository {
  private readonly baseUrl: string;

  constructor(baseUrl: string = DEFAULT_API_URL) {
    this.baseUrl = baseUrl;
  }

  public async checkHealth(): Promise<HealthStatus> {
    const liveEndpointUrl = `${this.baseUrl}/live`;
    try {
      const response = await fetch(liveEndpointUrl, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        return new HealthStatus(false);
      }

      return new HealthStatus(true);
    } catch {
      return new HealthStatus(false);
    }
  }
}
