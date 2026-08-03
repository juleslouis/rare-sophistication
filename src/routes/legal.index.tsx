import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/divus/Nav";
import { Footer } from "@/components/divus/Footer";
import { useLang } from "@/lib/i18n";
import { LEGAL_DOCS } from "@/lib/legal";

export const Route = createFileRoute("/legal/")({
  head: () => {
    const title = "Informations légales — DIVUS Paris";
    const description =
      "Les engagements écrits de la maison DIVUS Paris : conditions générales de vente, confidentialité, livraison, retours et remboursements.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "DIVUS Paris" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: "https://maisondivus.com/legal" }],
    };
  },
  component: LegalIndexPage,
});

function LegalIndexPage() {
  const { t } = useLang();

  return (
    <>
      <Nav variant="solid" />

      <main className="bg-background text-foreground">
        <header className="px-6 pb-20 pt-40 text-center md:px-12 md:pt-52">
          <p className="label text-muted-foreground">{t("Sommaire")}</p>
          <h1 className="display mx-auto mt-8 max-w-[20ch] text-[2.2rem] leading-[1.08] tracking-[0.02em] md:text-[3.4rem]">
            {t("Informations légales")}
          </h1>
          <p className="mx-auto mt-12 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {t(
              "Les engagements écrits de la maison. Quatre documents, tenus à jour et rédigés sans détour.",
            )}
          </p>
        </header>

        <section className="mx-auto max-w-3xl px-6 pb-32 md:px-0">
          <ul className="border-t border-border">
            {LEGAL_DOCS.map((d) => (
              <li key={d.handle} className="border-b border-border">
                <Link
                  to="/legal/$handle"
                  params={{ handle: d.handle }}
                  className="group flex items-baseline gap-6 py-10 md:gap-12"
                >
                  <span className="label-sm w-8 shrink-0 tabular-nums text-muted-foreground transition-colors group-hover:text-foreground">
                    {d.numeral}
                  </span>
                  <span className="flex-1">
                    <span className="block font-[var(--font-display,'Fraunces',serif)] text-lg leading-snug tracking-[0.01em] md:text-2xl">
                      {t(d.fr)}
                    </span>
                    <span className="mt-3 block text-xs leading-relaxed text-muted-foreground md:text-sm">
                      {t(d.summary)}
                    </span>
                  </span>
                  <span className="label-sm shrink-0 text-muted-foreground opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {t("Lire")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-24 flex flex-col items-center">
            <span className="rule max-w-[2rem]" />
            <p className="label mt-8 text-muted-foreground">
              {t("Une question sur ces documents ?")}
            </p>
            <a
              href="mailto:contact@maisondivus.com"
              className="btn-line btn-line-hover mt-8"
            >
              {t("Écrire à la maison")}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
