import { Database } from 'bun:sqlite';

export type Problem = {
  id: string;
  session_id: string;
  question_tex: string;
  answer_tex: string;
  video_id: string;
  t_sec: number;
  created_at: string;
};

export type Solve = {
  id: string;
  problem_id: string;
  user_answer_tex: string;
  correct: number;
  time_ms: number;
  created_at: string;
};

const dbPath = process.env.DB_PATH || './data/app.db';
export const db = new Database(dbPath);

db.exec("PRAGMA journal_mode=WAL;");
db.exec("PRAGMA synchronous=NORMAL;");

db.exec(`CREATE TABLE IF NOT EXISTS problems(
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  question_tex TEXT NOT NULL,
  answer_tex TEXT NOT NULL,
  video_id TEXT NOT NULL,
  t_sec INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);`);

db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_problems_unique ON problems(session_id, video_id, t_sec);`);
db.exec(`CREATE INDEX IF NOT EXISTS idx_problems_session_created ON problems(session_id, created_at DESC);`);

db.exec(`CREATE TABLE IF NOT EXISTS solves(
  id TEXT PRIMARY KEY,
  problem_id TEXT NOT NULL,
  user_answer_tex TEXT NOT NULL,
  correct INTEGER NOT NULL,
  time_ms INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);`);

db.exec(`CREATE TABLE IF NOT EXISTS watchlog(
  session_id TEXT PRIMARY KEY,
  video_id TEXT NOT NULL,
  watched_percent INTEGER NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);`);

export function getProblems(session_id: string, cursor?: string, limit = 20): Problem[] {
  let query = 'SELECT * FROM problems WHERE session_id = ?';
  const params: any[] = [session_id];
  if (cursor) {
    query += ' AND created_at < ?';
    params.push(cursor);
  }
  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);
  const stmt = db.query<Problem, any[]>(query);
  return stmt.all(...params);
}

export function insertProblem(p: { session_id: string; question_tex: string; answer_tex: string; video_id: string; t_sec: number; id?: string }): { id: string; created: boolean } {
  const id = p.id || crypto.randomUUID();
  const stmt = db.prepare(
    'INSERT INTO problems (id, session_id, question_tex, answer_tex, video_id, t_sec) VALUES (?,?,?,?,?,?)'
  );
  try {
    stmt.run(id, p.session_id, p.question_tex, p.answer_tex, p.video_id, p.t_sec);
    return { id, created: true };
  } catch (e) {
    if (String(e).includes('UNIQUE')) {
      const existing = db
        .query<{ id: string }, [string, string, number]>(
          'SELECT id FROM problems WHERE session_id = ? AND video_id = ? AND t_sec = ?'
        )
        .get(p.session_id, p.video_id, p.t_sec);
      if (existing) return { id: existing.id, created: false };
    }
    throw e;
  }
}

export function getProblemById(id: string): Problem | undefined {
  return db.query<Problem, [string]>('SELECT * FROM problems WHERE id = ?').get(id) || undefined;
}

export function insertSolve(s: { problem_id: string; user_answer_tex: string; correct: boolean; time_ms: number; }): string {
  const id = crypto.randomUUID();
  const stmt = db.prepare(
    'INSERT INTO solves (id, problem_id, user_answer_tex, correct, time_ms) VALUES (?,?,?,?,?)'
  );
  stmt.run(id, s.problem_id, s.user_answer_tex, s.correct ? 1 : 0, s.time_ms);
  return id;
}

export function updateWatchlog(entry: { session_id: string; video_id: string; watched_percent: number }): void {
  const stmt = db.prepare("INSERT INTO watchlog (session_id, video_id, watched_percent) VALUES (?,?,?) ON CONFLICT(session_id) DO UPDATE SET watched_percent = excluded.watched_percent, updated_at = datetime('now')");
  stmt.run(entry.session_id, entry.video_id, entry.watched_percent);
}
