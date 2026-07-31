import type { IHealthRepository } from '../../domain/repositories/IHealthRepository';
import { HealthStatus } from '../../domain/entities/HealthStatus';

export class CheckHealthUseCase {
  private readonly healthRepository: IHealthRepository;

  constructor(healthRepository: IHealthRepository) {
    this.healthRepository = healthRepository;
  }

  public async execute(): Promise<HealthStatus> {
    return this.healthRepository.checkHealth();
  }
}
