import { TestBed } from '@angular/core/testing';
import { ApiError } from '../../../core/errors/api-error.model';
import { Logger } from '../../../core/logging/logger.service';
import { GetPostByIdUseCase } from '../application/get-post-by-id.use-case';
import { PostDetailFacade } from './post-detail.facade';

describe('PostDetailFacade', () => {
  const loggerMock = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  it('loads post successfully', async () => {
    const useCase = {
      execute: jest.fn().mockResolvedValue({
        id: 1,
        userId: 7,
        title: 'A title',
        body: 'A body',
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        PostDetailFacade,
        { provide: GetPostByIdUseCase, useValue: useCase },
        { provide: Logger, useValue: loggerMock },
      ],
    });

    const facade = TestBed.inject(PostDetailFacade);

    await facade.load(1);

    expect(facade.loading()).toBe(false);
    expect(facade.error()).toBeNull();
    expect(facade.post()?.id).toBe(1);
  });

  it('sets error when loading fails', async () => {
    const useCase = {
      execute: jest.fn().mockRejectedValue(new Error('boom')),
    };

    TestBed.configureTestingModule({
      providers: [
        PostDetailFacade,
        { provide: GetPostByIdUseCase, useValue: useCase },
        { provide: Logger, useValue: loggerMock },
      ],
    });

    const facade = TestBed.inject(PostDetailFacade);

    await facade.load(1);

    expect(facade.loading()).toBe(false);
    expect(facade.post()).toBeNull();
    expect(facade.error()).toBe('No se pudo cargar el post.');
  });

  it('uses normalized api error message when available', async () => {
    const apiError: ApiError = {
      type: 'server',
      status: 500,
      code: 'SERVER_ERROR',
      message: 'Error interno del servidor. Inténtalo más tarde.',
      url: '/posts/1',
    };
    const useCase = {
      execute: jest.fn().mockRejectedValue(apiError),
    };

    TestBed.configureTestingModule({
      providers: [
        PostDetailFacade,
        { provide: GetPostByIdUseCase, useValue: useCase },
        { provide: Logger, useValue: loggerMock },
      ],
    });

    const facade = TestBed.inject(PostDetailFacade);
    await facade.load(1);

    expect(facade.error()).toBe('Error interno del servidor. Inténtalo más tarde.');
  });
});
