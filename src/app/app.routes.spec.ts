import { routes } from './app.routes';

describe('app routes', () => {
  it('contains home route', () => {
    expect(routes.some((route) => route.path === '')).toBe(true);
  });

  it('contains lazy posts route', () => {
    expect(
      routes.some((route) => route.path === 'posts' && typeof route.loadChildren === 'function'),
    ).toBe(true);
  });
});
