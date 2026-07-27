import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-700 ease-out ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/60"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6 md:h-20 md:px-10">
        <nav className="hidden flex-1 items-center gap-10 md:flex">
          <Link to="/" className="label hover:opacity-60 transition-opacity duration-500">
            Collection
          </Link>
          <a href="#manifeste" className="label hover:opacity-60 transition-opacity duration-500">
            Manifeste
          </a>
          <a href="#journal" className="label hover:opacity-60 transition-opacity duration-500">
            Journal
          </a>
        </nav>

        <Link to="/" className="flex-1 text-center" aria-label="DIVUS — Accueil">
          <span className="display block text-[1.35rem] md:text-[1.6rem] tracking-[0.32em] leading-none">
            DIVUS
          </span>
          <span className="label-sm mt-1 block text-muted-foreground">Paris · Amsterdam</span>
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-10 md:flex">
          <a href="#cercle" className="label hover:opacity-60 transition-opacity duration-500">
            Cercle
          </a>
          <a href="#drop" className="label hover:opacity-60 transition-opacity duration-500">
            Drop III
          </a>
          <button className="label hover:opacity-60 transition-opacity duration-500">
            Panier <span aria-hidden>·</span> 0
          </button>
        </div>

        <button className="label md:hidden" aria-label="Menu">Menu</button>
      </div>
    </header>
  );
}
