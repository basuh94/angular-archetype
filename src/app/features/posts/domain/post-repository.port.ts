import { Post } from './post.model';

export interface PostRepository {
  getById(id: number): Promise<Post>;
}
