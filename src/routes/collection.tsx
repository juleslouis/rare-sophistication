import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Nav } from "@/components/divus/Nav";
import { Footer } from "@/components/divus/Footer";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "Accès anticipé — DIVUS Paris" },
      {
        name: "description",
        content:
          "Une première série DIVUS Paris arrive. Inscrivez-vous pour un accès prioritaire à l'ouverture — aucune communication superflue avant cela.",
      },
      { property: "og:title", content: "Accès anticipé — DIVUS Paris" },
      {
        property: "og:description",
        content:
          "La rareté héritée, jamais fabriquée. Accès prioritaire à l'ouverture de la première série.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WaitlistPage,
});

const emailSchema = z
  .string()
  .trim()
  .max(255, { message: "Adresse trop longue." })
  .email({ message: "Adresse e-mail invalide." });

function WaitlistPage() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Adresse e-mail invalide.");
      return;
    }
    setError(null);
    setDone(true);
  };

  return (
    <>
      <Nav variant="solid" />

      <main className="bg-background text-foreground">
        <section className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-48 text-center md:px-12">
          <p className="label text-muted-foreground">{t("Accès anticipé")}</p>

          <h1 className="display mx-auto mt-10 max-w-3xl text-[2.5rem] leading-[1.04] md:text-[5rem]">
            {t("Une première série arrive.")}
          </h1>

          <p className="mx-auto mt-14 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t(
              "DIVUS est une maison de collection française. La rareté n'y est jamais fabriquée : elle est héritée. Le nombre de pièces d'une série sera toujours identique au nombre d'exemplaires de l'objet qu'elle célèbre. Rien ne sera réédité.",
            )}
          </p>

          <div className="mt-20 w-full max-w-md">
            {done ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(
                  "Inscription enregistrée. Vous disposerez d'un accès prioritaire à l'ouverture — aucune communication superflue avant cela.",
                )}
              </p>
            ) : (
              <form onSubmit={submit} className="flex flex-col items-center">
                <label htmlFor="waitlist-email" className="sr-only">
                  {t("Adresse e-mail")}
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  maxLength={255}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder={t("Adresse e-mail")}
                  className="w-full border-b border-border bg-transparent pb-3 text-center text-base text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                />
                {error && (
                  <p className="mt-4 text-xs text-muted-foreground">{t(error)}</p>
                )}
                <button type="submit" className="btn-line btn-line-hover mt-12">
                  {t("S'inscrire")}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
