import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/divus/Nav";
import { Footer } from "@/components/divus/Footer";
import { useLang } from "@/lib/i18n";

const DESCRIPTION =
  "L'histoire de DIVUS Paris : l'origine du nom, deux fondateurs, la rencontre avec l'atelier de haute couture parisien et ce que la maison refuse.";

export const Route = createFileRoute("/histoire")({
  head: () => ({
    meta: [
      { title: "Histoire — DIVUS Paris" },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Histoire — DIVUS Paris" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://maisondivus.com/histoire" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Histoire — DIVUS Paris" },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "https://maisondivus.com/histoire" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "@id": "https://maisondivus.com/histoire#page",
          url: "https://maisondivus.com/histoire",
          name: "Histoire — DIVUS Paris",
          inLanguage: "fr-FR",
          about: { "@id": "https://maisondivus.com/#organization" },
          description: DESCRIPTION,
        }),
      },
    ],
  }),
  component: HistoirePage,
});

const SECTIONS = [
  {
    title: "Deux fondateurs, une conviction.",
    text: "DIVUS est né d'un désaccord avec une idée reçue : que la rareté, dans la mode, est presque toujours fabriquée. Un chiffre choisi pour vendre plus vite, une édition \u00ab limitée \u00bb qui ne l'est jamais vraiment. Nous avons voulu l'inverse — une maison où le nombre de pièces ne serait jamais une décision commerciale, mais un fait hérité d'autre chose, plus grand que nous.",
  },
  {
    title: "La rencontre avec l'atelier.",
    text: "Une maison de collection ne se construit pas seule. Il fallait des mains capables de tenir la promesse — un atelier de haute couture parisien, habitué à l'exigence des plus grandes maisons, prêt à consacrer le temps qu'il faut plutôt que celui qu'on voudrait. Cette rencontre a rendu possible ce que l'idée seule ne pouvait pas.",
  },
  {
    title: "Ce que la maison refuse.",
    text: "Jamais de réédition. Jamais de solde. Jamais un chiffre annoncé puis dépassé \u00ab pour répondre à la demande \u00bb. Une maison qui promet la rareté et la trahit à la première occasion n'a rien promis du tout. DIVUS préfère vendre lentement et tenir parole, plutôt que vite et se dédire.",
  },
];

function HistoirePage() {
  const { t } = useLang();

  return (
    <>
      <Nav variant="solid" />

      <main className="bg-background text-foreground">
        {/* ————— OUVERTURE ————— */}
        <section className="pt-40 pb-24 md:pt-56 md:pb-32">
          <div className="mx-auto max-w-[1600px] px-6 text-center md:px-12">
            <p className="label text-muted-foreground">{t("Histoire")}</p>
            <h1 className="display mx-auto mt-10 max-w-4xl text-[2.5rem] leading-[1.05] md:text-[5.5rem]">
              {t("Le nom vient d'avant nous.")}
            </h1>
            <p className="mx-auto mt-12 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t(
                "En latin classique, divus désigne celui qui s'élève au-delà de l'ordinaire — celui dont la mémoire survit au temps après avoir marqué son époque de façon irréversible. Ce n'était pas un titre qu'on s'accordait. C'était un état que d'autres reconnaissaient, après coup, jamais avant.",
              )}
            </p>
          </div>
        </section>

        {/* ————— RÉCIT ————— */}
        {SECTIONS.map((s) => (
          <section key={s.title} className="border-t border-border">
            <div className="mx-auto max-w-3xl px-6 py-28 text-center md:px-12 md:py-40">
              <h2 className="display text-3xl leading-[1.1] md:text-5xl">
                {t(s.title)}
              </h2>
              <p className="mx-auto mt-10 max-w-xl text-base leading-relaxed text-muted-foreground">
                {t(s.text)}
              </p>
            </div>
          </section>
        ))}

        {/* ————— FERMETURE ————— */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-6 py-32 text-center md:px-12 md:py-48">
            <p className="display-italic text-2xl leading-[1.3] text-muted-foreground md:text-4xl">
              {t("Le temps est le premier artisan du luxe.")}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
