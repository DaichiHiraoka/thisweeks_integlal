import { h } from 'preact';
import type { ComponentChildren } from 'preact';

export function Badge({ children }: { children: ComponentChildren }) {
  return <span class="badge">{children}</span>;
}
