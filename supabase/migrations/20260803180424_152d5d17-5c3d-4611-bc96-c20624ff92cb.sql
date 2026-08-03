ALTER TABLE public.waitlist_signups
  ADD COLUMN IF NOT EXISTS marketing_consent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_text text,
  ADD COLUMN IF NOT EXISTS consent_version text,
  ADD COLUMN IF NOT EXISTS consent_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS consent_ip text,
  ADD COLUMN IF NOT EXISTS consent_user_agent text,
  ADD COLUMN IF NOT EXISTS shopify_consent_synced_at timestamp with time zone;