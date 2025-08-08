import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { render } from './ssr';
import { htmlTemplate, cspHeader } from './templates';
import { createApi } from './api';

const clients = new Set<any>();
const app = new Hono();

app.use('*', async (c, next) => {
  const start = performance.now();
  await next();
  const ms = Math.round(performance.now() - start);
  console.log(JSON.stringify({ path: c.req.path, ms }));
});

app.get('/', (c) => {
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const body = render();
  c.header('Content-Type', 'text/html');
  c.header('Content-Security-Policy', cspHeader(nonce));
  return c.body(htmlTemplate(body, nonce));
});

app.route('/api', createApi(clients));

(app.get as any)('/ws', (c: any) => c.text(''), {
  websocket: {
    open(ws: any) {
      clients.add(ws);
    },
    message() {},
    close(ws: any) {
      clients.delete(ws);
    },
  },
});

// static files
app.use('/styles.css', serveStatic({ path: './app/ui/styles.css' }));
app.use('/client.ts', serveStatic({ path: './app/ui/client.ts' }));
app.use('/islands/*', serveStatic({ root: './app/ui/islands', rewriteRequestPath: (p) => p.replace('/islands', '') }));
app.use('/favicon.svg', serveStatic({ path: './app/public/favicon.svg' }));
app.use('/robots.txt', serveStatic({ path: './app/public/robots.txt' }));

const port = Number(process.env.PORT || 3000);

export const server = Bun.serve({ fetch: app.fetch, port, websocket: { message() {} } });

console.log(`Server listening on http://localhost:${port}`);
