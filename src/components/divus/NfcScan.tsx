import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

const CERT_LINES = [
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
];

/** Carte de certification inclinable — inspiration horlogère : le regard tourne autour de l'objet. */
export function NfcScan() {
  const { t } = useLang();
  const [scanning, setScanning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [typed, setTyped] = useState<string[]>([]);
  const timers = useRef<number[]>([]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  /* ————— Inclinaison au scroll (tactile) ————— */
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const p = (center - window.innerHeight / 2) / (window.innerHeight / 2);
        setTilt({ x: Math.max(-1, Math.min(1, p)) * -7, y: 0, active: true });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  /* ————— Inclinaison à la souris ————— */
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 12, y: px * 14, active: true });
  }, []);

  const onLeave = useCallback(() => setTilt({ x: 0, y: 0, active: false }), []);

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
            window.setTimeout(() => setTyped((prev) => [...prev, line]), i * 90),
          );
        });
      }, 2400),
    );
  };

  const reset = () => {
    clearTimers();
    setScanning(false);
    setRevealed(false);
    setTyped([]);
  };

  const glare = 50 + tilt.y * 2.2;

  return (
    <div ref={wrapRef} className="mx-auto mt-20 max-w-2xl md:mt-28">
      <div
        className="[perspective:1600px]"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div
          ref={cardRef}
          className="relative aspect-[1.6/1] w-full origin-center border border-border bg-[color:var(--ivory)] [transform-style:preserve-3d]"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
            transition: tilt.active
              ? "transform 220ms cubic-bezier(0.19,1,0.22,1)"
              : "transform 1400ms cubic-bezier(0.19,1,0.22,1)",
            boxShadow: `${-tilt.y * 2}px ${18 + tilt.x * 1.5}px 60px -30px color-mix(in oklab, var(--charbon) 45%, transparent)`,
          }}
          aria-label={t("Simulateur de scan NFC")}
        >
          {/* Reflet — lumière rasante d'atelier */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background: `linear-gradient(${100 + tilt.y * 1.5}deg, transparent ${glare - 34}%, color-mix(in oklab, var(--blanc) 85%, transparent) ${glare}%, transparent ${glare + 34}%)`,
            }}
          />

          {/* Filet intérieur */}
          <span className="pointer-events-none absolute inset-3 border border-foreground/10" />

          {/* Contenu */}
          <div className="relative flex h-full flex-col justify-between p-6 md:p-10 [transform:translateZ(28px)]">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="label text-[0.58rem] text-muted-foreground">
                  {t("Certificat")}
                </p>
                <p className="display mt-3 text-lg md:text-2xl">DIVUS · PARIS</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="label text-[0.55rem] text-muted-foreground">
                  {scanning
                    ? t("Lecture en cours…")
                    : revealed
                      ? t("Authentifié")
                      : t("En attente d'un contact")}
                </span>
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
            </div>

            {/* Zone de lecture */}
            {!revealed ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="relative flex items-center justify-center">
                  {[0, 0.4, 0.8].map((d, i) => (
                    <span
                      key={d}
                      className={`absolute h-16 w-16 rounded-full border border-foreground/20 ${
                        scanning
                          ? `animate-[nfc-pulse_1.8s_ease-out_infinite]`
                          : "opacity-0"
                      }`}
                      style={{ animationDelay: `${d}s`, borderWidth: 1 - i * 0.2 }}
                    />
                  ))}
                  <svg
                    viewBox="0 0 48 48"
                    className="relative h-10 w-10 text-foreground/70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                  >
                    <circle cx="24" cy="24" r="1.4" fill="currentColor" />
                    <path d="M18 24a6 6 0 0 1 12 0" />
                    <path d="M14 24a10 10 0 0 1 20 0" />
                    <path d="M10 24a14 14 0 0 1 28 0" />
                  </svg>
                </div>
              </div>
            ) : (
              <pre className="mt-4 flex-1 overflow-hidden whitespace-pre-wrap font-mono text-[0.6rem] leading-[1.7] text-foreground/85 md:text-[0.7rem]">
                {typed.map((l) => t(l)).join("\n")}
                {typed.length < CERT_LINES.length && (
                  <span className="inline-block w-1.5 animate-pulse bg-foreground/70">
                    &nbsp;
                  </span>
                )}
              </pre>
            )}

            <div className="flex items-end justify-between gap-6">
              <p className="label text-[0.55rem] text-muted-foreground">
                {revealed ? "042 / 963" : t("NTAG424 DNA · AES-128")}
              </p>
              <p className="display-italic text-sm text-muted-foreground">
                {revealed ? t("Inscrit à l'archive") : "MMXXVI"}
              </p>
            </div>
          </div>

          {/* Ligne de balayage */}
          {scanning && (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-[nfc-sweep_2.4s_cubic-bezier(0.19,1,0.22,1)_forwards] bg-foreground/50" />
          )}
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center gap-8">
        <button
          type="button"
          onClick={launch}
          disabled={scanning}
          className="btn-line btn-line-hover disabled:cursor-wait disabled:opacity-50"
        >
          {revealed ? t("Rejouer le scan") : t("Approcher la pièce")}
        </button>
        {revealed && (
          <button
            type="button"
            onClick={reset}
            className="label text-muted-foreground underline-offset-4 hover:underline"
          >
            {t("Réinitialiser")}
          </button>
        )}
      </div>
    </div>
  );
}
