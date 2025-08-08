import { h } from 'preact';
import type { ComponentChildren } from 'preact';

export function Table({ children }: { children: ComponentChildren }) {
  return <table class="table">{children}</table>;
}
