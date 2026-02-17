import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { mapHttpErrorToApiError } from '../errors/http-error.mapper';
import { Logger } from '../logging/logger.service';

export const httpRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(Logger);
  const startedAt = Date.now();

  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        const elapsedMs = Date.now() - startedAt;
        logger.info('HTTP request completed', {
          method: req.method,
          url: req.urlWithParams,
          status: event.status,
          elapsedMs,
        });
      }
    }),
    catchError((httpError: HttpErrorResponse) => {
      const elapsedMs = Date.now() - startedAt;
      const apiError = mapHttpErrorToApiError(httpError);

      logger.error(
        'HTTP request failed',
        {
          method: req.method,
          url: req.urlWithParams,
          status: apiError.status,
          code: apiError.code,
          elapsedMs,
        },
        httpError,
      );

      return throwError(() => apiError);
    }),
  );
};
