import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LangProvider } from "../lib/i18n";
import { useCartSync } from "@/hooks/useCartSync";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="label text-muted-foreground">Erreur</p>
        <h1 className="display mt-6 text-6xl">404</h1>
        <p className="mt-6 text-sm text-muted-foreground">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <div className="mt-10">
          <Link to="/" className="btn-line btn-line-hover">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="label text-muted-foreground">Incident</p>
        <h1 className="display mt-6 text-3xl">Cette page n'a pas pu s'ouvrir.</h1>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-line btn-line-hover"
          >
            Réessayer
          </button>
          <a href="/" className="btn-line btn-line-hover">
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "DIVUS Paris" },
      { name: "theme-color", content: "#fefefe" },
      { title: "DIVUS Paris — Maison de collection" },
      { property: "og:title", content: "DIVUS Paris — Maison de collection" },
      { name: "twitter:title", content: "DIVUS Paris — Maison de collection" },
      { name: "description", content: "DIVUS Paris. Éditions strictement numérotées, confection haute couture parisienne, certification NFC. La rareté héritée, l'élégance silencieuse." },
      { property: "og:description", content: "DIVUS Paris. Éditions strictement numérotées, confection haute couture parisienne, certification NFC. La rareté héritée, l'élégance silencieuse." },
      { name: "twitter:description", content: "DIVUS Paris. Éditions strictement numérotées, confection haute couture parisienne, certification NFC. La rareté héritée, l'élégance silencieuse." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/69b45fa5-1fd3-405e-aacc-25e8b7174e0f" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/69b45fa5-1fd3-405e-aacc-25e8b7174e0f" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..600,0..100;1,9..144,300..500,0..100&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useCartSync();

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </LangProvider>
    </QueryClientProvider>
  );
}
