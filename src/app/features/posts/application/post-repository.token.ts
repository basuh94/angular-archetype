import { InjectionToken } from '@angular/core';
import { PostRepository } from '../domain/post-repository.port';

export const POST_REPOSITORY = new InjectionToken<PostRepository>('POST_REPOSITORY');
