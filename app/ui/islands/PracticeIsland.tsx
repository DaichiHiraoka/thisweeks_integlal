import { h } from 'preact';
import { useState } from 'preact/hooks';

export default function PracticeIsland() {
  const [answer, setAnswer] = useState('');
  return (
    <div>
      <input value={answer} onInput={(e) => setAnswer((e.target as HTMLInputElement).value)} />
      <button onClick={() => alert(answer)}>Submit</button>
    </div>
  );
}
