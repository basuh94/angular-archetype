import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { lastValueFrom, of, throwError } from 'rxjs';
import { Logger } from '../logging/logger.service';
import { isApiError } from '../errors/api-error.model';
import { httpRequestInterceptor } from './http-request.interceptor';

describe('httpRequestInterceptor', () => {
  it('logs successful responses', async () => {
    const logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Logger, useValue: logger }],
    });

    const req = new HttpRequest('GET', '/resource');

    const result = await TestBed.runInInjectionContext(() =>
      lastValueFrom(
        httpRequestInterceptor(req, () => of(new HttpResponse({ status: 200, body: {} }))),
      ),
    );

    expect(result).toBeInstanceOf(HttpResponse);
    expect(logger.info).toHaveBeenCalled();
  });

  it('maps HTTP errors and rethrows API errors', async () => {
    const logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Logger, useValue: logger }],
    });

    const req = new HttpRequest('GET', '/resource');
    const responseError = new HttpErrorResponse({ status: 500, url: '/resource' });

    const promise = TestBed.runInInjectionContext(() =>
      lastValueFrom(httpRequestInterceptor(req, () => throwError(() => responseError))),
    );

    await expect(promise).rejects.toEqual(
      expect.objectContaining({
        code: 'SERVER_ERROR',
        status: 500,
      }),
    );

    await promise.catch((error) => {
      expect(isApiError(error)).toBe(true);
    });

    expect(logger.error).toHaveBeenCalled();
  });
});
