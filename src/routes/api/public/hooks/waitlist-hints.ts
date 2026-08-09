import { createFileRoute } from "@tanstack/react-router";

/**
 * Envoi programmé des indices de la liste d'accès anticipé.
 * Appelé périodiquement par le planificateur de la base.
 *
 * Indice n°1 : 18 jours après l'inscription (fenêtre 2–3 semaines)
 * Indice n°2 : 32 jours après l'inscription (fenêtre 4–5 semaines)
 */
const HINT_1_DELAY_DAYS = 18;
const HINT_2_DELAY_DAYS = 32;
const BATCH_SIZE = 50;

type Stage = 1 | 2;

async function sendStage(stage: Stage) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");

  const delayDays = stage === 1 ? HINT_1_DELAY_DAYS : HINT_2_DELAY_DAYS;
  const column = stage === 1 ? "hint_1_sent_at" : "hint_2_sent_at";
  const template = stage === 1 ? "waitlist-hint-1" : "waitlist-hint-2";
  const dueBefore = new Date(
    Date.now() - delayDays * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data, error } = await supabaseAdmin
    .from("waitlist_signups")
    .select("id, email, locale")
    .is(column, null)
    .lte("created_at", dueBefore)
    .order("created_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (error) {
    console.error(`[waitlist-hints] query failed (stage ${stage})`, error.message);
    return { attempted: 0, sent: 0, skipped: 0, failed: 0 };
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of data ?? []) {
    try {
      const result = await sendTemplateEmail(template, row.email, {
        templateData: { locale: row.locale === "en" ? "en" : "fr" },
        idempotencyKey: `${template}-${row.id}`,
      });
      if (result.sent) sent += 1;
      else skipped += 1;
      // Marqué dans les deux cas : un destinataire supprimé ne doit pas être réessayé.
      await supabaseAdmin
        .from("waitlist_signups")
        .update({ [column]: new Date().toISOString() })
        .eq("id", row.id);
    } catch (err) {
      failed += 1;
      console.error(
        `[waitlist-hints] send failed (stage ${stage})`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  return { attempted: (data ?? []).length, sent, skipped, failed };
}

export const Route = createFileRoute("/api/public/hooks/waitlist-hints")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["SUPABASE_ANON_KEY"];
        const provided =
          request.headers.get("apikey") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

        if (!expected || !provided || provided !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        const hint1 = await sendStage(1);
        const hint2 = await sendStage(2);

        return Response.json({ ok: true, hint1, hint2 });
      },
    },
  },
});
