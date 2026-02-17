import { inject, Injectable } from '@angular/core';
import { Post } from '../domain/post.model';
import { POST_REPOSITORY } from './post-repository.token';

@Injectable()
export class GetPostByIdUseCase {
  private readonly repository = inject(POST_REPOSITORY);

  execute(id: number): Promise<Post> {
    return this.repository.getById(id);
  }
}
