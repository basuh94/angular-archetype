import { Post } from '../domain/post.model';
import { PostDto } from './post.dto';

export function mapPostDtoToDomain(dto: PostDto): Post {
  return {
    id: dto.id,
    userId: dto.userId,
    title: dto.title,
    body: dto.body,
  };
}
