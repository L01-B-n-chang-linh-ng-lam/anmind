import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  it('should return backend metadata', () => {
    expect(appService.getMetadata()).toEqual({
      service: 'backend',
      status: 'ok',
    });
  });
});
