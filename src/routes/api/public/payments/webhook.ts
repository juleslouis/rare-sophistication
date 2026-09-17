import { createFileRoute } from "@tanstack/react-router";
import {
  type StripeEnv,
  verifyWebhook,
} from "@/lib/stripe.server";

type CheckoutSession = {
  id: string;
  payment_status?: string;
  payment_intent?: string | { id?: string } | null;
  amount_total?: number | null;
  total_details?: { amount_tax?: number | null } | null;
  currency?: string | null;
  customer_details?: {
    email?: string | null;
    address?: { country?: string | null } | null;
  } | null;
  metadata?: { userId?: string } | null;
};

async function recordSession(
  session: CheckoutSession,
  env: StripeEnv,
  status: "paid" | "pending" | "failed",
) {
  const signupId = session.metadata?.userId;
  if (!signupId) return;
  const { supabaseAdmin } = await import(
    "@/integrations/supabase/client.server"
  );
  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;
  await supabaseAdmin.from("private_orders").upsert(
    {
      waitlist_signup_id: signupId,
      stripe_session_id: session.id,
      stripe_payment_intent_id: paymentIntent,
      email: session.customer_details?.email ?? "",
      amount_total: session.amount_total ?? 0,
      amount_tax: session.total_details?.amount_tax ?? 0,
      currency: session.currency ?? "eur",
      customer_country: session.customer_details?.address?.country ?? null,
      status,
      environment: env,
    },
    { onConflict: "stripe_session_id" },
  );
}

async function handleWebhook(request: Request, env: StripeEnv) {
  const event = await verifyWebhook(request, env);
  const session = event.data.object as CheckoutSession;
  if (event.type === "checkout.session.completed") {
    await recordSession(
      session,
      env,
      session.payment_status === "unpaid" ? "pending" : "paid",
    );
  } else if (event.type === "checkout.session.async_payment_succeeded") {
    await recordSession(session, env, "paid");
  } else if (event.type === "checkout.session.async_payment_failed") {
    await recordSession(session, env, "failed");
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv);
          return Response.json({ received: true });
        } catch (error) {
          console.error("[payments] webhook error", error);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});