import { insertProblem } from '../server/db';

insertProblem({
  session_id: 'demo',
  question_tex: 'x',
  answer_tex: '1',
  video_id: 'demo',
  t_sec: 0,
});

console.log('seeded');
