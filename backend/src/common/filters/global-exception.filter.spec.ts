import {
  ArgumentsHost,
  BadRequestException,
  ConflictException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter.js';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
const mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
const mockGetRequest = jest
  .fn()
  .mockReturnValue({ url: '/test', method: 'GET' });

const mockHost = {
  switchToHttp: () => ({
    getResponse: mockGetResponse,
    getRequest: mockGetRequest,
  }),
} as unknown as ArgumentsHost;

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
    jest.clearAllMocks();
  });

  it('handles HttpException with string message', () => {
    filter.catch(new HttpException('Not found', 404), mockHost);
    expect(mockStatus).toHaveBeenCalledWith(404);
    const body = mockJson.mock.calls[0][0];
    expect(body.error.message).toBe('Not found');
  });

  it('handles ConflictException with custom code', () => {
    filter.catch(
      new ConflictException({ code: 'USERNAME_EXISTS', message: 'Taken' }),
      mockHost,
    );
    const body = mockJson.mock.calls[0][0];
    expect(body.error.code).toBe('USERNAME_EXISTS');
    expect(body.error.message).toBe('Taken');
  });

  it('handles BadRequestException with array messages', () => {
    filter.catch(
      new BadRequestException({
        message: ['field is required', 'must be string'],
      }),
      mockHost,
    );
    const body = mockJson.mock.calls[0][0];
    expect(body.error.message).toContain('field is required');
  });

  it('handles NotFoundException with code mapping', () => {
    filter.catch(new NotFoundException('Resource missing'), mockHost);
    expect(mockStatus).toHaveBeenCalledWith(404);
    const body = mockJson.mock.calls[0][0];
    expect(body.error.code).toBe('NOT_FOUND');
  });

  it('handles unknown errors as 500', () => {
    jest.spyOn((filter as any).logger, 'error').mockImplementation(() => {});
    filter.catch(new Error('some crash'), mockHost);
    expect(mockStatus).toHaveBeenCalledWith(500);
    const body = mockJson.mock.calls[0][0];
    expect(body.error.code).toBe('INTERNAL_ERROR');
  });

  it('includes request_id and timestamp in error body', () => {
    filter.catch(new HttpException('err', 400), mockHost);
    const body = mockJson.mock.calls[0][0];
    expect(body.error.request_id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(body.error.timestamp).toBeDefined();
  });
});
