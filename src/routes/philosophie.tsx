import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/divus/Nav";
import { Footer } from "@/components/divus/Footer";
import atelier from "@/assets/atelier.jpg";
import piece02 from "@/assets/piece-02.jpg";

export const Route = createFileRoute("/philosophie")({
  head: () => ({
    meta: [
      { title: "Philosophie — DIVUS Paris" },
      {
        name: "description",
        content:
          "La philosophie DIVUS Paris : rareté héritée, confection haute couture parisienne, éditions strictement numérotées, certification NFC chiffrée.",
      },
      { property: "og:title", content: "Philosophie — DIVUS Paris" },
      {
        property: "og:description",
        content:
          "Rareté héritée, éditions numérotées, atelier haute couture parisien.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PhilosophiePage,
});

function PhilosophiePage() {
  return (
    <>
      <Nav variant="solid" />

      <main className="bg-background text-foreground">
        {/* ————— OUVERTURE ————— */}
        <section className="pt-40 pb-24 md:pt-56 md:pb-32">
          <div className="mx-auto max-w-[1600px] px-6 text-center md:px-12">
            <p className="label text-muted-foreground">Philosophie</p>
            <h1 className="display mx-auto mt-10 max-w-4xl text-[2.5rem] leading-[1.05] md:text-[5.5rem]">
              La rareté héritée.
            </h1>
            <p className="mx-auto mt-12 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              DIVUS est une maison de collection française. Chaque édition est confectionnée
              à la main dans un atelier de haute couture parisien, en séries strictement
              numérotées, chacune scellée par une puce NFC chiffrée.
            </p>
          </div>
        </section>

        {/* ————— ATELIER ————— */}
        <section id="atelier" className="border-t border-border">
          <div className="mx-auto grid max-w-[1600px] items-center gap-16 px-6 py-32 md:grid-cols-12 md:gap-24 md:px-12 md:py-48">
            <div className="md:col-span-7">
              <img
                src={atelier}
                alt="Atelier haute couture parisien"
                loading="lazy"
                width={1600}
                height={1600}
                className="w-full"
              />
            </div>
            <div className="md:col-span-5">
              <p className="label text-muted-foreground">L'atelier</p>
              <h2 className="display mt-10 text-4xl leading-[1.05] md:text-5xl">
                Fabricatum in Gallia.
              </h2>
              <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
                <p>
                  Chaque pièce naît d'un atelier de haute couture parisien. Les coutures
                  chevauchées sont exécutées au fil doré. Les finitions demandent quarante
                  heures de main d'œuvre.
                </p>
                <p>
                  Cette lenteur n'est pas un choix : c'est une contrainte que nous refusons
                  de contourner.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ————— RARETÉ ————— */}
        <section className="border-t border-border">
          <div className="mx-auto grid max-w-[1600px] items-center gap-16 px-6 py-32 md:grid-cols-12 md:gap-24 md:px-12 md:py-48">
            <div className="md:col-span-5 md:order-2">
              <img
                src={piece02}
                alt="Pièce Primus — Travertin"
                loading="lazy"
                width={1408}
                height={1760}
                className="w-full bg-blanc"
              />
            </div>
            <div className="md:col-span-6 md:col-start-1 md:row-start-1">
              <p className="label text-muted-foreground">Rareté contractuelle</p>
              <h2 className="display mt-10 text-4xl leading-[1.05] md:text-5xl">
                Le nombre est dicté, jamais choisi.
              </h2>
              <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
                <p>
                  Chaque série DIVUS célèbre un objet existant, documenté publiquement.
                  Le nombre de pièces produites répond exactement au nombre d'exemplaires
                  du sujet hommagé.
                </p>
                <p>
                  Ce principe rend impossible toute réédition. Il transforme chaque pièce
                  en pièce d'archive dès sa livraison.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ————— CERTIFICATION ————— */}
        <section id="certification" className="border-t border-border">
          <div className="mx-auto max-w-3xl px-6 py-32 text-center md:px-12 md:py-48">
            <p className="label text-muted-foreground">Certification</p>
            <h2 className="display mt-10 text-4xl leading-[1.05] md:text-5xl">
              Une identité chiffrée.
            </h2>
            <p className="mt-12 text-base leading-relaxed text-muted-foreground md:text-lg">
              Une puce NFC NTAG424 non clonable, chiffrement AES-128, est intégrée à
              chaque pièce. Elle atteste de l'origine, de la série et du numéro individuel.
              Elle inscrit l'objet dans une histoire vérifiable et transmissible.
            </p>
          </div>
        </section>

        {/* ————— ÉDITIONS ————— */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-48">
            <div className="text-center">
              <p className="label text-muted-foreground">Éditions</p>
              <h2 className="display mt-10 text-4xl leading-[1.05] md:text-5xl">
                Trois séries, une seule maison.
              </h2>
            </div>
            <div className="mt-20 grid gap-16 md:mt-28 md:grid-cols-3 md:gap-12">
              {[
                {
                  n: "I",
                  nom: "Primus",
                  desc: "L'édition fondatrice. Point de départ, sans partenaire, se légitime par elle-même.",
                },
                {
                  n: "II",
                  nom: "Meridian",
                  desc: "Le savoir-faire. Une collaboration avec un horloger indépendant français, à tirage documenté.",
                },
                {
                  n: "III",
                  nom: "SVJ · Ultima",
                  desc: "L'hommage. 963 exemplaires, en écho au flagship célébré. Livraison MMXXVI.",
                },
              ].map((s) => (
                <div key={s.n} className="text-center">
                  <p className="display text-6xl text-muted-foreground md:text-7xl">{s.n}</p>
                  <p className="label mt-6">Série {s.n}</p>
                  <p className="display mt-4 text-2xl md:text-3xl">{s.nom}</p>
                  <p className="mx-auto mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ————— CONTACT ————— */}
        <section id="contact" className="border-t border-border">
          <div className="mx-auto max-w-3xl px-6 py-32 text-center md:px-12 md:py-48">
            <p className="label text-muted-foreground">Contact</p>
            <p className="display mt-10 text-3xl leading-[1.15] md:text-5xl">
              Pour les demandes de cercle privé, de presse ou d'archives.
            </p>
            <a
              href="mailto:maison@divus.paris"
              className="mt-16 inline-block border-b border-foreground pb-1 text-base tracking-wider md:text-lg"
            >
              maison@divus.paris
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
