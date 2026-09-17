ALTER TABLE public.waitlist_signups
  ADD COLUMN IF NOT EXISTS access_token_hash text,
  ADD COLUMN IF NOT EXISTS access_granted_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS access_revoked_at timestamp with time zone;

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_signups_access_token_hash_key
  ON public.waitlist_signups (access_token_hash)
  WHERE access_token_hash IS NOT NULL;

CREATE TABLE public.private_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  waitlist_signup_id uuid NOT NULL REFERENCES public.waitlist_signups(id) ON DELETE RESTRICT,
  stripe_session_id text NOT NULL UNIQUE,
  stripe_payment_intent_id text,
  email text NOT NULL,
  amount_total integer NOT NULL DEFAULT 0,
  amount_tax integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'eur',
  customer_country text,
  status text NOT NULL DEFAULT 'pending',
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.private_orders TO service_role;

ALTER TABLE public.private_orders ENABLE ROW LEVEL SECURITY;

CREATE INDEX private_orders_created_at_idx
  ON public.private_orders (created_at DESC);
CREATE INDEX private_orders_waitlist_signup_id_idx
  ON public.private_orders (waitlist_signup_id);

CREATE OR REPLACE FUNCTION public.set_private_orders_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_private_orders_updated_at
BEFORE UPDATE ON public.private_orders
FOR EACH ROW EXECUTE FUNCTION public.set_private_orders_updated_at();