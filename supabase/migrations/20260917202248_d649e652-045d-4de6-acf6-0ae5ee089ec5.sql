ALTER TABLE public.waitlist_signups
  ADD COLUMN IF NOT EXISTS question_sent_at timestamp with time zone;

CREATE INDEX IF NOT EXISTS waitlist_signups_question_pending_idx
  ON public.waitlist_signups (created_at)
  WHERE question_sent_at IS NULL;