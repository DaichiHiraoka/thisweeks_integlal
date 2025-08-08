# Integral Practice App

Minimal Bun + Hono + Preact skeleton for a learning application.

## Development

```
bun run app/server/server.ts
```

The server listens on `PORT` (default 3000).

## Scripts

- `bun run app/scripts/seed.ts` – seed demo data
- `bun test` – run tests
- `bunx tsc --noEmit` – type check

## Environment variables

- `PORT` – server port (default 3000)
- `DB_PATH` – SQLite database path (default `./data/app.db`)
