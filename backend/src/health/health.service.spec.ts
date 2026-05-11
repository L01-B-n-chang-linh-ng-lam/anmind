import { HealthService } from './health.service';

describe('HealthService', () => {
  it('reports database up when probe succeeds', async () => {
    const healthService = new HealthService({
      ping: jest.fn().mockResolvedValue(true),
    } as never);

    await expect(healthService.getHealth()).resolves.toEqual({
      status: 'ok',
      service: 'backend',
      database: 'up',
    });
  });

  it('reports database down when probe fails', async () => {
    const healthService = new HealthService({
      ping: jest.fn().mockResolvedValue(false),
    } as never);

    await expect(healthService.getHealth()).resolves.toEqual({
      status: 'error',
      service: 'backend',
      database: 'down',
    });
  });
});
