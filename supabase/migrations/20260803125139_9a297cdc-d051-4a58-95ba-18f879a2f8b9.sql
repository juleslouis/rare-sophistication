CREATE TABLE public.waitlist_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'fr',
  source TEXT NOT NULL DEFAULT 'waitlist',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX waitlist_signups_email_key ON public.waitlist_signups (lower(email));
CREATE INDEX waitlist_signups_created_at_idx ON public.waitlist_signups (created_at DESC);

GRANT ALL ON public.waitlist_signups TO service_role;

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;