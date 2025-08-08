import { h, render } from 'preact';

async function load() {
  const ws = new WebSocket(location.origin.replace('http', 'ws') + '/ws');
  const playerRoot = document.getElementById('player-root');
  if (playerRoot) {
    const mod = await import('./islands/PlayerIsland.tsx');
    render(h(mod.default, {}), playerRoot);
  }
  const practiceRoot = document.getElementById('practice-root');
  if (practiceRoot) {
    const mod = await import('./islands/PracticeIsland.tsx');
    render(h(mod.default, { ws }), practiceRoot);
  }
}

load();
