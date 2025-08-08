import { renderToString } from 'preact-render-to-string';
import { App } from '../ui/app';

export function render() {
  return renderToString(<App />);
}
