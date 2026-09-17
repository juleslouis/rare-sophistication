CREATE POLICY "No direct access to waitlist signups"
ON public.waitlist_signups
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "No direct access to private orders"
ON public.private_orders
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);