import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function PlayerIsland() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Play {count}</button>
    </div>
  );
}
