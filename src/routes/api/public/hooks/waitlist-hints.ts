import { createFileRoute } from "@tanstack/react-router";

/**
 * Envoi programmé des indices de la liste d'accès anticipé.
 * Appelé périodiquement par le planificateur de la base.
 *
 * Indice visuel : 18 jours après l'inscription
 * Indice textuel : 32 jours après l'inscription
 * Question : 45 jours après l'inscription
 */
const HINT_1_DELAY_DAYS = 18;
const HINT_2_DELAY_DAYS = 32;
const QUESTION_DELAY_DAYS = 45;
const BATCH_SIZE = 50;

type Stage = 1 | 2 | 3;

const STAGES = {
  1: {
    delayDays: HINT_1_DELAY_DAYS,
    column: "hint_1_sent_at",
    template: "waitlist-hint-1",
  },
  2: {
    delayDays: HINT_2_DELAY_DAYS,
    column: "hint_2_sent_at",
    template: "waitlist-hint-2",
  },
  3: {
    delayDays: QUESTION_DELAY_DAYS,
    column: "question_sent_at",
    template: "waitlist-question",
  },
} as const;

async function sendStage(stage: Stage) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { sendTemplateEmail } = await import("@/lib/email-templates/send-email");

  const { delayDays, column, template } = STAGES[stage];
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
      const stamp = new Date().toISOString();
      const update =
        stage === 1
          ? { hint_1_sent_at: stamp }
          : stage === 2
            ? { hint_2_sent_at: stamp }
            : { question_sent_at: stamp };
      await supabaseAdmin
        .from("waitlist_signups")
        .update(update)
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
        const accepted = [
          process.env["SUPABASE_ANON_KEY"],
          process.env["SUPABASE_PUBLISHABLE_KEY"],
        ].filter((v): v is string => Boolean(v));
        const provided =
          request.headers.get("apikey") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

        if (!provided || !accepted.includes(provided)) {
          return new Response("Unauthorized", { status: 401 });
        }

        const hint1 = await sendStage(1);
        const hint2 = await sendStage(2);
        const question = await sendStage(3);

        return Response.json({ ok: true, hint1, hint2, question });
      },
    },
  },
});
