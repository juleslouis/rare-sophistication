import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().trim().toLowerCase().max(255).email(),
  locale: z.enum(["fr", "en"]).default("fr"),
  /** Champ leurre (honeypot) : toujours vide pour un humain. */
  company: z.string().max(255).optional().default(""),
  /** Horodatage d'affichage du formulaire (ms epoch, côté client). */
  renderedAt: z.number().int().nonnegative().optional().default(0),
  /** Consentement RGPD explicite à recevoir les communications de la maison. */
  marketingConsent: z.boolean().optional().default(false),
  /** Texte exact de la case cochée, conservé comme preuve. */
  consentText: z.string().trim().max(1000).optional().default(""),
});

/** Version du texte de consentement affiché (à incrémenter si le texte change). */
export const CONSENT_VERSION = "2026-08-v1";

/** Délai minimal humain entre l'affichage du formulaire et l'envoi. */
const MIN_ELAPSED_MS = 1500;
/** Au-delà, le jeton de temps est considéré comme rejoué. */
const MAX_ELAPSED_MS = 2 * 60 * 60 * 1000;

/** Limitation simple par IP (fenêtre glissante, mémoire de l'instance). */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT_MAX;
}

/**
 * Enregistre une inscription à la liste d'attente (e-mail + horodatage).
 * Écriture côté serveur uniquement, précédée d'un filtrage anti-bot invisible
 * (honeypot, cadence de saisie, limitation par IP). Les soumissions suspectes
 * renvoient une réponse indistinguable d'un succès mais ne sont pas stockées.
 */
export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => signupSchema.parse(data))
  .handler(async ({ data }) => {
    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    const ua = getRequestHeader("user-agent") ?? "";
    const elapsed = data.renderedAt ? Date.now() - data.renderedAt : 0;

    const suspicious =
      data.company.trim().length > 0 ||
      !data.renderedAt ||
      elapsed < MIN_ELAPSED_MS ||
      elapsed > MAX_ELAPSED_MS ||
      ua.trim().length === 0 ||
      rateLimited(ip);

    if (suspicious) {
      console.warn("[waitlist] submission blocked (anti-bot)");
      // Réponse neutre : ne pas indiquer au bot qu'il a été filtré.
      return { ok: true as const, alreadyRegistered: false, count: null };
    }

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const consentAt = new Date().toISOString();
    const consentText = data.consentText.slice(0, 1000);

    const { error } = await supabaseAdmin.from("waitlist_signups").insert({
      email: data.email,
      locale: data.locale,
      source: "waitlist",
      marketing_consent: data.marketingConsent,
      consent_text: consentText || null,
      consent_version: CONSENT_VERSION,
      consent_at: consentAt,
      consent_ip: ip,
      consent_user_agent: ua.slice(0, 500),
    });

    // Doublon : on considère l'inscription comme déjà acquise.
    if (error && error.code !== "23505") {
      console.error("[waitlist] insert failed", error.message);
      return { ok: false as const };
    }

    // Miroir dans la base clients Shopify (consentement e-mail, étiquette waitlist).
    if (!error) {
      const { createWaitlistCustomer } = await import("./shopify.server");
      const synced = await createWaitlistCustomer(data.email, data.locale, {
        granted: data.marketingConsent,
        text: consentText,
        version: CONSENT_VERSION,
        at: consentAt,
        ip,
        userAgent: ua,
      });
      if (synced.ok) {
        await supabaseAdmin
          .from("waitlist_signups")
          .update({ shopify_consent_synced_at: new Date().toISOString() })
          .eq("email", data.email);
      }
    }

    const { count } = await supabaseAdmin
      .from("waitlist_signups")
      .select("id", { count: "exact", head: true });

    return {
      ok: true as const,
      alreadyRegistered: Boolean(error),
      count: (count ?? 0) as number | null,
    };
  });

/** Nombre total d'inscriptions (public, agrégat seul — aucun e-mail exposé). */
export const getWaitlistCount = createServerFn({ method: "GET" }).handler(
  async () => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { count, error } = await supabaseAdmin
      .from("waitlist_signups")
      .select("id", { count: "exact", head: true });

    if (error) {
      console.error("[waitlist] count failed", error.message);
      return { count: 0 };
    }
    return { count: count ?? 0 };
  },
);
