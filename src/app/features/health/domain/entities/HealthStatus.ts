export class HealthStatus {
  private readonly healthy: boolean;
  private readonly checkedAt: Date;

  constructor(healthy: boolean, checkedAt: Date = new Date()) {
    this.healthy = healthy;
    this.checkedAt = checkedAt;
  }

  public isHealthy(): boolean {
    return this.healthy;
  }

  public getCheckedAt(): Date {
    return this.checkedAt;
  }
}
