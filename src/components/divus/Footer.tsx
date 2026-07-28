import { Link } from "@tanstack/react-router";

/**
 * DIVUS — Footer minimal.
 * Une signature, quelques liens, rien de plus.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-24">
        <div className="flex flex-col items-center text-center">
          <p className="display text-[1.35rem] leading-none tracking-[0.28em] md:text-[1.6rem]">
            DIVUS
          </p>
          <p className="mt-2 text-[0.6rem] font-medium tracking-[0.42em] text-muted-foreground">
            PARIS
          </p>
        </div>

        <nav className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:gap-x-14">
          {[
            { to: "/collection", label: "Collection" },
            { to: "/philosophie", label: "Philosophie" },
            { to: "/philosophie", label: "Certification", hash: "certification" },
            { to: "/philosophie", label: "Contact", hash: "contact" },
          ].map((l, i) => (
            <Link
              key={i}
              to={l.to}
              hash={l.hash}
              className="label text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-16 flex flex-col items-center gap-3 border-t border-border pt-8 text-center md:flex-row md:justify-between md:text-left">
          <p className="label-sm text-muted-foreground">
            © MMXXV · Fabricatum in Gallia
          </p>
          <p className="label-sm text-muted-foreground">
            Certification NFC · AES-128
          </p>
        </div>
      </div>
    </footer>
  );
}
