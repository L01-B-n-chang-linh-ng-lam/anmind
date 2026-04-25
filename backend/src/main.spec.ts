import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

describe('main bootstrap', () => {
  const originalPort = process.env.PORT;

  beforeEach(() => {
    jest.clearAllMocks();
    delete require.cache[require.resolve('./main')];
    delete process.env.PORT;
  });

  afterAll(() => {
    if (originalPort === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = originalPort;
    }
  });

  it('should bootstrap app and listen on default port', async () => {
    const listen = jest.fn().mockResolvedValue(undefined);
    (NestFactory.create as jest.Mock).mockResolvedValue({ listen });

    jest.isolateModules(() => {
      require('./main');
    });

    await Promise.resolve();
    await Promise.resolve();

    expect(NestFactory.create).toHaveBeenCalledTimes(1);
    expect((NestFactory.create as jest.Mock).mock.calls[0][0]?.name).toBe(
      AppModule.name,
    );
    expect(listen).toHaveBeenCalledWith(3000);
  });

  it('should listen on port from environment', async () => {
    const listen = jest.fn().mockResolvedValue(undefined);
    (NestFactory.create as jest.Mock).mockResolvedValue({ listen });
    process.env.PORT = '4200';

    jest.isolateModules(() => {
      require('./main');
    });

    await Promise.resolve();
    await Promise.resolve();

    expect(listen).toHaveBeenCalledWith('4200');
  });
});
