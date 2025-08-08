import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

type Problem = {
  id: string;
  question_tex: string;
  answer_tex: string;
  created_at: string;
  solved?: boolean;
  correct?: boolean;
};

export default function PracticeIsland({ ws }: { ws: WebSocket }) {
  const sessionId = new URLSearchParams(location.search).get('session') || '';
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selected, setSelected] = useState<Problem | null>(null);
  const [answer, setAnswer] = useState('');
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/problems?session_id=${sessionId}`);
      const data = await res.json();
      setProblems(data.items || []);
    }
    load();

    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'problem_added' && msg.problem.session_id === sessionId) {
        setProblems((p) => [msg.problem, ...p]);
      }
      if (msg.type === 'problem_solved') {
        setProblems((p) =>
          p.map((pr) => (pr.id === msg.id ? { ...pr, solved: true, correct: msg.correct } : pr))
        );
      }
      if (msg.type === 'watchlog_updated') {
        // no-op for now
      }
    };
  }, []);

  const submit = async () => {
    if (!selected) return;
    const time_ms = Date.now() - startTime;
    const correct = answer.trim() === selected.answer_tex.trim();
    await fetch(`/api/solve/${selected.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ user_answer_tex: answer, correct, time_ms }),
    });
    setAnswer('');
    setSelected(null);
  };

  return (
    <div>
      <ul>
        {problems.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => {
                setSelected(p);
                setStartTime(Date.now());
              }}
            >
              {p.question_tex} {p.solved ? (p.correct ? '✔' : '✘') : ''}
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div>
          <p>{selected.question_tex}</p>
          <input
            value={answer}
            onInput={(e) => setAnswer((e.target as HTMLInputElement).value)}
          />
          <button onClick={submit}>Submit</button>
        </div>
      )}
    </div>
  );
}
