import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpPostRepository } from './http-post.repository';

describe('HttpPostRepository', () => {
  let repository: HttpPostRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpPostRepository, provideHttpClient(), provideHttpClientTesting()],
    });

    repository = TestBed.inject(HttpPostRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests post by id and maps dto', async () => {
    const promise = repository.getById(1);

    const request = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts/1');
    expect(request.request.method).toBe('GET');
    request.flush({
      id: 1,
      userId: 22,
      title: 'post title',
      body: 'post body',
    });

    const result = await promise;

    expect(result).toEqual({
      id: 1,
      userId: 22,
      title: 'post title',
      body: 'post body',
    });
  });
});
