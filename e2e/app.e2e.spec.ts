import { expect, test } from '@playwright/test';

const apiPattern = '**/jsonplaceholder.typicode.com/posts/*';

test('home renders and links to posts feature', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'angular-archetype' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Ver ejemplo de feature posts/i })).toBeVisible();
});

test('posts page renders data from mocked API', async ({ page }) => {
  await page.route(apiPattern, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        userId: 99,
        title: 'Mocked post title',
        body: 'Mocked post body',
      }),
    });
  });

  await page.goto('/');
  await page.getByRole('link', { name: /Ver ejemplo de feature posts/i }).click();

  await expect(page.getByRole('heading', { name: /Post detalle/i })).toBeVisible();
  await expect(page.getByText('#1 - Mocked post title')).toBeVisible();
  await expect(page.getByText('Mocked post body')).toBeVisible();
  await expect(page.getByText('Autor: 99')).toBeVisible();
});

test('posts page renders normalized server error', async ({ page }) => {
  await page.route(apiPattern, async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'server down' }),
    });
  });

  await page.goto('/');
  await page.getByRole('link', { name: /Ver ejemplo de feature posts/i }).click();

  await expect(page.getByText('Error interno del servidor. Inténtalo más tarde.')).toBeVisible();
});
