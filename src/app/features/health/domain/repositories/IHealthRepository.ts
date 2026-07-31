import { HealthStatus } from '../entities/HealthStatus';

export interface IHealthRepository {
  checkHealth(): Promise<HealthStatus>;
}
