ALTER TABLE public.waitlist_signups
  ADD COLUMN IF NOT EXISTS hint_1_sent_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS hint_2_sent_at timestamp with time zone;

CREATE INDEX IF NOT EXISTS waitlist_signups_hint_1_pending_idx
  ON public.waitlist_signups (created_at)
  WHERE hint_1_sent_at IS NULL;

CREATE INDEX IF NOT EXISTS waitlist_signups_hint_2_pending_idx
  ON public.waitlist_signups (created_at)
  WHERE hint_2_sent_at IS NULL;