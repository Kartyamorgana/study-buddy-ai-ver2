CREATE TABLE IF NOT EXISTS public.stem_bookmarks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL DEFAULT auth.uid()
                    REFERENCES auth.users(id) ON DELETE CASCADE,
  subject         text NOT NULL,
  topic           text NOT NULL DEFAULT '',
  question_text   text NOT NULL,
  type            text NOT NULL DEFAULT 'mc',
  options         jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer  text NOT NULL,
  hints           jsonb NOT NULL DEFAULT '[]'::jsonb,
  solution        text NOT NULL DEFAULT '',
  note            text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_text)
);

CREATE INDEX IF NOT EXISTS stem_bookmarks_user_idx
  ON public.stem_bookmarks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS stem_bookmarks_user_subject_idx
  ON public.stem_bookmarks(user_id, subject);

ALTER TABLE public.stem_bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their own stem bookmarks"
  ON public.stem_bookmarks;
CREATE POLICY "Users manage their own stem bookmarks"
  ON public.stem_bookmarks FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

REVOKE ALL ON public.stem_bookmarks FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stem_bookmarks TO authenticated;
GRANT ALL ON public.stem_bookmarks TO service_role;