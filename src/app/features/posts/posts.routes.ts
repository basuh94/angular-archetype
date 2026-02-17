import { Routes } from '@angular/router';

export const POSTS_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('./presentation/post-detail.page').then((module) => module.PostDetailPage),
  },
];
