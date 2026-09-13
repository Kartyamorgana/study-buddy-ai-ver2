ALTER TABLE public.folders ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

DROP POLICY IF EXISTS "Public folders access" ON public.folders;
DROP POLICY IF EXISTS "Public notes access" ON public.notes;

ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own folders" ON public.folders FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage their own notes" ON public.notes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

REVOKE ALL ON public.folders FROM anon;
REVOKE ALL ON public.notes FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.folders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO authenticated;
GRANT ALL ON public.folders TO service_role;
GRANT ALL ON public.notes TO service_role;

CREATE INDEX IF NOT EXISTS folders_user_id_idx ON public.folders(user_id);
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON public.notes(user_id);