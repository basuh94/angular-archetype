import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/home.page').then((module) => module.HomePage),
  },
  {
    path: 'posts',
    loadChildren: () =>
      import('./features/posts/posts.routes').then((module) => module.POSTS_ROUTES),
  },
];
