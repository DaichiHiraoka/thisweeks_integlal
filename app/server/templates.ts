export function htmlTemplate(body: string, nonce: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><link rel="modulepreload" href="/client.ts"/><link rel="stylesheet" href="/styles.css"/><style>:root{color-scheme:light dark}body{font-family:system-ui,sans-serif;margin:0;padding:1rem}</style></head><body>${body}<script nonce="${nonce}" type="module" src="/client.ts"></script></body></html>`;
}

export function cspHeader(nonce: string): string {
  return `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; connect-src 'self'`;
}
