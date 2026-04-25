import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService();
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  it('should return hello world message', () => {
    expect(appService.getHello()).toBe('Hello World!');
  });
});
