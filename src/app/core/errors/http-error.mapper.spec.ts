import { HttpErrorResponse } from '@angular/common/http';
import { isApiError } from './api-error.model';
import { mapHttpErrorToApiError } from './http-error.mapper';

describe('mapHttpErrorToApiError', () => {
  it('maps network error', () => {
    const result = mapHttpErrorToApiError(new HttpErrorResponse({ status: 0, url: '/x' }));

    expect(result.code).toBe('NETWORK_ERROR');
    expect(result.type).toBe('network');
    expect(isApiError(result)).toBe(true);
  });

  it('maps server error', () => {
    const result = mapHttpErrorToApiError(new HttpErrorResponse({ status: 503, url: '/x' }));

    expect(result.code).toBe('SERVER_ERROR');
    expect(result.type).toBe('server');
  });

  it('maps not found', () => {
    const result = mapHttpErrorToApiError(new HttpErrorResponse({ status: 404, url: '/x' }));

    expect(result.code).toBe('NOT_FOUND');
  });

  it('maps unauthorized', () => {
    const result = mapHttpErrorToApiError(new HttpErrorResponse({ status: 401, url: '/x' }));

    expect(result.code).toBe('UNAUTHORIZED');
  });

  it('maps generic client errors', () => {
    const result = mapHttpErrorToApiError(new HttpErrorResponse({ status: 422, url: '/x' }));

    expect(result.code).toBe('BAD_REQUEST');
  });
});
