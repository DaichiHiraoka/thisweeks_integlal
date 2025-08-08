import { test, expect, afterAll } from 'bun:test';
import { server } from '../app/server/server';

const base = `http://localhost:${server.port}`;

afterAll(() => server.stop());

test('GET /', async () => {
  const res = await fetch(base + '/');
  expect(res.status).toBe(200);
});
