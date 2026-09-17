import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { z } from "zod";

/** Nom des modèles d'e-mails que l'administration peut tester. */
export const TEST_TEMPLATES = [
  "waitlist-confirmation",
  "waitlist-hint-1",
  "waitlist-hint-2",
  "waitlist-question",
  "waitlist-opening",
] as const;

type AdminSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["ADMIN_SESSION_SECRET"]!,
    name: "divus-admin",
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function isUnlocked() {
  const session = await useSession<AdminSession>(sessionConfig());
  return Boolean(session.data.unlocked);
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ password: z.string().min(1).max(256) }).parse(data),
  )
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) throw new Error("ADMIN_PASSWORD is not configured");
    if (!matches(data.password, expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await useSession<AdminSession>(sessionConfig());
    await session.clear();
    return { ok: true as const };
  },
);

export type AdminEvent = {
  timestamp: string;
  recipient: string;
  eventType: string;
  status: string | null;
  label: string | null;
};

export type PrivateAccessRecipient = {
  id: string;
  email: string;
  createdAt: string;
  grantedAt: string | null;
  revokedAt: string | null;
};

/** Journal d'envoi + agrégats de la liste d'accès anticipé. */
export const getAdminDashboard = createServerFn({ method: "POST" }).handler(
  async () => {
    if (!(await isUnlocked())) return { locked: true as const };

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const [total, confirmed, hint1, hint2, question, recipients, orders] = await Promise.all([
      supabaseAdmin
        .from("waitlist_signups")
        .select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("waitlist_signups")
        .select("id", { count: "exact", head: true })
        .eq("marketing_consent", true),
      supabaseAdmin
        .from("waitlist_signups")
        .select("id", { count: "exact", head: true })
        .not("hint_1_sent_at", "is", null),
      supabaseAdmin
        .from("waitlist_signups")
        .select("id", { count: "exact", head: true })
        .not("hint_2_sent_at", "is", null),
      supabaseAdmin
        .from("waitlist_signups")
        .select("id", { count: "exact", head: true })
        .not("question_sent_at", "is", null),
      supabaseAdmin
        .from("waitlist_signups")
        .select("id, email, created_at, access_granted_at, access_revoked_at")
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin
        .from("private_orders")
        .select("amount_total, amount_tax, currency, status")
        .order("created_at", { ascending: false }),
    ]);

    let events: AdminEvent[] = [];
    let historyStartsAt: string | null = null;
    let logsError: string | null = null;

    try {
      const { listEmailLogs } = await import("@lovable.dev/email-js");
      const res = await listEmailLogs(
        { limit: 100 },
        { apiKey: process.env["LOVABLE_API_KEY"]! },
      );
      historyStartsAt = res.history_starts_at ?? null;
      events = res.data.map((e) => ({
        timestamp: e.timestamp,
        recipient: e.recipient,
        eventType: e.event_type,
        status: e.status ?? null,
        label: e.tags?.[0] ?? null,
      }));
    } catch (error) {
      logsError =
        error instanceof Error ? error.message : "journal indisponible";
      console.error("[admin] email logs failed", logsError);
    }

    const counts = events.reduce<Record<string, number>>((acc, e) => {
      acc[e.eventType] = (acc[e.eventType] ?? 0) + 1;
      return acc;
    }, {});

    return {
      locked: false as const,
      waitlist: {
        total: total.count ?? 0,
        consented: confirmed.count ?? 0,
        hint1Sent: hint1.count ?? 0,
        hint2Sent: hint2.count ?? 0,
        questionSent: question.count ?? 0,
      },
      privateAccess: (recipients.data ?? []).map((row) => ({
        id: row.id,
        email: row.email,
        createdAt: row.created_at,
        grantedAt: row.access_granted_at,
        revokedAt: row.access_revoked_at,
      })),
      payments: {
        paid: (orders.data ?? []).filter((row) => row.status === "paid").length,
        total: (orders.data ?? [])
          .filter((row) => row.status === "paid")
          .reduce((sum, row) => sum + row.amount_total, 0),
        tax: (orders.data ?? [])
          .filter((row) => row.status === "paid")
          .reduce((sum, row) => sum + row.amount_tax, 0),
        currency: orders.data?.[0]?.currency ?? "eur",
      },
      events,
      counts,
      historyStartsAt,
      logsError,
    };
  },
);

/** Envoi d'un e-mail de test vers une adresse choisie. */
export const sendAdminTestEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        template: z.enum(TEST_TEMPLATES),
        to: z.string().trim().toLowerCase().email().max(255),
        locale: z.enum(["fr", "en"]).default("fr"),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    if (!(await isUnlocked())) return { locked: true as const };

    const { sendTemplateEmail } = await import("./email-templates/send-email");
    try {
      const result = await sendTemplateEmail(data.template, data.to, {
        templateData: { locale: data.locale },
        idempotencyKey: `admin-test-${data.template}-${Date.now()}`,
      });
      return {
        locked: false as const,
        ok: result.sent,
        reason: result.sent ? null : result.reason,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "envoi impossible";
      console.error("[admin] test email failed", message);
      return { locked: false as const, ok: false, reason: message };
    }
  });

export const grantPrivateAccess = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ signupId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }) => {
    if (!(await isUnlocked())) return { locked: true as const };
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token, "utf8").digest("hex");
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error } = await supabaseAdmin
      .from("waitlist_signups")
      .update({
        access_token_hash: tokenHash,
        access_granted_at: new Date().toISOString(),
        access_revoked_at: null,
      })
      .eq("id", data.signupId);
    if (error) return { locked: false as const, ok: false as const };
    return { locked: false as const, ok: true as const, token };
  });

export const revokePrivateAccess = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ signupId: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data }) => {
    if (!(await isUnlocked())) return { locked: true as const };
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error } = await supabaseAdmin
      .from("waitlist_signups")
      .update({ access_revoked_at: new Date().toISOString() })
      .eq("id", data.signupId);
    return { locked: false as const, ok: !error };
  });
