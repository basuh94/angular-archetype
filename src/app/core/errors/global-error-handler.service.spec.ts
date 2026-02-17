import { TestBed } from '@angular/core/testing';
import { Logger } from '../logging/logger.service';
import { GlobalErrorHandler } from './global-error-handler.service';

describe('GlobalErrorHandler', () => {
  it('logs unhandled errors', () => {
    const logger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [GlobalErrorHandler, { provide: Logger, useValue: logger }],
    });

    const handler = TestBed.inject(GlobalErrorHandler);
    const error = new Error('unexpected');

    handler.handleError(error);

    expect(logger.error).toHaveBeenCalledWith(
      'Unhandled application error',
      expect.objectContaining({ source: 'GlobalErrorHandler' }),
      error,
    );
  });
});
