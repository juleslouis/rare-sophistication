import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/divus/Nav";
import { Footer } from "@/components/divus/Footer";
import heroImg from "@/assets/hero.jpg";
import productImg from "@/assets/product.jpg";
import certificateImg from "@/assets/certificate.jpg";
import lookbookImg from "@/assets/lookbook.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DIVUS — Maison de collection · Paris · Amsterdam" },
      {
        name: "description",
        content:
          "DIVUS est une maison de collection française. Éditions numérotées, confection haute couture à Paris, certification NFC. Fabricatum in Gallia.",
      },
      { property: "og:title", content: "DIVUS — Maison de collection" },
      {
        property: "og:description",
        content:
          "Éditions muséales confectionnées à la main à Paris. Rareté héritée, certification NFC, numéro de série individuel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const piliers = [
  {
    n: "I",
    t: "Rareté contractuelle",
    d: "Le nombre d'exemplaires est dicté par le partenaire célébré, jamais par la maison.",
  },
  {
    n: "II",
    t: "Manufacture française",
    d: "Confection à la main en atelier de haute couture parisien, coutures chevauchées à fil doré.",
  },
  {
    n: "III",
    t: "Certification physique",
    d: "Puce NFC NTAG424 non clonable, chiffrement AES-128, intégrée à chaque pièce.",
  },
  {
    n: "IV",
    t: "Narration chiffrée",
    d: "Un numéro de série inscrit la pièce dans une histoire vérifiable et transmissible.",
  },
];

const palette = [
  { n: "Travertin", ref: "N°01", hex: "var(--travertin)", light: true },
  { n: "Pierre", ref: "N°02", hex: "var(--pierre)", light: true },
  { n: "Terre", ref: "N°03", hex: "var(--terre)", light: false },
  { n: "Cyprès", ref: "N°04", hex: "var(--cypres)", light: false },
  { n: "Charbon", ref: "N°05", hex: "var(--charbon)", light: false },
];

const series = [
  { n: "Drop I", t: "Édition fondatrice", p: "100", pr: "1 300 €", s: "Sold out" },
  { n: "Drop II", t: "Horlogerie", p: "250", pr: "1 400 €", s: "Sold out" },
  { n: "Drop III", t: "Lamborghini SVJ", p: "963", pr: "1 490 €", s: "En cours" },
];

function Home() {
  return (
    <>
      <Nav />

      <main className="bg-background text-foreground">
        {/* ——— HERO ——— */}
        <section className="relative h-[100svh] w-full overflow-hidden">
          <img
            src={heroImg}
            alt="DIVUS — Silhouette dans un atelier parisien"
            width={1600}
            height={1920}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charbon/20 via-charbon/10 to-charbon/60" />

          <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-between px-6 pb-14 pt-28 md:px-10 md:pb-20 md:pt-32">
            <div className="flex items-start justify-between">
              <p className="label-sm text-travertin/80">MMXXV · N°III</p>
              <p className="label-sm hidden text-travertin/80 md:block">
                Drop III — Lamborghini SVJ · 963 pièces
              </p>
            </div>

            <div className="fade-up max-w-4xl">
              <p className="label mb-8 text-travertin/70">Chapitre III · En cours</p>
              <h1 className="display text-[4rem] leading-[0.9] text-travertin sm:text-[6rem] md:text-[9rem] lg:text-[11rem]">
                L'objet<br />
                <span className="italic font-light">devient archive.</span>
              </h1>
              <p className="mt-10 max-w-md text-sm leading-relaxed text-travertin/80 md:text-base">
                DIVUS ne fabrique pas des vêtements — elle documente les objets qui ont marqué leur
                époque. Une édition, un numéro, une trace.
              </p>
              <div className="mt-12 flex items-center gap-8">
                <a
                  href="#drop"
                  className="label border-b border-travertin/70 pb-1 text-travertin transition-[border-color,opacity] duration-500 hover:border-travertin hover:opacity-80"
                >
                  Découvrir le Drop III
                </a>
                <a
                  href="#manifeste"
                  className="label text-travertin/70 transition-opacity duration-500 hover:opacity-100 hover:text-travertin"
                >
                  Le manifeste
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ——— DEVISE MARQUEE ——— */}
        <section className="border-y border-border overflow-hidden py-6">
          <div className="flex whitespace-nowrap marquee">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-16 pr-16">
                <span className="display text-3xl italic">Fabricatum in Gallia</span>
                <span className="label text-muted-foreground">MMXXV</span>
                <span className="display text-3xl italic">Divus — celui qui traverse le temps</span>
                <span className="label text-muted-foreground">Paris · Amsterdam</span>
              </div>
            ))}
          </div>
        </section>

        {/* ——— MANIFESTE ——— */}
        <section id="manifeste" className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-40">
          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="label text-muted-foreground">01 · Manifeste</p>
              <p className="display mt-8 text-5xl leading-[1] md:text-6xl">
                Maison de collection,<br />
                <span className="italic">non de mode.</span>
              </p>
            </div>
            <div className="md:col-span-7 md:col-start-6 space-y-8 text-base leading-[1.75] md:text-lg">
              <p>
                DIVUS ne suit pas le calendrier des saisons. Elle n'obéit à aucune obsolescence.
                Chaque création est pensée comme une édition muséale, traitée avec le même respect
                qu'une montre de manufacture, une automobile iconique ou une œuvre d'art.
              </p>
              <p className="text-muted-foreground">
                En latin classique, <em className="display italic">Divus</em> désigne celui qui
                s'élève au-delà de l'ordinaire — dont la mémoire survit au temps après avoir
                marqué l'histoire de façon irréversible. Ce n'était pas un titre accordé, mais un
                état reconnu.
              </p>
              <p className="text-muted-foreground">
                La rareté n'est jamais créée artificiellement : elle est héritée de l'objet
                célébré. Le vêtement n'est plus un produit — il devient une archive, une pièce de
                collection, une trace.
              </p>
            </div>
          </div>
        </section>

        {/* ——— QUATRE PILIERS ——— */}
        <section className="border-t border-border bg-ivory">
          <div className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-40">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <p className="display text-5xl leading-[1] md:text-6xl">
                Les quatre piliers.
              </p>
              <p className="label text-muted-foreground">02 · Doctrine</p>
            </div>

            <div className="mt-20 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
              {piliers.map((p) => (
                <article
                  key={p.n}
                  className="group flex flex-col justify-between bg-ivory p-8 transition-colors duration-700 hover:bg-background md:p-10 min-h-[280px]"
                >
                  <p className="display text-4xl text-muted-foreground group-hover:text-accent transition-colors duration-700">
                    {p.n}
                  </p>
                  <div className="mt-16">
                    <h3 className="display text-2xl leading-tight md:text-3xl">{p.t}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ——— DROP III ——— */}
        <section id="drop" className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-40">
          <div className="grid gap-16 md:grid-cols-12 md:gap-x-10">
            <div className="md:col-span-6">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={productImg}
                  alt="Pièce maîtresse DIVUS — coton Supima et cachemire grade A"
                  loading="lazy"
                  width={1408}
                  height={1760}
                  className="h-full w-full object-cover transition-transform duration-[2000ms] ease-out hover:scale-[1.03]"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="label-sm text-muted-foreground">Réf. DVS-III-963</p>
                <p className="label-sm text-muted-foreground">Coffret bois laqué · Sceau de cire</p>
              </div>
            </div>

            <div className="md:col-span-5 md:col-start-8 flex flex-col justify-between">
              <div>
                <p className="label text-muted-foreground">03 · Drop III · En cours</p>
                <h2 className="display mt-6 text-5xl leading-[0.95] md:text-7xl">
                  Lamborghini<br /><span className="italic">SVJ</span>
                </h2>
                <p className="mt-8 text-base leading-relaxed text-muted-foreground md:text-lg">
                  Édition de 963 pièces — un exemplaire par SVJ produite. Coupe oversize boxy, col
                  rond côtelé, coton Supima 85 % et cachemire grade A 15 %, grammage 400 g/m²,
                  garment washed. Broderie haute densité en poitrine gauche et grand dos, coutures
                  chevauchées renforcées à fil doré.
                </p>
              </div>

              <dl className="mt-12 divide-y divide-border border-y border-border">
                {[
                  ["Composition", "Supima 85 % · Cachemire 15 %"],
                  ["Grammage", "400 g/m² · garment washed"],
                  ["Confection", "Atelier haute couture, Paris"],
                  ["Édition", "963 pièces numérotées"],
                  ["Certification", "NFC NTAG424 · AES-128"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between py-4">
                    <dt className="label text-muted-foreground">{k}</dt>
                    <dd className="text-right text-sm">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-10 flex items-end justify-between">
                <div>
                  <p className="label-sm text-muted-foreground">Prix d'entrée</p>
                  <p className="display mt-2 text-4xl">1 490 €</p>
                </div>
                <a
                  href="#"
                  className="label border-b border-foreground pb-1 transition-opacity duration-500 hover:opacity-60"
                >
                  Réserver une pièce
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ——— PALETTE ——— */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-40">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <p className="display text-5xl leading-[1] md:text-6xl">
                Palette.<br />
                <span className="italic text-muted-foreground text-3xl md:text-4xl">
                  Cinq matières évoquées.
                </span>
              </p>
              <p className="label text-muted-foreground">04 · Chromatique</p>
            </div>

            <div className="mt-20 grid grid-cols-2 gap-px bg-border md:grid-cols-5">
              {palette.map((c) => (
                <div key={c.n} className="bg-background">
                  <div
                    className="aspect-[4/5]"
                    style={{ background: c.hex }}
                    aria-hidden
                  />
                  <div className="p-6">
                    <p className="label-sm text-muted-foreground">{c.ref}</p>
                    <p className="display mt-3 text-2xl">{c.n}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ——— CERTIFICATION SPLIT ——— */}
        <section className="bg-charbon text-travertin">
          <div className="mx-auto grid max-w-[1600px] gap-0 md:grid-cols-2">
            <div className="relative aspect-square md:aspect-auto">
              <img
                src={certificateImg}
                alt="Certificat DIVUS avec sceau de cire et puce NFC NTAG424"
                loading="lazy"
                width={1408}
                height={1008}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center px-6 py-20 md:px-16 md:py-32">
              <p className="label text-travertin/60">05 · Certification</p>
              <h2 className="display mt-8 text-5xl leading-[0.95] md:text-7xl">
                Une trace,<br /><span className="italic">non un logo.</span>
              </h2>
              <p className="mt-10 max-w-md text-base leading-relaxed text-travertin/70 md:text-lg">
                Chaque pièce embarque une puce NFC NTAG424 non clonable, chiffrée en AES-128. Le
                numéro de série, gravé à chaud sur cuir pleine fleur, inscrit l'objet dans une
                histoire vérifiable. Un sceau de cire cyprès clôt le coffret de bois laqué.
              </p>
              <div className="mt-14 grid grid-cols-3 gap-8 border-t border-travertin/20 pt-8">
                <div>
                  <p className="display text-3xl">03</p>
                  <p className="label-sm mt-2 text-travertin/60">Éditions</p>
                </div>
                <div>
                  <p className="display text-3xl">1 313</p>
                  <p className="label-sm mt-2 text-travertin/60">Pièces éditées</p>
                </div>
                <div>
                  <p className="display text-3xl">02</p>
                  <p className="label-sm mt-2 text-travertin/60">Sold out</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ——— HISTORIQUE DES SÉRIES ——— */}
        <section className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-40">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <p className="display text-5xl leading-[1] md:text-6xl">
              Historique des séries.
            </p>
            <p className="label text-muted-foreground">06 · Archives</p>
          </div>

          <div className="mt-16 border-t border-border">
            <div className="hidden grid-cols-12 gap-6 border-b border-border py-4 md:grid">
              <p className="label col-span-2 text-muted-foreground">Série</p>
              <p className="label col-span-5 text-muted-foreground">Hommage</p>
              <p className="label col-span-2 text-muted-foreground">Pièces</p>
              <p className="label col-span-2 text-muted-foreground">Prix</p>
              <p className="label col-span-1 text-right text-muted-foreground">Statut</p>
            </div>
            {series.map((s) => (
              <div
                key={s.n}
                className="grid grid-cols-2 items-baseline gap-4 border-b border-border py-8 md:grid-cols-12 md:gap-6 md:py-10 transition-colors duration-500 hover:bg-ivory"
              >
                <p className="display col-span-2 text-3xl md:col-span-2 md:text-4xl">{s.n}</p>
                <p className="col-span-2 text-base md:col-span-5 md:text-lg">{s.t}</p>
                <p className="label-sm text-muted-foreground md:col-span-2">{s.p} pièces</p>
                <p className="label-sm text-muted-foreground md:col-span-2">{s.pr}</p>
                <p
                  className={`label-sm text-right md:col-span-1 ${
                    s.s === "En cours" ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {s.s}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ——— LOOKBOOK ——— */}
        <section className="border-t border-border bg-ivory">
          <div className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-40">
            <div className="grid gap-12 md:grid-cols-12 md:gap-x-10">
              <div className="md:col-span-5">
                <p className="label text-muted-foreground">07 · Lookbook</p>
                <p className="display mt-8 text-5xl leading-[1] md:text-7xl">
                  Le silence<br /><span className="italic">habité.</span>
                </p>
                <p className="mt-10 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                  Photographié à Paris, VIᵉ. Lumière naturelle, argentique moyen format. Aucun
                  retouche numérique n'altère la matière — le grain est la signature.
                </p>
                <a
                  href="#"
                  className="label mt-10 inline-block border-b border-foreground pb-1 transition-opacity duration-500 hover:opacity-60"
                >
                  Voir la série complète
                </a>
              </div>
              <div className="md:col-span-6 md:col-start-7">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={lookbookImg}
                    alt="Lookbook DIVUS — Drop III"
                    loading="lazy"
                    width={1200}
                    height={1504}
                    className="h-full w-full object-cover transition-transform duration-[2000ms] ease-out hover:scale-[1.03]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ——— PRESSE ——— */}
        <section className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
          <p className="label text-center text-muted-foreground">Ils en ont parlé</p>
          <div className="mt-12 grid grid-cols-2 items-center gap-y-10 md:grid-cols-5">
            {["L'Officiel", "Numéro", "Vogue Hommes", "Highsnobiety", "System"].map((n) => (
              <p
                key={n}
                className="display text-center text-2xl text-muted-foreground md:text-3xl"
              >
                {n}
              </p>
            ))}
          </div>
        </section>

        {/* ——— CERCLE / NEWSLETTER ——— */}
        <section id="cercle" className="border-t border-border bg-cypres text-travertin">
          <div className="mx-auto max-w-[1600px] px-6 py-28 md:px-10 md:py-40">
            <div className="grid gap-16 md:grid-cols-12">
              <div className="md:col-span-6">
                <p className="label text-travertin/60">08 · Cercle privé</p>
                <p className="display mt-8 text-5xl leading-[0.95] md:text-7xl">
                  L'accès<br /><span className="italic">avant l'annonce.</span>
                </p>
              </div>
              <div className="md:col-span-5 md:col-start-8 flex flex-col justify-end">
                <p className="text-base leading-relaxed text-travertin/80 md:text-lg">
                  Le Cercle reçoit chaque nouvelle édition en avance, avant toute communication
                  publique. Aucun message commercial. Une lettre, quatre fois l'an.
                </p>
                <form className="mt-10 flex items-center border-b border-travertin/30 pb-3">
                  <input
                    type="email"
                    required
                    placeholder="Votre adresse"
                    className="flex-1 bg-transparent text-base text-travertin placeholder:text-travertin/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="label text-travertin transition-opacity duration-500 hover:opacity-60"
                  >
                    Rejoindre →
                  </button>
                </form>
                <p className="label-sm mt-4 text-travertin/50">
                  Sur invitation implicite. Désinscription en un clic.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
