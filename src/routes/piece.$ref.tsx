import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/divus/Nav";
import { Footer } from "@/components/divus/Footer";
import { PIECES, findPiece, type Piece } from "@/lib/pieces";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/piece/$ref")({
  loader: ({ params }) => {
    const piece = findPiece(params.ref);
    if (!piece) throw notFound();
    return { piece };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Pièce introuvable — DIVUS Paris" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { piece } = loaderData;
    const title = `${piece.hommage} — ${piece.couleur} · DIVUS Paris`;
    const description = `${piece.serie} · ${piece.ref}. ${piece.description}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: PieceNotFound,
  component: PiecePage,
});

function PieceNotFound() {
  const { t } = useLang();

  return (
    <>
      <Nav variant="solid" />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-40 text-center">
        <p className="label text-muted-foreground">404</p>
        <h1 className="display mt-8 text-5xl md:text-6xl">{t("Pièce introuvable")}</h1>
        <p className="mt-6 text-sm text-muted-foreground">
          {t("Cette référence n'appartient à aucune édition de la Maison.")}
        </p>
        <Link to="/collection" className="btn-line btn-line-hover mt-12">
          {t("Retour à la collection")}
        </Link>
      </main>
      <Footer />
    </>
  );
}

function PiecePage() {
  const { t, lang } = useLang();
  const { piece } = Route.useLoaderData();
  const [active, setActive] = useState(0);
  const soldOut = piece.statut === "Sold out";
  const surListe = piece.statut === "Sur liste";
  const gallery = piece.gallery.length ? piece.gallery : [piece.image];

  const otherPieces: Piece[] = PIECES.filter(
    (p) => p.ref !== piece.ref && p.serie === piece.serie,
  ).slice(0, 4);

  return (
    <>
      <Nav variant="solid" />

      <main className="bg-background text-foreground">
        {/* Fil d'Ariane */}
        <div className="mx-auto max-w-[1600px] px-6 pt-32 md:px-10 md:pt-40">
          <nav className="label-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">{t("Accueil")}</Link>
            <span className="mx-3">·</span>
            <Link to="/collection" className="hover:text-foreground">{t("Collection")}</Link>
            <span className="mx-3">·</span>
            <span className="text-foreground">{piece.serie}</span>
          </nav>
        </div>

        {/* ——— ABOVE THE FOLD ——— */}
        <section className="mx-auto grid max-w-[1600px] gap-10 px-6 pt-10 pb-20 md:grid-cols-12 md:gap-12 md:px-10 md:pt-14 md:pb-32">
          {/* Galerie principale */}
          <div className="md:col-span-7 lg:col-span-8">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
              <span
                aria-hidden
                className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 rotate-90 origin-center label-sm text-muted-foreground/70"
                style={{ letterSpacing: "0.4em" }}
              >
                {piece.year}
              </span>
              <img
                src={gallery[active]}
                alt={`${t(piece.hommage)} — ${t(piece.couleur)}`}
                className="h-full w-full object-cover"
                width={1600}
                height={2000}
              />
            </div>

            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 md:gap-4">
                {gallery.map((src: string, i: number) => (
                  <button
                    key={`${src}-${i}`}
                    onClick={() => setActive(i)}
                    aria-label={`${t("Vue")} ${i + 1}`}
                    className={`relative aspect-[4/5] overflow-hidden bg-secondary transition-opacity duration-500 ${
                      active === i ? "opacity-100" : "opacity-60 hover:opacity-90"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                    {active === i && (
                      <span className="absolute inset-x-0 bottom-0 h-px bg-foreground" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Colonne infos essentielles */}
          <aside className="md:col-span-5 lg:col-span-4 md:sticky md:top-32 md:self-start">
            <p className="label-sm text-muted-foreground">{piece.serie} · {piece.ref}</p>
            <h1 className="display mt-6 text-[2.25rem] leading-[1.05] md:text-[3rem]">
              {t(piece.hommage)}
            </h1>
            <p className="mt-3 text-base text-muted-foreground">{t(piece.couleur)}</p>

            <div className="mt-10 h-px w-full bg-border" />

            <dl className="mt-8 space-y-4 text-sm">
              <div className="flex items-baseline justify-between gap-6">
                <dt className="label text-muted-foreground">{t("Édition")}</dt>
                <dd className="text-right">
                  {piece.edition > 0
                    ? `${piece.edition} ${t("exemplaires")}`
                    : t("À révéler")}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-6">
                <dt className="label text-muted-foreground">{t("Matière")}</dt>
                <dd className="text-right">{t(piece.matiere)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6">
                <dt className="label text-muted-foreground">{t("Statut")}</dt>
                <dd className="text-right">
                  {piece.statut === "Sold out" && <span>{t("Sold out")}</span>}
                  {piece.statut === "En cours" && <span>{t("En cours")}</span>}
                  {piece.statut === "Sur liste" && <span className="text-accent">{t("Sur liste")}</span>}
                </dd>
              </div>
              {piece.prix > 0 && (
                <div className="flex items-baseline justify-between gap-6">
                  <dt className="label text-muted-foreground">{t("Prix")}</dt>
                  <dd className="text-right text-base">
                    {piece.prix.toLocaleString(lang === "en" ? "en-GB" : "fr-FR")} €
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-12 space-y-3">
              {soldOut ? (
                <button
                  disabled
                  className="btn-line w-full cursor-not-allowed opacity-60"
                >
                  {t("Édition épuisée")}
                </button>
              ) : surListe ? (
                <Link to="/philosophie" hash="contact" className="btn-line btn-line-hover w-full">
                  {t("Rejoindre la liste")}
                </Link>
              ) : (
                <Link to="/philosophie" hash="contact" className="btn-line btn-line-hover w-full">
                  {t("Demander cette pièce")}
                </Link>
              )}
              <Link
                to="/philosophie"
                hash="contact"
                className="block w-full text-center label text-muted-foreground pt-4 hover:text-foreground transition-colors"
              >
                {t("Prendre rendez-vous à Paris")}
              </Link>
            </div>

            <p className="mt-12 text-[13px] leading-relaxed text-muted-foreground">
              {t(piece.description)}
            </p>
          </aside>
        </section>

        {/* ——— MANIFESTE PIÈCE ——— */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
            <p className="label text-muted-foreground">{t("Hommage")} · {t(piece.hommage)}</p>
            <p className="display mt-8 text-3xl leading-[1.25] md:text-4xl">
              {t(piece.description)}
            </p>
          </div>
        </section>

        {/* ——— DÉTAILS TECHNIQUES ——— */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
            <div className="grid gap-12 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="label text-muted-foreground">{t("Fiche technique")}</p>
                <h2 className="display mt-6 text-3xl md:text-4xl">
                  {t("Précision de la Maison")}
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  {t(
                    "Chaque pièce est confectionnée à la main dans notre atelier parisien. Le grammage, la doublure, le fil, la coupe — chaque paramètre est consigné et gravé sur la puce de certification.",
                  )}
                </p>
              </div>

              <dl className="md:col-span-8 md:col-start-5 divide-y divide-border border-y border-border">
                {piece.details.map((d: { label: string; value: string }) => (
                  <div
                    key={d.label}
                    className="grid grid-cols-3 gap-6 py-5 md:grid-cols-4"
                  >
                    <dt className="label text-muted-foreground col-span-1">{t(d.label)}</dt>
                    <dd className="col-span-2 text-sm md:col-span-3">{t(d.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ——— CERTIFICATION ——— */}
        <section className="border-t border-border bg-secondary">
          <div className="mx-auto grid max-w-[1600px] gap-10 px-6 py-24 md:grid-cols-2 md:gap-16 md:px-10 md:py-32">
            <div>
              <p className="label text-muted-foreground">{t("Certification")}</p>
              <h2 className="display mt-6 text-3xl md:text-4xl">
                {t("Une pièce, une identité, une trace.")}
              </h2>
            </div>
            <div className="text-sm leading-relaxed text-muted-foreground">
              <p>
                {t(
                  "Chaque exemplaire porte une puce NFC chiffrée, cousue dans la doublure. Elle atteste de la référence, du numéro d'édition, de la date de confection et du nom de son premier propriétaire.",
                )}
              </p>
              <p className="mt-4">
                {t(
                  "La pièce peut être transmise. La certification, elle, ne s'efface pas.",
                )}
              </p>
            </div>
          </div>
        </section>

        {/* ——— AUTRES PIÈCES DE LA SÉRIE ——— */}
        {otherPieces.length > 0 && (
          <section className="border-t border-border">
            <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
              <div className="mb-14 flex items-end justify-between">
                <div>
                  <p className="label text-muted-foreground">{t("Dans la même série")}</p>
                  <h2 className="display mt-4 text-2xl md:text-3xl">{piece.serie}</h2>
                </div>
                <Link
                  to="/collection"
                  className="label text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("Voir la collection")}
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-16 md:grid-cols-4 md:gap-x-10">
                {otherPieces.map((p) => (
                  <Link
                    key={p.ref}
                    to="/piece/$ref"
                    params={{ ref: p.ref }}
                    className="group block"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                      <img
                        src={p.image}
                        alt={`${t(p.hommage)} — ${t(p.couleur)}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <p className="label-sm mt-5 text-center text-muted-foreground">{p.ref}</p>
                    <p className="display mt-2 text-center text-lg">{t(p.hommage)}</p>
                    <p className="mt-1 text-center text-sm text-muted-foreground">
                      {t(p.couleur)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
