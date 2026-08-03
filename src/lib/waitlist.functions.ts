import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().trim().toLowerCase().max(255).email(),
  locale: z.enum(["fr", "en"]).default("fr"),
});

/**
 * Enregistre une inscription à la liste d'attente (e-mail + horodatage).
 * Écriture côté serveur uniquement : la table n'est accessible ni en lecture
 * ni en écriture depuis le navigateur.
 */
export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => signupSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { error } = await supabaseAdmin.from("waitlist_signups").insert({
      email: data.email,
      locale: data.locale,
      source: "waitlist",
    });

    // Doublon : on considère l'inscription comme déjà acquise.
    if (error && error.code !== "23505") {
      console.error("[waitlist] insert failed", error.message);
      return { ok: false as const };
    }

    return { ok: true as const, alreadyRegistered: Boolean(error) };
  });
