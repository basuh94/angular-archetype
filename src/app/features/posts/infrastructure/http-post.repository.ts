import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Post } from '../domain/post.model';
import { PostRepository } from '../domain/post-repository.port';
import { PostDto } from './post.dto';
import { mapPostDtoToDomain } from './post.mapper';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

@Injectable()
export class HttpPostRepository implements PostRepository {
  private readonly http = inject(HttpClient);

  async getById(id: number): Promise<Post> {
    const dto = await firstValueFrom(this.http.get<PostDto>(`${API_BASE_URL}/posts/${id}`));

    return mapPostDtoToDomain(dto);
  }
}
