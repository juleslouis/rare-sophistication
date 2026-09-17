import { createHash } from "node:crypto";

const PRODUCT_LIMIT = 117;

export const PRIVATE_PRODUCT = {
  title: "Série I",
  statement: "Cent dix-sept pièces. Jamais reproduites.",
  details: [
    "Coupe oversize structurée.",
    "Manches longues.",
    "Jersey de coton, encolure et poignets en cachemire.",
    "Chaque pièce porte un numéro. Chaque numéro est authentifié par une puce intégrée, vérifiable à tout moment.",
  ],
  price: "1 500 €",
  closing: "Aucune réédition. Aucune exception.",
  limit: PRODUCT_LIMIT,
  priceId: "serie_i_onetime",
} as const;

export function hashAccessToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export async function resolvePrivateAccess(token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return null;

  const { supabaseAdmin } = await import(
    "@/integrations/supabase/client.server"
  );
  const tokenHash = hashAccessToken(token);
  const [{ data: signup, error }, { count }] = await Promise.all([
    supabaseAdmin
      .from("waitlist_signups")
      .select("id, email, locale")
      .eq("access_token_hash", tokenHash)
      .not("access_granted_at", "is", null)
      .is("access_revoked_at", null)
      .maybeSingle(),
    supabaseAdmin
      .from("waitlist_signups")
      .select("id", { count: "exact", head: true })
      .not("access_granted_at", "is", null)
      .is("access_revoked_at", null),
  ]);

  if (error || !signup) return null;
  return {
    signupId: signup.id,
    email: signup.email,
    locale: signup.locale,
    allocated: Math.min(count ?? 0, PRODUCT_LIMIT),
  };
}