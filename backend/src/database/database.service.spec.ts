import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  afterEach(() => {
    if (originalDatabaseUrl === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = originalDatabaseUrl;
    }
  });

  it('returns false when database url is not configured', async () => {
    delete process.env.DATABASE_URL;
    const service = new DatabaseService();

    await expect(service.ping()).resolves.toBe(false);
  });
});
