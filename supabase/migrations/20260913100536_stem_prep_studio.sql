-- ============================================================================
-- STEM & SNBT Prep Studio — schema
-- Pola RLS mengikuti migration existing (folders/notes):
--   user_id DEFAULT auth.uid() + policy FOR ALL TO authenticated
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) SESI KUIS (satu kali user menyelesaikan practice)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stem_quiz_sessions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL DEFAULT auth.uid()
                      REFERENCES auth.users(id) ON DELETE CASCADE,
  subject           text NOT NULL,              -- 'umum' | 'kuantitatif' | 'matematika' | 'custom'
  difficulty        text NOT NULL,              -- 'easy' | 'medium' | 'hard' | 'hots'
  mode              text NOT NULL,              -- 'relaxed' | 'exam'
  topic             text,                       -- judul materi / topik bebas
  total_questions   int  NOT NULL DEFAULT 0,
  correct_count     int  NOT NULL DEFAULT 0,
  score             numeric(5,2) NOT NULL DEFAULT 0,   -- 0.00 – 100.00
  duration_sec      int  NOT NULL DEFAULT 0,
  time_limit_sec    int,                        -- NULL = relaxed / tanpa batas
  started_at        timestamptz NOT NULL DEFAULT now(),
  ended_at          timestamptz,
  metadata          jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS stem_sessions_user_idx
  ON public.stem_quiz_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS stem_sessions_user_subject_idx
  ON public.stem_quiz_sessions(user_id, subject);

ALTER TABLE public.stem_quiz_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their own stem sessions"
  ON public.stem_quiz_sessions;
CREATE POLICY "Users manage their own stem sessions"
  ON public.stem_quiz_sessions FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

REVOKE ALL ON public.stem_quiz_sessions FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stem_quiz_sessions TO authenticated;
GRANT ALL ON public.stem_quiz_sessions TO service_role;

-- ----------------------------------------------------------------------------
-- 2) SOAL PER SESI (untuk review + weakness aggregation)
--    user_id di-denormalize agar RLS sederhana & query aggregate cepat.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stem_quiz_questions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      uuid NOT NULL
                    REFERENCES public.stem_quiz_sessions(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL DEFAULT auth.uid()
                    REFERENCES auth.users(id) ON DELETE CASCADE,
  ord             int  NOT NULL,                 -- urutan 1..N dalam sesi
  question_text   text NOT NULL,
  type            text NOT NULL,                 -- 'mc' | 'num'
  options         jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer  text NOT NULL,
  user_answer     text,                          -- NULL = belum dijawab
  is_correct      boolean,                       -- NULL = belum dinilai
  hints           jsonb NOT NULL DEFAULT '[]'::jsonb,
  solution        text  NOT NULL DEFAULT '',
  topic           text  NOT NULL DEFAULT '',     -- label konsep (dari AI)
  time_spent_sec  int   NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS stem_questions_session_idx
  ON public.stem_quiz_questions(session_id, ord);
CREATE INDEX IF NOT EXISTS stem_questions_user_topic_idx
  ON public.stem_quiz_questions(user_id, topic);
CREATE INDEX IF NOT EXISTS stem_questions_user_correct_idx
  ON public.stem_quiz_questions(user_id, is_correct);

ALTER TABLE public.stem_quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their own stem questions"
  ON public.stem_quiz_questions;
CREATE POLICY "Users manage their own stem questions"
  ON public.stem_quiz_questions FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

REVOKE ALL ON public.stem_quiz_questions FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stem_quiz_questions TO authenticated;
GRANT ALL ON public.stem_quiz_questions TO service_role;

-- ----------------------------------------------------------------------------
-- 3) VIEW: weakness per topik (dihitung on-the-fly, tidak butuh tabel baru)
--    SECURITY INVOKER (default) → tetap patuh RLS user pemanggil.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.stem_weakness AS
SELECT
  q.user_id,
  s.subject,
  q.topic,
  COUNT(*)                                          AS attempts,
  COUNT(*) FILTER (WHERE q.is_correct)              AS correct,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE q.is_correct)
      / NULLIF(COUNT(*) FILTER (WHERE q.is_correct IS NOT NULL), 0),
    1
  )                                                 AS accuracy_pct,
  MAX(q.created_at)                                 AS last_seen
FROM public.stem_quiz_questions q
JOIN public.stem_quiz_sessions  s ON s.id = q.session_id
WHERE q.is_correct IS NOT NULL
GROUP BY q.user_id, s.subject, q.topic;

GRANT SELECT ON public.stem_weakness TO authenticated;
REVOKE ALL ON public.stem_weakness FROM anon;