import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const tokenSchema = z.string().regex(/^[a-f0-9]{64}$/);

export const getPrivateAccess = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ token: tokenSchema }).parse(data),
  )
  .handler(async ({ data }) => {
    const { PRIVATE_PRODUCT, resolvePrivateAccess } = await import(
      "./private-access.server"
    );
    const access = await resolvePrivateAccess(data.token);
    if (!access) return { valid: false as const };

    return {
      valid: true as const,
      product: {
        title: PRIVATE_PRODUCT.title,
        statement: PRIVATE_PRODUCT.statement,
        details: [...PRIVATE_PRODUCT.details],
        price: PRIVATE_PRODUCT.price,
        closing: PRIVATE_PRODUCT.closing,
        limit: PRIVATE_PRODUCT.limit,
      },
      allocated: access.allocated,
    };
  });

export const createPrivateCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        token: tokenSchema,
        returnUrl: z.string().url().max(2048),
        environment: z.enum(["sandbox", "live"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    try {
      const { PRIVATE_PRODUCT, resolvePrivateAccess } = await import(
        "./private-access.server"
      );
      const access = await resolvePrivateAccess(data.token);
      if (!access) return { error: "Cet accès privé n’est plus valide." };
      if (access.allocated > PRIVATE_PRODUCT.limit) {
        return { error: "Cette série est entièrement attribuée." };
      }

      const { createStripeClient } = await import("./stripe.server");
      const stripe = createStripeClient(data.environment);
      const prices = await stripe.prices.list({
        lookup_keys: [PRIVATE_PRODUCT.priceId],
        limit: 1,
      });
      const stripePrice = prices.data[0];
      if (!stripePrice) throw new Error("Price not found");

      const found = await stripe.customers.search({
        query: `metadata['userId']:'${access.signupId}'`,
        limit: 1,
      });
      let customerId = found.data[0]?.id;
      if (!customerId) {
        const byEmail = await stripe.customers.list({
          email: access.email,
          limit: 1,
        });
        const customer = byEmail.data[0];
        if (customer) {
          customerId = customer.id;
          if (customer.metadata?.userId !== access.signupId) {
            await stripe.customers.update(customer.id, {
              metadata: { ...customer.metadata, userId: access.signupId },
            });
          }
        } else {
          const created = await stripe.customers.create({
            email: access.email,
            metadata: { userId: access.signupId },
          });
          customerId = created.id;
        }
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [{ price: stripePrice.id, quantity: 1 }],
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        customer: customerId,
        shipping_address_collection: {
          allowed_countries: [
            "FR",
            "BE",
            "DE",
            "ES",
            "IT",
            "LU",
            "NL",
            "PT",
            "AT",
            "IE",
            "DK",
            "SE",
            "FI",
            "CH",
            "GB",
          ],
        },
        managed_payments: { enabled: true },
        metadata: {
          userId: access.signupId,
          privateAccess: "serie_i",
        },
        payment_intent_data: {
          description: PRIVATE_PRODUCT.title,
          metadata: { userId: access.signupId },
        },
      });

      if (!session.client_secret) throw new Error("Missing client secret");

      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      await supabaseAdmin.from("private_orders").upsert(
        {
          waitlist_signup_id: access.signupId,
          stripe_session_id: session.id,
          email: access.email,
          status: "pending",
          environment: data.environment,
        },
        { onConflict: "stripe_session_id" },
      );

      return { clientSecret: session.client_secret };
    } catch (error) {
      const { getStripeErrorMessage } = await import("./stripe.server");
      return { error: getStripeErrorMessage(error) };
    }
  });