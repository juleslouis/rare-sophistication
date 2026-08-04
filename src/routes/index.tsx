import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/divus/Nav";
import { Footer } from "@/components/divus/Footer";
import { useLang } from "@/lib/i18n";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DIVUS Paris — Maison de collection" },
      {
        name: "description",
        content:
          "DIVUS Paris. Éditions strictement numérotées, confection haute couture parisienne, certification NFC. La rareté héritée, l'élégance silencieuse.",
      },
      { property: "og:title", content: "DIVUS Paris — Maison de collection" },
      {
        property: "og:description",
        content:
          "DIVUS Paris. Éditions strictement numérotées, confection haute couture parisienne, certification NFC. La rareté héritée, l'élégance silencieuse.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://maisondivus.com/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "DIVUS Paris — Maison de collection" },
      {
        name: "twitter:description",
        content:
          "DIVUS Paris. Éditions strictement numérotées, confection haute couture parisienne, certification NFC. La rareté héritée, l'élégance silencieuse.",
      },
    ],
    links: [{ rel: "canonical", href: "https://maisondivus.com/" }],
  }),
  component: Home,
});

function Home() {
  const { t } = useLang();

  return (
    <>
      <Nav />

      <main>
        {/* ————— HERO ————— */}
        <section className="relative min-h-[100svh] w-full overflow-hidden bg-secondary">
          <img
            src={heroImg}
            alt="Pièce DIVUS Paris présentée dans la lumière d'un atelier de haute couture parisien"
            width={1920}
            height={1200}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/20" />
          <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end px-6 pb-24 text-center md:pb-32">
            <p className="label-sm text-muted-foreground">{t("Paris · MMXXV")}</p>
            <h1 className="display mt-8 text-[3rem] leading-[1] tracking-[-0.015em] md:text-[6rem]">
              {t("La rareté héritée.")}
            </h1>
            <Link to="/collection" className="btn-line btn-line-hover mt-14">
              {t("Demander un accès anticipé")}
            </Link>
          </div>
        </section>

        {/* ————— MAISON ————— */}
        <section className="bg-background">
          <div className="mx-auto max-w-3xl px-6 py-40 text-center md:px-12 md:py-56">
            <p className="label text-muted-foreground">{t("La maison")}</p>
            <p className="display mt-10 text-[1.85rem] leading-[1.25] md:text-[2.75rem]">
              {t(
                "Une maison de collection française. Chaque série sera confectionnée à la main, en nombre dicté, jamais choisi.",
              )}
            </p>
            <Link to="/philosophie" className="btn-line btn-line-hover mt-16">
              {t("La philosophie")}
            </Link>
          </div>
        </section>

        {/* ————— SIGNATURE ————— */}
        <section className="border-t border-border bg-background">
          <div className="mx-auto max-w-4xl px-6 py-40 text-center md:px-12 md:py-56">
            <p className="label text-muted-foreground">{t("Signature")}</p>
            <p className="display mt-10 text-[1.85rem] leading-[1.25] md:text-[3rem]">
              {t("La rareté n'est jamais créée —")}{" "}
              <span className="display-italic text-muted-foreground">{t("elle est héritée.")}</span>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

