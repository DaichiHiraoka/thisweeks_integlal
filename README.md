# Integral Practice App

Minimal Bun + Hono + Preact skeleton for a learning application.

## Development

```
bun run app/server/server.ts
```

The server listens on `PORT` (default 3000).

Visit `http://localhost:3000/?session=demo` to see the demo data.
Any other UUID can be used as `session` to create a new session.

## Scripts

- `bun run app/scripts/seed.ts` – seed demo data
- `bun test` – run tests
- `bunx tsc --noEmit` – type check

## Environment variables

- `PORT` – server port (default 3000)
- `DB_PATH` – SQLite database path (default `./data/app.db`)
- `ALLOWED_ORIGINS` – optional CSV of origins for CORS

## API quick start

- `POST /api/problems` – `{ session_id, question_tex, answer_tex, video_id, t_sec, source }`
- `GET /api/problems?session_id=...&cursor=...`
- `PUT /api/solve/:id` – `{ user_answer_tex, correct, time_ms }`
- `PUT /api/watchlog` – `{ session_id, video_id, watched_percent }`
