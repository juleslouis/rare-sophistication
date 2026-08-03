import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Nav } from "@/components/divus/Nav";
import { Footer } from "@/components/divus/Footer";
import { useLang } from "@/lib/i18n";
import { LEGAL_DOCS } from "@/lib/legal";
import { LEGAL_CONTENT, LEGAL_UPDATED } from "@/lib/legal-content";

export const Route = createFileRoute("/legal/$handle")({
  loader: ({ params }) => {
    if (!LEGAL_CONTENT[params.handle]) throw notFound();
    return null;
  },

  head: ({ params }) => {
    const doc = LEGAL_DOCS.find((d) => d.handle === params.handle);
    const title = `${doc?.fr ?? "Informations légales"} — DIVUS Paris`;
    const description =
      doc?.description ??
      "Informations légales de la maison DIVUS Paris : conditions, confidentialité, livraison et retours.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: LegalPage,
});

function LegalPage() {
  const { handle } = Route.useParams();
  const { t, lang } = useLang();
  const doc = LEGAL_DOCS.find((d) => d.handle === handle);
  const sections = LEGAL_CONTENT[handle] ?? [];


  return (
    <>
      <Nav variant="solid" />

      <main className="bg-background text-foreground">
        <header className="px-6 pb-16 pt-40 text-center md:px-12 md:pt-52">
          <Link
            to="/legal"
            className="label text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("Informations légales")}
          </Link>
          <p className="label-sm mt-10 tabular-nums text-muted-foreground">
            {doc?.numeral}
          </p>
          <h1 className="display mx-auto mt-6 max-w-[22ch] text-[2.1rem] leading-[1.1] tracking-[0.02em] md:text-[3.2rem]">
            {doc?.fr ? t(doc.fr) : policy.title}
          </h1>
          {doc?.summary ? (
            <p className="mx-auto mt-10 max-w-lg text-xs leading-relaxed text-muted-foreground md:text-sm">
              {t(doc.summary)}
            </p>
          ) : null}
          <span className="rule mx-auto mt-14 max-w-[2rem]" />
        </header>

        <div className="mx-auto grid max-w-6xl gap-16 px-6 pb-28 md:grid-cols-[14rem_minmax(0,62ch)] md:justify-center md:gap-20 md:px-12">
          {/* ————— Sommaire latéral, discret et fixe ————— */}
          <aside className="hidden md:block">
            <div className="sticky top-32">
              <p className="label-sm text-muted-foreground">{t("Sommaire")}</p>
              <ul className="mt-8 space-y-5">
                {LEGAL_DOCS.map((d) => {
                  const active = d.handle === handle;
                  return (
                    <li key={d.handle} className="flex gap-4">
                      <span className="label-sm w-4 shrink-0 tabular-nums text-muted-foreground">
                        {d.numeral}
                      </span>
                      <Link
                        to="/legal/$handle"
                        params={{ handle: d.handle }}
                        aria-current={active ? "page" : undefined}
                        className={`text-xs leading-relaxed transition-colors ${
                          active
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t(d.fr)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          <article
            className="legal-prose"
            // Contenu rédigé par la maison dans Shopify, nettoyé côté serveur.
            dangerouslySetInnerHTML={{ __html: policy.body }}
          />
        </div>

        <nav className="mx-auto mb-40 flex max-w-[62ch] flex-col items-center gap-8 border-t border-border px-6 pt-12 md:px-0">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:hidden">
            {LEGAL_DOCS.filter((d) => d.handle !== handle).map((d) => (
              <Link
                key={d.handle}
                to="/legal/$handle"
                params={{ handle: d.handle }}
                className="label-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t(d.fr)}
              </Link>
            ))}
          </div>
          <Link
            to="/legal"
            className="label-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("Retour au sommaire")}
          </Link>
        </nav>
      </main>

      <Footer />
    </>
  );
}

