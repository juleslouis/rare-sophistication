import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { LEGAL_DOCS } from "@/lib/legal";


/**
 * DIVUS — Footer minimal.
 * Une signature, quelques liens, rien de plus.
 * Tout en bas : un choix de langue volontairement discret.
 */
export function Footer() {
  const { lang, setLang, t } = useLang();

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
            { to: "/collection", label: "Liste d'attente" },
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
              {t(l.label)}
            </Link>
          ))}
        </nav>

        {/* ————— Documents légaux (rédigés dans Shopify) ————— */}
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:gap-x-10">
          <Link
            to="/legal"
            className="label-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("Informations légales")}
          </Link>
          {LEGAL_DOCS.map((d) => (
            <Link
              key={d.handle}
              to="/legal/$handle"
              params={{ handle: d.handle }}
              className="label-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(d.fr)}
            </Link>
          ))}
        </nav>


        <div className="mt-16 flex flex-col items-center gap-3 border-t border-border pt-8 text-center md:flex-row md:justify-between md:text-left">
          <p className="label-sm text-muted-foreground">
            {t("© MMXXV · Fabricatum in Gallia")}
          </p>
          <p className="label-sm text-muted-foreground">
            {t("Certification NFC · AES-128")}
          </p>
        </div>

        {/* ————— Choix de langue — discret, tout en bas ————— */}
        <div className="mt-10 flex items-center justify-center">
          <div
            className="group flex items-center gap-2 opacity-25 transition-opacity duration-700 hover:opacity-100 focus-within:opacity-100"
            aria-label={t("Langue")}
          >
            <button
              type="button"
              onClick={() => setLang("fr")}
              aria-pressed={lang === "fr"}
              className={`label-sm transition-colors ${
                lang === "fr"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              FR
            </button>
            <span aria-hidden className="text-[0.55rem] text-muted-foreground">
              ·
            </span>
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`label-sm transition-colors ${
                lang === "en"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
