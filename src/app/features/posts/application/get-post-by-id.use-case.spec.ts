import { TestBed } from '@angular/core/testing';
import { GetPostByIdUseCase } from './get-post-by-id.use-case';
import { POST_REPOSITORY } from './post-repository.token';

describe('GetPostByIdUseCase', () => {
  it('delegates to repository', async () => {
    const repository = {
      getById: jest.fn().mockResolvedValue({
        id: 1,
        userId: 1,
        title: 'hello',
        body: 'world',
      }),
    };

    TestBed.configureTestingModule({
      providers: [GetPostByIdUseCase, { provide: POST_REPOSITORY, useValue: repository }],
    });

    const useCase = TestBed.inject(GetPostByIdUseCase);
    const result = await useCase.execute(1);

    expect(repository.getById).toHaveBeenCalledWith(1);
    expect(result.title).toBe('hello');
  });
});
