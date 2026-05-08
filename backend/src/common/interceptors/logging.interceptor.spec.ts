import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor.js';

const mockResponse = { statusCode: 200 };
const mockRequest = { method: 'GET', url: '/test' };

const mockContext = {
  switchToHttp: () => ({
    getRequest: () => mockRequest,
    getResponse: () => mockResponse,
  }),
} as unknown as ExecutionContext;

const mockNext: CallHandler = {
  handle: () => of({ data: 'ok' }),
};

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
  });

  it('passes through the response value', (done) => {
    interceptor.intercept(mockContext, mockNext).subscribe({
      next: (val) => {
        expect(val).toEqual({ data: 'ok' });
        done();
      },
    });
  });

  it('logs after handler completes', (done) => {
    const logSpy = jest
      .spyOn((interceptor as any).logger, 'log')
      .mockImplementation(() => {});
    interceptor.intercept(mockContext, mockNext).subscribe({
      complete: () => {
        expect(logSpy).toHaveBeenCalledWith(
          expect.stringContaining('GET /test 200'),
        );
        done();
      },
    });
  });
});
