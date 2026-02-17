import { inject, InjectionToken, Injectable, isDevMode } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export const LOGGER_MIN_LEVEL = new InjectionToken<LogLevel>('LOGGER_MIN_LEVEL', {
  providedIn: 'root',
  factory: () => (isDevMode() ? 'debug' : 'info'),
});

@Injectable({ providedIn: 'root' })
export class Logger {
  private readonly minimumLevel = inject(LOGGER_MIN_LEVEL);

  debug(message: string, context?: unknown): void {
    if (!this.shouldLog('debug')) {
      return;
    }

    console.debug(this.buildEntry('debug', message, context));
  }

  info(message: string, context?: unknown): void {
    if (!this.shouldLog('info')) {
      return;
    }

    console.info(this.buildEntry('info', message, context));
  }

  warn(message: string, context?: unknown): void {
    if (!this.shouldLog('warn')) {
      return;
    }

    console.warn(this.buildEntry('warn', message, context));
  }

  error(message: string, context?: unknown, error?: unknown): void {
    if (!this.shouldLog('error')) {
      return;
    }

    if (error === undefined) {
      console.error(this.buildEntry('error', message, context));
      return;
    }

    console.error(this.buildEntry('error', message, context), error);
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[this.minimumLevel];
  }

  private buildEntry(
    level: LogLevel,
    message: string,
    context?: unknown,
  ): {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: unknown;
  } {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };
  }
}
