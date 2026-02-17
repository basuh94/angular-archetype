import { TestBed } from '@angular/core/testing';
import { LOGGER_MIN_LEVEL, Logger } from './logger.service';

describe('Logger', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('does not emit debug when min level is info', () => {
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [{ provide: LOGGER_MIN_LEVEL, useValue: 'info' }],
    });

    const logger = TestBed.inject(Logger);
    logger.debug('hidden');

    expect(debugSpy).not.toHaveBeenCalled();
  });

  it('emits warn and error entries', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    TestBed.configureTestingModule({
      providers: [{ provide: LOGGER_MIN_LEVEL, useValue: 'debug' }],
    });

    const logger = TestBed.inject(Logger);

    logger.warn('warn message', { feature: 'posts' });
    logger.error('error message', { feature: 'posts' }, new Error('boom'));

    expect(warnSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
  });
});
