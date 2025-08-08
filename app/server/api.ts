import { Hono } from 'hono';
import { problemInputSchema, solveInputSchema, watchlogSchema } from './schema';
import { getProblems, insertProblem, insertSolve, updateWatchlog, getProblemById } from './db';

export function createApi(clients: Set<any>) {
  const api = new Hono();

  api.get('/problems', (c) => {
    const sessionId = c.req.query('session_id');
    if (!sessionId) return c.json({ error: 'session_id required' }, 400);
    const cursor = c.req.query('cursor') || undefined;
    const items = getProblems(sessionId, cursor);
    const last = items[items.length - 1];
    const nextCursor = last ? last.created_at : undefined;
    return c.json({ items, nextCursor });
  });

  api.post('/problems', async (c) => {
    const body = await c.req.json();
    const parsed = problemInputSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.message }, 400);
    const result = insertProblem(parsed.data);
    const problem = result.created
      ? { id: result.id, ...parsed.data, created_at: new Date().toISOString() }
      : getProblemById(result.id)!; // duplicate → 既存レコードを取得
    for (const ws of clients) {
      ws.send(JSON.stringify({ type: 'problem_added', problem }));
    }
    return c.json({ id: result.id }, result.created ? 201 : 200);
  });

  api.put('/solve/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const parsed = solveInputSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.message }, 400);
    insertSolve({ problem_id: id, ...parsed.data });
    for (const ws of clients) {
      ws.send(JSON.stringify({ type: 'problem_solved', id, correct: parsed.data.correct }));
    }
    return c.json({ updated: true });
  });

  api.put('/watchlog', async (c) => {
    const body = await c.req.json();
    const parsed = watchlogSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.message }, 400);
    updateWatchlog(parsed.data);
    for (const ws of clients) {
      ws.send(JSON.stringify({ type: 'watchlog_updated', ...parsed.data }));
    }
    return c.json({ updated: true });
  });

  return api;
}
