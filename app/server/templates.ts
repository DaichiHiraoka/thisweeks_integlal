export function htmlTemplate(body: string, nonce: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><link rel="stylesheet" href="/styles.css" /></head><body>${body}<script nonce="${nonce}" type="module" src="/client.ts"></script></body></html>`;
}

export function cspHeader(nonce: string): string {
  return `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; connect-src 'self'`;
}
