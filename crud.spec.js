const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('CRUD тесты для JSONPlaceholder (/posts)', () => {

  test('POST: создание нового поста', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/posts`, {
      data: {
        title: 'Тестовый заголовок',
        body: 'Содержание тестового поста',
        userId: 1,
      },
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    
    expect(body).toMatchObject({
      title: 'Тестовый заголовок',
      body: 'Содержание тестового поста',
      userId: 1,
      id: 101, 
    });
  });

  test('GET: получение поста по ID и списка постов', async ({ request }) => {
    const singleResponse = await request.get(`${BASE_URL}/posts/1`);
    expect(singleResponse.ok()).toBeTruthy();
    
    const post = await singleResponse.json();
    expect(post.id).toBe(1);
    expect(post).toHaveProperty('title');

    const listResponse = await request.get(`${BASE_URL}/posts`, {
      params: { userId: 1 },
    });
    expect(listResponse.status()).toBe(200);
    const posts = await listResponse.json();
    expect(posts.length).toBe(10);
  });

  test('PUT: полное обновление поста', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/posts/1`, {
      data: {
        id: 1,
        title: 'Обновленный заголовок',
        body: 'Полностью обновленный текст',
        userId: 1,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.title).toBe('Обновленный заголовок');
    expect(body.body).toBe('Полностью обновленный текст');
  });

  test('PATCH: частичное обновление поста', async ({ request }) => {
    const response = await request.patch(`${BASE_URL}/posts/1`, {
      data: {
        title: 'Частично обновленный заголовок',
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.title).toBe('Частично обновленный заголовок');
    expect(body.userId).toBe(1);
  });
  test('DELETE: удаление поста', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/posts/1`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual({});
  });
});
