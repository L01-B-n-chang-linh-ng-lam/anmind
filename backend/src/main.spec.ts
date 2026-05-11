import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

describe('main bootstrap', () => {
  const originalPort = process.env.PORT;
  const setCreateMock = (listen: jest.Mock) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const createMock = NestFactory.create as jest.MockedFunction<
      typeof NestFactory.create
    >;

    createMock.mockResolvedValue({ listen } as never);
  };

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
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const createMock = NestFactory.create as jest.MockedFunction<
      typeof NestFactory.create
    >;
    const listen = jest.fn().mockResolvedValue(undefined);
    setCreateMock(listen);

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('./main');
    });

    await Promise.resolve();
    await Promise.resolve();

    expect(createMock).toHaveBeenCalledTimes(1);
    const [calledModule] = createMock.mock.calls[0] ?? [];
    expect(calledModule?.name).toBe(AppModule.name);
    expect(listen).toHaveBeenCalledWith(8080);
  });

  it('should listen on port from environment', async () => {
    const listen = jest.fn().mockResolvedValue(undefined);
    setCreateMock(listen);
    process.env.PORT = '4200';

    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('./main');
    });

    await Promise.resolve();
    await Promise.resolve();

    expect(listen).toHaveBeenCalledWith('4200');
  });
});
