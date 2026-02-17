import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Logger } from '../logging/logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(Logger);

  handleError(error: unknown): void {
    this.logger.error(
      'Unhandled application error',
      {
        source: 'GlobalErrorHandler',
      },
      error,
    );
  }
}
