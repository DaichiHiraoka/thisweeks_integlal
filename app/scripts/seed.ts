import { insertProblem } from '../server/db';

insertProblem({
  session_id: 'demo',
  question_tex: 'x',
  answer_tex: '1',
  video_id: 'demo',
  t_sec: 0,
});

insertProblem({
  session_id: 'demo',
  question_tex: 'x^2',
  answer_tex: '2x',
  video_id: 'demo',
  t_sec: 10,
});

insertProblem({
  session_id: 'demo',
  question_tex: '\\int x dx',
  answer_tex: 'x^2/2+C',
  video_id: 'demo',
  t_sec: 20,
});

console.log('seeded');
