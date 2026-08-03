import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { joinWaitlist } from "@/lib/waitlist.functions";
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
      {
        property: "og:url",
        content: "https://maisondivus.com/collection",
      },
      { property: "og:site_name", content: "DIVUS Paris" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Accès anticipé — DIVUS Paris" },
      {
        name: "twitter:description",
        content:
          "La rareté héritée, jamais fabriquée. Accès prioritaire à l'ouverture de la première série.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://maisondivus.com/collection" },
    ],
  }),

  component: WaitlistPage,
});

const emailSchema = z
  .string()
  .trim()
  .nonempty({ message: "Renseignez une adresse e-mail." })
  .max(255, { message: "Adresse trop longue." })
  .email({ message: "Adresse e-mail invalide." });

function WaitlistPage() {
  const { t, lang } = useLang();
  const submitSignup = useServerFn(joinWaitlist);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    waitlistAnalytics.view(lang);
  }, [lang]);

  const validate = (value: string) => {
    const parsed = emailSchema.safeParse(value);
    return parsed.success
      ? null
      : (parsed.error.issues[0]?.message ?? "Adresse e-mail invalide.");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    waitlistAnalytics.submit(lang);
    const message = validate(email);
    if (message) {
      setError(message);
      waitlistAnalytics.validationError(lang, message);
      return;
    }
    setError(null);
    setPending(true);
    try {
      const result = await submitSignup({
        data: { email: email.trim(), locale: lang },
      });
      if (!result.ok) {
        setError("Inscription momentanément indisponible. Réessayez.");
        waitlistAnalytics.error(lang);
        return;
      }
      setDone(true);
      waitlistAnalytics.signup(lang);
    } catch {
      setError("Inscription momentanément indisponible. Réessayez.");
      waitlistAnalytics.error(lang);
    } finally {
      setPending(false);
    }
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

          <div className="mt-20 w-full max-w-md" aria-live="polite">
            {done ? (
              <div className="fade-up flex flex-col items-center">
                <span className="rule max-w-[3rem]" />
                <p className="label mt-8 text-muted-foreground">
                  {t("Inscription confirmée")}
                </p>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  {t(
                    "Inscription enregistrée. Vous disposerez d'un accès prioritaire à l'ouverture — aucune communication superflue avant cela.",
                  )}
                </p>
              </div>
            ) : (
              <form
                onSubmit={submit}
                noValidate
                className="flex flex-col items-center"
              >
                <label htmlFor="waitlist-email" className="sr-only">
                  {t("Adresse e-mail")}
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={255}
                  value={email}
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? "waitlist-error" : undefined}
                  onBlur={() => {
                    setTouched(true);
                    setError(validate(email));
                  }}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched) setError(validate(e.target.value));
                  }}
                  placeholder={t("Adresse e-mail")}
                  className={`w-full border-b bg-transparent pb-3 text-center text-base text-foreground placeholder:text-muted-foreground focus:outline-none ${
                    error
                      ? "border-foreground/60"
                      : "border-border focus:border-foreground"
                  }`}
                />
                <p
                  id="waitlist-error"
                  className={`mt-4 text-xs transition-opacity duration-500 ${
                    error ? "opacity-100" : "opacity-0"
                  } text-muted-foreground`}
                >
                  {error ? t(error) : "\u00A0"}
                </p>
                <button
                  type="submit"
                  disabled={pending}
                  className="btn-line btn-line-hover mt-10 disabled:opacity-40"
                >
                  {t(pending ? "Envoi…" : "S'inscrire")}
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
