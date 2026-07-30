import { test, expect } from '@playwright/test';

const API = 'https://jsonplaceholder.typicode.com';

test.describe('API smoke (jsonplaceholder)', () => {
  test('GET /posts/1 returns the post with expected shape', async ({ request }) => {
    const resp = await request.get(`${API}/posts/1`);
    expect(resp.status()).toBe(200);
    const post = await resp.json();
    expect(post).toMatchObject({ id: 1, userId: expect.any(Number) });
    expect(typeof post.title).toBe('string');
    expect(post.title.length).toBeGreaterThan(0);
  });

  test('POST /posts creates a resource and echoes payload', async ({ request }) => {
    const payload = { title: 'qa demo', body: 'created from test', userId: 7 };
    const resp = await request.post(`${API}/posts`, { data: payload });
    expect(resp.status()).toBe(201);
    expect(await resp.json()).toMatchObject(payload);
  });

  test('GET /posts/9999 returns 404', async ({ request }) => {
    const resp = await request.get(`${API}/posts/9999`);
    expect(resp.status()).toBe(404);
  });
});
