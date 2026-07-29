import { useEffect, useRef, useState } from "react";

const CERT_LINES = [
  "— CERTIFICAT D'AUTHENTICITÉ —",
  "MAISON DIVUS · PARIS",
  "",
  "Série       : DROP III · SVJ · ULTIMA",
  "Référence   : DVS-III-963-II",
  "Numéro      : 042 / 963",
  "Matière     : Cachemire · Supima 400 g/m²",
  "Coloris     : Charbon",
  "Atelier     : Paris, VIIIᵉ",
  "Année       : MMXXVI",
  "",
  "Puce        : NTAG424 DNA",
  "Chiffrement : AES-128 · SUN",
  "UID         : 04:A7:2F:9C:B1:88:80",
  "Signature   : 9F3C·7A21·D40E·B562",
  "",
  "Vérifié · Inscrit à l'archive Maison.",
];

export function NfcScan() {
  const [scanning, setScanning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [typed, setTyped] = useState<string[]>([]);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const launch = () => {
    clearTimers();
    setRevealed(false);
    setTyped([]);
    setScanning(true);

    timers.current.push(
      window.setTimeout(() => {
        setScanning(false);
        setRevealed(true);
        CERT_LINES.forEach((line, i) => {
          timers.current.push(
            window.setTimeout(() => {
              setTyped((prev) => [...prev, line]);
            }, i * 90),
          );
        });
      }, 2600),
    );
  };

  const reset = () => {
    clearTimers();
    setScanning(false);
    setRevealed(false);
    setTyped([]);
  };

  return (
    <div className="mx-auto mt-16 grid max-w-5xl gap-12 md:grid-cols-2 md:gap-16">
      {/* ————— SCANNER ————— */}
      <div className="flex flex-col items-center">
        <div
          className="relative aspect-square w-full max-w-sm overflow-hidden border border-border bg-[color:var(--ivory)]"
          aria-label="Simulateur de scan NFC"
        >
          {/* Concentric rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`absolute h-24 w-24 rounded-full border border-foreground/30 ${
                scanning ? "animate-[nfc-pulse_1.6s_ease-out_infinite]" : ""
              }`}
            />
            <div
              className={`absolute h-24 w-24 rounded-full border border-foreground/20 ${
                scanning ? "animate-[nfc-pulse_1.6s_ease-out_infinite_0.4s]" : ""
              }`}
            />
            <div
              className={`absolute h-24 w-24 rounded-full border border-foreground/10 ${
                scanning ? "animate-[nfc-pulse_1.6s_ease-out_infinite_0.8s]" : ""
              }`}
            />

            {/* NFC glyph */}
            <svg
              viewBox="0 0 48 48"
              className="relative h-14 w-14 text-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            >
              <circle cx="24" cy="24" r="1.6" fill="currentColor" />
              <path d="M18 24a6 6 0 0 1 12 0" />
              <path d="M14 24a10 10 0 0 1 20 0" />
              <path d="M10 24a14 14 0 0 1 28 0" />
            </svg>
          </div>

          {/* Scan line */}
          {scanning && (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-[nfc-sweep_2.6s_cubic-bezier(0.19,1,0.22,1)_forwards] bg-foreground/60" />
          )}

          {/* Corner marks */}
          <span className="absolute left-3 top-3 h-3 w-3 border-l border-t border-foreground/40" />
          <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-foreground/40" />
          <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-foreground/40" />
          <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-foreground/40" />

          {/* Status */}
          <p className="label absolute bottom-6 left-0 right-0 text-center text-[0.6rem] text-muted-foreground">
            {scanning
              ? "Lecture en cours…"
              : revealed
                ? "Authentifié"
                : "En attente d'un contact"}
          </p>
        </div>

        <div className="mt-8 flex gap-6">
          <button
            type="button"
            onClick={launch}
            disabled={scanning}
            className="btn-line btn-line-hover disabled:cursor-wait disabled:opacity-50"
          >
            {revealed ? "Rejouer le scan" : "Approcher la pièce"}
          </button>
          {revealed && (
            <button
              type="button"
              onClick={reset}
              className="label text-muted-foreground underline-offset-4 hover:underline"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* ————— CERTIFICAT ————— */}
      <div className="flex">
        <div className="relative w-full border border-border bg-background p-8 text-left md:p-10">
          <div className="flex items-center justify-between">
            <p className="label text-muted-foreground">Certificat · Aperçu</p>
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                revealed
                  ? "bg-[color:var(--cypres)]"
                  : scanning
                    ? "animate-pulse bg-foreground/60"
                    : "bg-border"
              }`}
            />
          </div>

          <pre className="mt-8 min-h-[22rem] whitespace-pre-wrap font-mono text-[0.72rem] leading-[1.75] text-foreground/90 md:text-[0.78rem]">
            {revealed ? (
              <>
                {typed.join("\n")}
                {typed.length < CERT_LINES.length && (
                  <span className="inline-block w-1.5 animate-pulse bg-foreground/70">&nbsp;</span>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">
                {scanning
                  ? "Déchiffrement du contenu chiffré AES-128…"
                  : "Le certificat s'affichera après lecture de la puce."}
              </span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
