import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Nav } from "@/components/divus/Nav";
import { Footer } from "@/components/divus/Footer";
import { useLang } from "@/lib/i18n";
import { getShopPolicies } from "@/lib/shopify.functions";
import { LEGAL_DOCS } from "@/lib/legal";

export const Route = createFileRoute("/legal/$handle")({
  loader: async ({ params }) => {
    const policies = await getShopPolicies();
    const policy = policies.find((p) => p.handle === params.handle);
    if (!policy) throw notFound();
    return { policy };
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
  const { policy } = Route.useLoaderData();
  const { handle } = Route.useParams();
  const { t } = useLang();
  const doc = LEGAL_DOCS.find((d) => d.handle === handle);

  return (
    <>
      <Nav variant="solid" />

      <main className="bg-background text-foreground">
        <header className="px-6 pb-16 pt-40 text-center md:px-12 md:pt-48">
          <p className="label text-muted-foreground">{t("Informations légales")}</p>
          <h1 className="display mx-auto mt-8 max-w-[22ch] text-[2.1rem] leading-[1.1] tracking-[0.02em] md:text-[3rem]">
            {doc?.fr ?? policy.title}
          </h1>
        </header>

        <article
          className="legal-prose mx-auto max-w-[62ch] px-6 pb-24 md:px-0"
          // Contenu rédigé par la maison dans Shopify, nettoyé côté serveur.
          dangerouslySetInnerHTML={{ __html: policy.body }}
        />

        <nav className="mx-auto mb-40 flex max-w-[62ch] flex-wrap items-center justify-center gap-x-10 gap-y-4 border-t border-border px-6 pt-12 md:px-0">
          {LEGAL_DOCS.filter((d) => d.handle !== handle).map((d) => (
            <Link
              key={d.handle}
              to="/legal/$handle"
              params={{ handle: d.handle }}
              className="label text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(d.fr)}
            </Link>
          ))}
        </nav>
      </main>

      <Footer />
    </>
  );
}
