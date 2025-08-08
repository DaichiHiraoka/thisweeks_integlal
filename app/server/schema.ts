import { z } from 'zod';

export const problemInputSchema = z.object({
  session_id: z.string(),
  question_tex: z.string().min(1).max(2000),
  answer_tex: z.string().min(1).max(2000),
  video_id: z.string(),
  t_sec: z.number().int(),
});

export const solveInputSchema = z.object({
  user_answer_tex: z.string().min(1).max(2000),
  correct: z.boolean(),
  time_ms: z.number().int(),
});

export const watchlogSchema = z.object({
  session_id: z.string(),
  video_id: z.string(),
  watched_percent: z.number().int().min(0).max(100),
});
