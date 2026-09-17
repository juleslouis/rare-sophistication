import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Nav } from "@/components/divus/Nav";
import { Footer } from "@/components/divus/Footer";
import { Button } from "@/components/ui/button";
import { PrivateCheckout } from "@/components/divus/PrivateCheckout";
import { getPrivateAccess } from "@/lib/private-access.functions";
import product from "@/assets/product.jpg";
import detailLight from "@/assets/piece-02.jpg";
import detailDark from "@/assets/piece-03.jpg";

export const Route = createFileRoute("/acces/$token")({
  loader: async ({ params }) => {
    const result = await getPrivateAccess({ data: { token: params.token } });
    if (!result.valid) throw notFound();
    return result;
  },
  head: () => ({
    meta: [
      { title: "Accès privé — DIVUS Paris" },
      { name: "description", content: "Espace privé DIVUS Paris." },
      { property: "og:title", content: "Accès privé — DIVUS Paris" },
      { property: "og:description", content: "Espace privé DIVUS Paris." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow, noarchive, nosnippet" },
    ],
  }),
  notFoundComponent: PrivateAccessUnavailable,
  errorComponent: PrivateAccessUnavailable,
  component: PrivateProductPage,
});

function PrivateAccessUnavailable() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-foreground">
      <div>
        <p className="label text-muted-foreground">Accès privé</p>
        <h1 className="display mt-8 text-4xl">Lien indisponible.</h1>
      </div>
    </main>
  );
}

function PrivateProductPage() {
  const { token } = Route.useParams();
  const { product: privateProduct, allocated } = Route.useLoaderData();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <Nav variant="solid" />
      <main className="bg-background text-foreground">
        <header className="mx-auto max-w-[1600px] px-6 pb-16 pt-36 text-center md:px-12 md:pb-24 md:pt-48">
          <p className="label text-muted-foreground">
            DIVUS · Paris · Fabricatum in Gallia
          </p>
          <h1 className="display mt-10 text-5xl md:text-7xl">
            {privateProduct.title}
          </h1>
        </header>

        <section className="mx-auto grid max-w-[1600px] gap-3 px-6 md:grid-cols-12 md:px-12">
          <figure className="overflow-hidden bg-secondary md:col-span-8">
            <img
              src={product}
              alt="Matière et encolure de la pièce"
              width={768}
              height={960}
              className="h-full w-full object-cover"
            />
          </figure>
          <div className="grid gap-3 md:col-span-4">
            <figure className="overflow-hidden bg-secondary">
              <img
                src={detailLight}
                alt="Détail de la matière claire"
                width={768}
                height={960}
                className="h-full w-full object-cover"
              />
            </figure>
            <figure className="overflow-hidden bg-secondary">
              <img
                src={detailDark}
                alt="Détail de la matière sombre"
                width={768}
                height={960}
                className="h-full w-full object-cover"
              />
            </figure>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-28 text-center md:px-12 md:py-40">
          <p className="display text-3xl leading-tight md:text-5xl">
            {privateProduct.statement}
          </p>
          <div className="mx-auto mt-14 max-w-xl space-y-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {privateProduct.details.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="mx-auto mt-20 max-w-sm border-y border-border py-12">
            <p className="display text-3xl">{privateProduct.price}</p>
            <p className="label mt-8 text-muted-foreground">
              {allocated} sur {privateProduct.limit} attribuées
            </p>
          </div>

          {!checkoutOpen ? (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="label mt-14 h-auto rounded-none border-foreground px-8 py-4 shadow-none"
              onClick={() => setCheckoutOpen(true)}
            >
              Confirmer mon inscription
            </Button>
          ) : (
            <div className="mt-14 text-left">
              <PrivateCheckout token={token} />
            </div>
          )}
        </section>

        <section className="border-t border-border px-6 py-16 text-center md:px-12 md:py-20">
          <p className="display text-2xl md:text-3xl">{privateProduct.closing}</p>
        </section>
      </main>
      <Footer />
    </>
  );
}