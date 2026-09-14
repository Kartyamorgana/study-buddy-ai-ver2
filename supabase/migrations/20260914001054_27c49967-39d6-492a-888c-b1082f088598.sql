DROP VIEW IF EXISTS public.stem_weakness;

CREATE VIEW public.stem_weakness AS
SELECT
  q.user_id,
  s.subject,
  q.topic,
  COUNT(*)                                          AS attempts,
  COUNT(*) FILTER (WHERE q.is_correct = true)       AS correct,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE q.is_correct = true)
      / NULLIF(COUNT(*), 0),
    1
  )                                                 AS accuracy_pct,
  MAX(q.created_at)                                 AS last_seen
FROM public.stem_quiz_questions q
JOIN public.stem_quiz_sessions  s ON s.id = q.session_id
GROUP BY q.user_id, s.subject, q.topic;

ALTER VIEW public.stem_weakness SET (security_invoker = on);

GRANT SELECT ON public.stem_weakness TO authenticated;
GRANT ALL ON public.stem_weakness TO service_role;