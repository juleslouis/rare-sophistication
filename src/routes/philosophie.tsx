import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/divus/Nav";
import { Footer } from "@/components/divus/Footer";
import { NfcScan } from "@/components/divus/NfcScan";
import atelier from "@/assets/atelier.jpg";
import { useLang } from "@/lib/i18n";

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
  const { t } = useLang();

  return (
    <>
      <Nav variant="solid" />

      <main className="bg-background text-foreground">
        {/* ————— OUVERTURE ————— */}
        <section className="pt-40 pb-24 md:pt-56 md:pb-32">
          <div className="mx-auto max-w-[1600px] px-6 text-center md:px-12">
            <p className="label text-muted-foreground">{t("Philosophie")}</p>
            <h1 className="display mx-auto mt-10 max-w-4xl text-[2.5rem] leading-[1.05] md:text-[5.5rem]">
              {t("La rareté héritée.")}
            </h1>
            <p className="mx-auto mt-12 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t(
                "DIVUS est une maison de collection française. Chaque édition est confectionnée à la main dans un atelier de haute couture parisien, en séries strictement numérotées, chacune scellée par une puce NFC chiffrée.",
              )}
            </p>
          </div>
        </section>

        {/* ————— ATELIER ————— */}
        <section id="atelier" className="border-t border-border">
          <div className="mx-auto grid max-w-[1600px] items-center gap-16 px-6 py-32 md:grid-cols-12 md:gap-24 md:px-12 md:py-48">
            <div className="md:col-span-7">
              <img
                src={atelier}
                alt={t("Atelier haute couture parisien")}
                loading="lazy"
                width={1600}
                height={1600}
                className="w-full"
              />
            </div>
            <div className="md:col-span-5">
              <p className="label text-muted-foreground">{t("L'atelier")}</p>
              <h2 className="display mt-10 text-4xl leading-[1.05] md:text-5xl">
                {t("Fabricatum in Gallia.")}
              </h2>
              <div className="mt-10 space-y-6 text-base leading-relaxed text-muted-foreground">
                <p>
                  {t(
                    "Chaque pièce naît d'un atelier de haute couture parisien. Les coutures chevauchées sont exécutées au fil doré. Les finitions demandent quarante heures de main d'œuvre.",
                  )}
                </p>
                <p>
                  {t(
                    "Cette lenteur n'est pas un choix : c'est une contrainte que nous refusons de contourner.",
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ————— RARETÉ ————— */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-6 py-32 text-center md:px-12 md:py-48">
            <p className="label text-muted-foreground">{t("Rareté contractuelle")}</p>
            <h2 className="display mt-10 text-4xl leading-[1.05] md:text-5xl">
              {t("Le nombre est dicté, jamais choisi.")}
            </h2>
            <div className="mx-auto mt-12 max-w-xl space-y-6 text-base leading-relaxed text-muted-foreground">
              <p>
                {t(
                  "Chaque série DIVUS célèbre un objet existant, documenté publiquement. Le nombre de pièces produites répond exactement au nombre d'exemplaires du sujet hommagé.",
                )}
              </p>
              <p>
                {t(
                  "Ce principe rend impossible toute réédition. Il transforme chaque pièce en pièce d'archive dès sa livraison.",
                )}
              </p>
            </div>
          </div>
        </section>


        {/* ————— CERTIFICATION ————— */}
        <section id="certification" className="border-t border-border">
          <div className="mx-auto max-w-[1600px] px-6 py-32 md:px-12 md:py-48">
            <div className="mx-auto max-w-3xl text-center">
              <p className="label text-muted-foreground">{t("Certification")}</p>
              <h2 className="display mt-10 text-4xl leading-[1.05] md:text-5xl">
                {t("Une identité chiffrée.")}
              </h2>
              <p className="mt-12 text-base leading-relaxed text-muted-foreground md:text-lg">
                {t(
                  "Une puce NFC NTAG424 DNA non clonable, chiffrement AES-128, est cousue dans la doublure de chaque pièce. Elle atteste de l'origine, de la série et du numéro individuel, et inscrit l'objet dans une archive vérifiable et transmissible.",
                )}
              </p>
            </div>

            <NfcScan />

            <div className="mx-auto mt-24 grid max-w-4xl gap-12 md:mt-32 md:grid-cols-3 md:gap-16">
              {[
                {
                  n: "01",
                  t: "Approchez",
                  d: "Placez votre téléphone à moins de deux centimètres de la doublure. La puce s'active sans contact, sans application.",
                },
                {
                  n: "02",
                  t: "Lecture chiffrée",
                  d: "Chaque lecture génère une signature unique (AES-128 · SUN). Aucune donnée n'est copiable, aucune session n'est rejouable.",
                },
                {
                  n: "03",
                  t: "Archive Maison",
                  d: "Le certificat s'ouvre sur nos serveurs, horodaté. La provenance de la pièce est inscrite dans notre registre privé.",
                },
              ].map((s) => (
                <div key={s.n}>
                  <p className="label text-muted-foreground">{s.n}</p>
                  <p className="display mt-6 text-2xl md:text-3xl">{t(s.t)}</p>
                  <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                    {t(s.d)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>




        {/* ————— CONTACT ————— */}
        <section id="contact" className="border-t border-border">
          <div className="mx-auto max-w-3xl px-6 py-32 text-center md:px-12 md:py-48">
            <p className="label text-muted-foreground">{t("Contact")}</p>
            <p className="display mt-10 text-3xl leading-[1.15] md:text-5xl">
              {t("Pour les demandes de cercle privé, de presse ou d'archives.")}
            </p>
            <a
              href="mailto:contact@maisondivus.com"
              className="mt-16 inline-block border-b border-foreground pb-1 text-base tracking-wider md:text-lg"
            >
              contact@maisondivus.com
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
