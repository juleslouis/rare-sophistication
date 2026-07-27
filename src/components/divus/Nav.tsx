import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

/**
 * DIVUS — Navigation
 * Composition tripartite héritée des maisons horlogères :
 *   Menu (gauche) · Monogramme (centre) · Icônes (droite)
 * Silencieuse, fine, jamais opaque au-dessus du hero.
 */
export function Nav({ variant = "auto" }: { variant?: "auto" | "solid" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
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
            ? "bg-background/90 backdrop-blur-md border-b border-border/60 text-foreground"
            : "bg-transparent border-b border-transparent text-travertin"
        }`}
      >
        <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-3 items-center px-5 md:h-20 md:px-10">
          <div className="flex items-center">
            <button
              onClick={() => setOpen(true)}
              className="group flex items-center gap-3"
              aria-label="Ouvrir le menu"
            >
              <span className="flex flex-col gap-[5px]" aria-hidden>
                <span className="block h-px w-5 bg-current transition-all duration-500 group-hover:w-6" />
                <span className="block h-px w-5 bg-current transition-all duration-500 group-hover:w-4" />
                <span className="block h-px w-5 bg-current transition-all duration-500 group-hover:w-6" />
              </span>
              <span className="label hidden md:inline">Menu</span>
            </button>
          </div>

          <Link
            to="/"
            className="justify-self-center text-center"
            aria-label="DIVUS — Accueil"
          >
            <span className="display block text-[1.25rem] leading-none tracking-[0.34em] md:text-[1.5rem]">
              DIVUS
            </span>
            <span className="label-sm mt-1 hidden opacity-70 md:block">
              Paris · Amsterdam
            </span>
          </Link>

          <div className="flex items-center justify-end gap-6 md:gap-8">
            <Link
              to="/collection"
              className="opacity-90 transition-opacity hover:opacity-60"
              aria-label="Trouver une pièce"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
            </Link>
            <button
              className="opacity-90 transition-opacity hover:opacity-60"
              aria-label="Cercle privé"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" strokeLinecap="round" />
              </svg>
            </button>
            <button className="label hidden md:inline">Panier · 0</button>
          </div>
        </div>
      </header>

      {/* Overlay menu plein écran */}
      <div
        className={`fixed inset-0 z-[60] bg-background transition-[opacity,visibility] duration-700 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-6 md:px-10 md:py-8">
          <div className="grid grid-cols-3 items-center">
            <button
              onClick={() => setOpen(false)}
              className="label flex items-center gap-3 justify-self-start"
              aria-label="Fermer"
            >
              <span aria-hidden className="text-lg leading-none">×</span> Fermer
            </button>
            <p className="display justify-self-center text-[1.25rem] tracking-[0.34em] md:text-[1.5rem]">
              DIVUS
            </p>
            <span className="label-sm hidden justify-self-end text-muted-foreground md:block">
              MMXXV
            </span>
          </div>

          <nav className="mt-auto grid gap-4 pb-16 md:grid-cols-12 md:gap-x-10">
            <ul className="col-span-8 space-y-3">
              {[
                { to: "/", label: "Accueil" },
                { to: "/collection", label: "Trouver une pièce" },
                { to: "/", label: "Manifeste", hash: "#manifeste" },
                { to: "/", label: "Journal", hash: "#journal" },
                { to: "/", label: "Certification", hash: "#certification" },
                { to: "/", label: "Cercle privé", hash: "#cercle" },
                { to: "/", label: "Contact", hash: "#contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    hash={item.hash?.slice(1)}
                    onClick={() => setOpen(false)}
                    className="display block text-5xl leading-[1.05] transition-opacity duration-500 hover:opacity-50 md:text-7xl"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="col-span-8 md:col-span-3 md:col-start-10 mt-10 md:mt-0 self-end">
              <p className="label text-muted-foreground">Maison</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Paris · Amsterdam<br />
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
