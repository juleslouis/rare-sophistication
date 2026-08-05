import { useState } from "react";
import { useLang } from "@/lib/i18n";
import certificate from "@/assets/certificate.jpg";

const CERT_LINES = [
  "MAISON DIVUS · PARIS",
  "",
  "Série       : ——",
  "Référence   : DVS-000-000",
  "Numéro      : 000 / 000",
  "Matière     : Cachemire · Supima 400 g/m²",
  "Coloris     : Charbon",
  "Atelier     : Paris, VIIIᵉ",
  "Année       : MMXXVI",
  "",
  "Puce        : NTAG424 DNA",
  "Chiffrement : AES-128 · SUN",
  "UID         : 04:A7:2F:9C:B1:88:80",
  "Signature   : 9F3C·7A21·D40E·B562",
];

/** Section certification — éditoriale, sans effets gadget. */
export function NfcScan() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto mt-20 max-w-[1600px] md:mt-28">
      <div className="grid gap-12 md:grid-cols-12 md:gap-20">
        {/* Visuel : sceau et puce */}
        <div className="md:col-span-7">
          <figure className="relative border border-border bg-[color:var(--ivory)]">
            <img
              src={certificate}
              alt={t("Sceau de cire et puce NFC cousue dans la doublure")}
              loading="lazy"
              width={1600}
              height={1067}
              className="w-full"
            />
            <figcaption className="label-sm flex items-center justify-between border-t border-border px-4 py-3 text-muted-foreground md:px-6">
              <span>{t("Puce NTAG424 DNA · Sceau Maison")}</span>
              <span>MMXXV</span>
            </figcaption>
          </figure>
        </div>

        {/* Texte */}
        <div className="flex flex-col justify-center md:col-span-5">
          <p className="label text-muted-foreground">{t("Certification")}</p>
          <h3 className="display mt-8 text-3xl leading-[1.05] md:text-4xl">
            {t("Une identité chiffrée.")}
          </h3>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              {t(
                "Une puce NFC NTAG424 DNA non clonable, chiffrement AES-128, est cousue dans la doublure de chaque pièce. Elle atteste de l'origine, de la série et du numéro individuel, et inscrit l'objet dans une archive vérifiable et transmissible.",
              )}
            </p>
            <p>
              {t(
                "Chaque lecture génère une signature unique. Aucune donnée n'est copiable, aucune session n'est rejouable.",
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="btn-line btn-line-hover mt-10 w-fit"
            aria-expanded={open}
          >
            {open ? t("Fermer le certificat") : t("Découvrir le certificat")}
          </button>
        </div>
      </div>

      {/* Certificat révélé */}
      {open && (
        <div className="fade-up mt-16 border border-border bg-[color:var(--ivory)] p-6 md:mt-24 md:p-16">
          <div className="mx-auto max-w-2xl">
            <p className="label-sm text-center text-muted-foreground">
              {t("— CERTIFICAT D'AUTHENTICITÉ —")}
            </p>
            <pre className="mt-10 whitespace-pre-wrap font-mono text-[0.7rem] leading-[1.9] text-foreground/85 md:text-[0.75rem]">
              {CERT_LINES.map((l) => t(l)).join("\n")}
            </pre>
            <p className="label-sm mt-10 text-center text-muted-foreground">
              {t("Vérifié · Inscrit à l'archive Maison.")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
