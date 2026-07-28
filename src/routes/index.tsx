import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/divus/Nav";
import { Footer } from "@/components/divus/Footer";
import heroImg from "@/assets/hero.jpg";
import piece01 from "@/assets/piece-01.jpg";
import piece02 from "@/assets/piece-02.jpg";
import piece03 from "@/assets/piece-03.jpg";
import piece04 from "@/assets/piece-04.jpg";

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
          "Éditions muséales confectionnées à la main à Paris. La rareté héritée, l'élégance silencieuse.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const pieces = [
  { ref: "DVS-I · PRIMUS", couleur: "Charbon", image: piece01 },
  { ref: "DVS-I · PRIMUS", couleur: "Travertin", image: piece02 },
  { ref: "DVS-II · MERIDIAN", couleur: "Cyprès", image: piece03 },
  { ref: "DVS-III · SVJ", couleur: "Terre", image: piece04 },
];

function Home() {
  return (
    <>
      <Nav />

      <main>
        {/* ————— HERO ————— */}
        <section className="relative min-h-[100svh] w-full overflow-hidden bg-secondary">
          <img
            src={heroImg}
            alt=""
            width={1920}
            height={1200}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/20" />
          <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end px-6 pb-24 text-center md:pb-32">
            <p className="label-sm text-muted-foreground">Série I · Primus · MMXXV</p>
            <h1 className="display mt-8 text-[3rem] leading-[1] tracking-[-0.015em] md:text-[6rem]">
              La rareté héritée.
            </h1>
            <Link to="/collection" className="btn-line btn-line-hover mt-14">
              Découvrir la collection
            </Link>
          </div>
        </section>

        {/* ————— LES PIÈCES DU MOMENT ————— */}
        <section className="bg-background">
          <div className="mx-auto max-w-[1600px] px-6 pt-32 pb-16 text-center md:px-12 md:pt-48 md:pb-24">
            <p className="label text-muted-foreground">Les pièces du moment</p>
            <h2 className="display mx-auto mt-10 max-w-3xl text-[2.25rem] leading-[1.05] md:text-[3.75rem]">
              Édition Primus.
            </h2>
          </div>

          <div className="mx-auto max-w-[1600px] px-6 pb-32 md:px-12 md:pb-48">
            <div className="grid grid-cols-2 gap-x-6 gap-y-20 md:grid-cols-4 md:gap-x-12 md:gap-y-28">
              {pieces.map((p) => (
                <Link
                  key={p.ref + p.couleur}
                  to="/collection"
                  className="group block"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-blanc">
                    <img
                      src={p.image}
                      alt={`${p.ref} — ${p.couleur}`}
                      loading="lazy"
                      width={1408}
                      height={1760}
                      className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <p className="label-sm text-muted-foreground">{p.ref}</p>
                    <p className="display mt-3 text-lg md:text-xl">{p.couleur}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-24 flex justify-center md:mt-32">
              <Link to="/collection" className="btn-line btn-line-hover">
                Voir toute la collection
              </Link>
            </div>
          </div>
        </section>

        {/* ————— SIGNATURE ————— */}
        <section className="border-t border-border bg-background">
          <div className="mx-auto max-w-4xl px-6 py-40 text-center md:px-12 md:py-56">
            <p className="label text-muted-foreground">Signature</p>
            <p className="display mt-10 text-[1.85rem] leading-[1.25] md:text-[3rem]">
              La rareté n'est jamais créée —{" "}
              <span className="display-italic text-muted-foreground">elle est héritée.</span>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
