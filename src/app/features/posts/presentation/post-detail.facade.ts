import { computed, inject, Injectable, signal } from '@angular/core';
import { isApiError } from '../../../core/errors/api-error.model';
import { Logger } from '../../../core/logging/logger.service';
import { GetPostByIdUseCase } from '../application/get-post-by-id.use-case';
import { Post } from '../domain/post.model';

@Injectable()
export class PostDetailFacade {
  private readonly getPostById = inject(GetPostByIdUseCase);
  private readonly logger = inject(Logger);

  private readonly postState = signal<Post | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly post = this.postState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly vm = computed(() => ({
    post: this.post(),
    loading: this.loading(),
    error: this.error(),
  }));

  async load(id: number): Promise<void> {
    this.loadingState.set(true);
    this.errorState.set(null);

    try {
      const post = await this.getPostById.execute(id);
      this.postState.set(post);
    } catch (error: unknown) {
      this.postState.set(null);
      const message = isApiError(error) ? error.message : 'No se pudo cargar el post.';
      this.errorState.set(message);
      this.logger.warn('Could not load post detail', {
        postId: id,
        message,
      });
    } finally {
      this.loadingState.set(false);
    }
  }
}
