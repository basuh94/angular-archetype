import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { GetPostByIdUseCase } from '../application/get-post-by-id.use-case';
import { POST_REPOSITORY } from '../application/post-repository.token';
import { HttpPostRepository } from '../infrastructure/http-post.repository';
import { PostDetailFacade } from './post-detail.facade';

@Component({
  selector: 'app-post-detail-page',
  imports: [RouterLink],
  templateUrl: './post-detail.page.html',
  styleUrl: './post-detail.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    GetPostByIdUseCase,
    PostDetailFacade,
    { provide: POST_REPOSITORY, useClass: HttpPostRepository },
  ],
})
export class PostDetailPage {
  private readonly route = inject(ActivatedRoute);
  readonly facade = inject(PostDetailFacade);

  private readonly postId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id') ?? '1'))),
    { initialValue: 1 },
  );

  constructor() {
    effect(() => {
      const id = this.postId();
      if (Number.isNaN(id) || id <= 0) {
        return;
      }

      void this.facade.load(id);
    });
  }
}
