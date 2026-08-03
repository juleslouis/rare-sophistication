import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";


/**
 * DIVUS — Navigation
 * Menu ultra-minimal. Trois zones : Menu · Logo · Recherche.
 * Silencieux, discret, jamais concurrent du contenu.
 */
export function Nav({ variant = "auto" }: { variant?: "auto" | "solid" }) {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = variant === "solid" || scrolled;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,color] duration-700 ease-out ${
          solid
            ? "bg-background/95 backdrop-blur-md border-b border-border/60 text-foreground"
            : "bg-transparent border-b border-transparent text-foreground"
        }`}
      >
        <div className="mx-auto grid h-20 max-w-[1600px] grid-cols-3 items-center px-6 md:h-24 md:px-12">
          {/* Menu */}
          <div className="flex items-center">
            <button
              onClick={() => setOpen(true)}
              className="group flex items-center gap-3"
              aria-label={t("Ouvrir le menu")}
            >
              <span className="flex flex-col gap-[5px]" aria-hidden>
                <span className="block h-px w-5 bg-current" />
                <span className="block h-px w-5 bg-current" />
              </span>
              <span className="label hidden md:inline">{t("Menu")}</span>
            </button>
          </div>

          {/* Logo — DIVUS Paris uniquement */}
          <Link
            to="/"
            className="justify-self-center text-center"
            aria-label={t("DIVUS Paris — Accueil")}
          >
            <span className="display block text-[1.35rem] leading-none tracking-[0.28em] md:text-[1.6rem]">
              DIVUS
            </span>
            <span className="mt-1.5 block text-[0.55rem] font-medium tracking-[0.42em] text-muted-foreground md:text-[0.6rem]">
              PARIS
            </span>
          </Link>

          {/* Accès anticipé */}
          <div className="flex items-center justify-end">
            <Link
              to="/collection"
              className="label hidden transition-opacity hover:opacity-60 md:inline"
            >
              {t("Liste d'attente")}
            </Link>
            <Link
              to="/collection"
              className="label-sm transition-opacity hover:opacity-60 md:hidden"
            >
              {t("Accès")}
            </Link>
          </div>

        </div>
      </header>

      {/* Overlay menu plein écran */}
      <div
        className={`fixed inset-0 z-[60] bg-background transition-[opacity,visibility] duration-700 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-7 md:px-12 md:py-9">
          <div className="grid grid-cols-3 items-center">
            <button
              onClick={() => setOpen(false)}
              className="label flex items-center gap-3 justify-self-start"
              aria-label={t("Fermer")}
            >
              <span aria-hidden className="text-xl leading-none font-light">×</span> {t("Fermer")}
            </button>
            <Link to="/" onClick={() => setOpen(false)} className="justify-self-center text-center">
              <span className="display block text-[1.35rem] leading-none tracking-[0.28em] md:text-[1.6rem]">
                DIVUS
              </span>
              <span className="mt-1.5 block text-[0.55rem] font-medium tracking-[0.42em] text-muted-foreground md:text-[0.6rem]">
                PARIS
              </span>
            </Link>
            <span className="label-sm hidden justify-self-end text-muted-foreground md:block">
              MMXXV
            </span>
          </div>

          <nav className="mt-auto grid gap-4 pb-20 md:grid-cols-12 md:gap-x-10">
            <ul className="col-span-8 space-y-2">
              {[
                { to: "/", label: "Accueil" },
                { to: "/collection", label: "Liste d'attente" },
                { to: "/philosophie", label: "Philosophie" },
                { to: "/philosophie", label: "Atelier", hash: "atelier" },
                { to: "/philosophie", label: "Certification", hash: "certification" },
                { to: "/philosophie", label: "Contact", hash: "contact" },

              ].map((item, i) => (
                <li key={`${item.label}-${i}`}>
                  <Link
                    to={item.to}
                    hash={item.hash}
                    onClick={() => setOpen(false)}
                    className="display block text-4xl leading-[1.1] transition-opacity duration-500 hover:opacity-50 md:text-6xl"
                  >
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="col-span-8 md:col-span-3 md:col-start-10 mt-10 md:mt-0 self-end">
              <p className="label text-muted-foreground">{t("Maison")}</p>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Paris<br />
                Fabricatum in Gallia<br />
                MMXXV
              </p>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
