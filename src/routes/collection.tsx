import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Nav } from "@/components/divus/Nav";
import { Footer } from "@/components/divus/Footer";
import { PIECES, type Piece } from "@/lib/pieces";
import { useLang } from "@/lib/i18n";
import { getShopifyProducts, type ShopifyProductNode } from "@/lib/shopify.functions";
import { queryOptions } from "@tanstack/react-query";

const productsQueryOptions = queryOptions({
  queryKey: ["shopify-products"],
  queryFn: () => getShopifyProducts(),
});

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "Collection — DIVUS Paris" },
      {
        name: "description",
        content:
          "Rechercher une pièce DIVUS par édition, matière ou numéro de série. Éditions strictement numérotées, confection haute couture parisienne.",
      },
      { property: "og:title", content: "Collection — DIVUS Paris" },
      {
        property: "og:description",
        content:
          "Éditions strictement numérotées. Confection haute couture à Paris. Certification NFC.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions),
  component: CollectionPage,
});

type EnrichedPiece = Piece & {
  shopify?: ShopifyProductNode;
  variant?: ShopifyProductNode["variants"]["edges"][number]["node"];
  availableForSale?: boolean;
};

const FILTRES = [
  { key: "toutes", label: "Toutes" },
  { key: "I", label: "Drop I" },
  { key: "II", label: "Drop II" },
  { key: "III", label: "Drop III" },
  { key: "actuel", label: "Éditions en cours" },
  { key: "archive", label: "Archives" },
] as const;

type FiltreKey = (typeof FILTRES)[number]["key"];

function CollectionPage() {
  const { t, lang } = useLang();
  const [query, setQuery] = useState("");
  const [filtre, setFiltre] = useState<FiltreKey>("toutes");
  const shopifyEdges = Route.useLoaderData();

  const shopifyByHandle = useMemo(() => {
    const map = new Map<string, ShopifyProductNode>();
    for (const edge of shopifyEdges) {
      if (edge?.node?.handle) map.set(edge.node.handle, edge.node);
    }
    return map;
  }, [shopifyEdges]);

  const enrichedPieces: EnrichedPiece[] = useMemo(() => {
    return PIECES.map((piece) => {
      const shopify = piece.shopifyHandle ? shopifyByHandle.get(piece.shopifyHandle) : undefined;
      const variant = shopify?.variants.edges[0]?.node;
      return {
        ...piece,
        shopify,
        variant,
        availableForSale: variant?.availableForSale ?? piece.statut === "En cours",
      };
    });
  }, [shopifyByHandle]);

  const filtered = useMemo(() => {
    return enrichedPieces.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        p.ref.toLowerCase().includes(q) ||
        p.serie.toLowerCase().includes(q) ||
        p.hommage.toLowerCase().includes(q) ||
        p.couleur.toLowerCase().includes(q);
      const matchF =
        filtre === "toutes"
          ? true
          : filtre === "actuel"
            ? p.statut === "En cours" || p.statut === "Sur liste"
            : filtre === "archive"
              ? p.statut === "Sold out"
              : p.drop === filtre;
      return matchQ && matchF;
    });
  }, [enrichedPieces, query, filtre]);

  return (
    <>
      <Nav variant="solid" />

      <main className="bg-background text-foreground">
        {/* ——— HEADER ——— */}
        <section className="pt-40 pb-16 md:pt-52 md:pb-20">
          <div className="mx-auto max-w-[1600px] px-6 text-center md:px-10">
            <p className="label text-muted-foreground">{t("Collection")}</p>
            <h1 className="display mt-8 text-[2.5rem] leading-[1.02] tracking-[0.02em] md:text-[4.5rem] lg:text-[5.5rem]">
              {t("Trouver une pièce")}
            </h1>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-14 flex max-w-2xl items-center border-b border-border pb-3"
            >
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("Rechercher par édition, matière ou référence")}
                className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none md:text-lg"
              />
              <button
                type="submit"
                aria-label={t("Rechercher")}
                className="ml-4 text-muted-foreground transition-opacity hover:opacity-60"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
              </button>
            </form>

            {/* Filtres */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {FILTRES.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFiltre(f.key)}
                  className={`label transition-opacity duration-500 ${
                    filtre === f.key
                      ? "text-foreground border-b border-foreground pb-1"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(f.label)}
                </button>
              ))}
            </div>

            <p className="label-sm mt-14 text-muted-foreground">
              <span className="text-foreground text-base font-normal tracking-normal">
                {filtered.length}
              </span>{" "}
              {filtered.length > 1 ? t("pièces disponibles.") : t("pièce disponible.")}
            </p>
          </div>
        </section>

        {/* ——— GRILLE ——— */}
        <section className="mx-auto max-w-[1600px] px-6 pb-32 md:px-10 md:pb-48">
          {filtered.length === 0 ? (
            <div className="border-y border-border py-24 text-center">
              <p className="display text-3xl">{t("Aucune pièce ne correspond.")}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                {t("Essayez « Drop III » ou « Cyprès ».")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-16 md:grid-cols-3 md:gap-x-10 md:gap-y-24 lg:grid-cols-4">
              {filtered.map((p) => (
                <PieceCard key={p.ref} piece={p} t={t} lang={lang} />
              ))}
            </div>
          )}
        </section>

        {/* ——— NOTE DE BAS DE COLLECTION ——— */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32 text-center">
            <p className="label text-muted-foreground">{t("Note de la maison")}</p>
            <p className="display mx-auto mt-8 max-w-3xl text-3xl leading-[1.2] md:text-5xl">
              {t("Chaque pièce est confectionnée à la main en atelier de haute couture parisien.")}
              <span className="italic text-muted-foreground">
                {" "}
                {t("La rareté n'est jamais créée — elle est héritée.")}
              </span>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function PieceCard({
  piece,
  t,
  lang,
}: {
  piece: EnrichedPiece;
  t: (fr: string) => string;
  lang: string;
}) {
  const [hover, setHover] = useState(false);
  const soldOut = piece.statut === "Sold out" || !piece.availableForSale;
  const surListe = piece.statut === "Sur liste";
  const price = piece.variant?.price
    ? parseFloat(piece.variant.price.amount)
    : piece.prix;

  return (
    <Link
      to="/piece/$ref"
      params={{ ref: piece.ref }}
      className="group relative block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-blanc">
        <span
          aria-hidden
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rotate-90 origin-center label-sm text-muted-foreground/70"
          style={{ letterSpacing: "0.4em" }}
        >
          {piece.year}
        </span>

        <img
          src={piece.image}
          alt={`${t(piece.hommage)} — ${t(piece.couleur)}`}
          loading="lazy"
          width={1200}
          height={1500}
          className={`h-full w-full object-cover transition-all duration-[1400ms] ease-out ${
            hover ? "scale-[1.04]" : "scale-100"
          } ${soldOut ? "opacity-70" : "opacity-100"}`}
        />

        {soldOut && (
          <span className="absolute left-3 top-3 label-sm text-muted-foreground">
            {t("Sold out")}
          </span>
        )}
        {surListe && (
          <span className="absolute left-3 top-3 label-sm text-accent">
            {t("Sur liste")}
          </span>
        )}
      </div>

      <div className="mt-5 text-center">
        <p className="label-sm text-muted-foreground">{piece.ref}</p>
        <p className="display mt-2 text-lg leading-tight md:text-xl">{t(piece.hommage)}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t(piece.couleur)}</p>
        {price > 0 && (
          <p className="label-sm mt-3 text-muted-foreground">
            {price.toLocaleString(lang === "en" ? "en-GB" : "fr-FR")} {"€"}
          </p>
        )}
      </div>
    </Link>
  );
}
