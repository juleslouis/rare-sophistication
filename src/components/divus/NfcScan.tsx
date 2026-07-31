import { useEffect, useRef, useState } from "react";
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
  const glareRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // cible / valeur courante — animées hors du cycle React pour éviter les saccades
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const scrollTilt = useRef(0);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  /* ————— Boucle d'animation unique (lerp) ————— */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = !window.matchMedia("(pointer: fine)").matches;
    let raf = 0;
    let alive = true;

    const paint = () => {
      const c = current.current;
      const tt = target.current;
      const ease = reduce ? 1 : 0.11;
      c.x += (tt.x - c.x) * ease;
      c.y += (tt.y - c.y) * ease;

      const card = cardRef.current;
      if (card) {
        card.style.transform = `rotateX(${c.x.toFixed(3)}deg) rotateY(${c.y.toFixed(3)}deg)`;
        card.style.boxShadow = `${(-c.y * 2).toFixed(1)}px ${(18 + c.x * 1.5).toFixed(1)}px 60px -30px color-mix(in oklab, var(--charbon) 45%, transparent)`;
      }
      if (glareRef.current) {
        const g = 50 + c.y * 2.2;
        glareRef.current.style.background = `linear-gradient(${(100 + c.y * 1.5).toFixed(1)}deg, transparent ${g - 34}%, color-mix(in oklab, var(--blanc) 85%, transparent) ${g}%, transparent ${g + 34}%)`;
      }
      if (contentRef.current) {
        // parallax léger du contenu, dans le sens inverse de l'inclinaison
        contentRef.current.style.transform = `translate3d(${(c.y * 0.6).toFixed(2)}px, ${(-c.x * 0.6).toFixed(2)}px, 30px)`;
      }
      if (alive) raf = window.requestAnimationFrame(paint);
    };
    raf = window.requestAnimationFrame(paint);

    /* Défilement : inclinaison continue selon la position dans la fenêtre (tactile) */
    let scrollRaf = 0;
    const readScroll = () => {
      scrollRaf = 0;
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const p = (center - window.innerHeight / 2) / (window.innerHeight / 2);
      scrollTilt.current = Math.max(-1, Math.min(1, p)) * -6;
      if (!dragging.current) {
        target.current.x = scrollTilt.current;
        target.current.y = Math.max(-1, Math.min(1, p)) * 2.5;
      }
    };
    const onScroll = () => {
      if (!scrollRaf) scrollRaf = window.requestAnimationFrame(readScroll);
    };

    if (coarse) {
      readScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }

    return () => {
      alive = false;
      window.cancelAnimationFrame(raf);
      if (scrollRaf) window.cancelAnimationFrame(scrollRaf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* ————— Pointeur : souris ET toucher (le scroll reste natif) ————— */
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    if (e.pointerType === "touch") dragging.current = true;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const amp = e.pointerType === "touch" ? 9 : 12;
    target.current = { x: -py * amp, y: px * (amp + 2) };
  };

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") {
      dragging.current = false;
      target.current = { x: scrollTilt.current, y: 0 };
    } else {
      target.current = { x: 0, y: 0 };
    }
  };

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

  return (
    <div ref={wrapRef} className="mx-auto mt-20 max-w-2xl md:mt-28">
      <div
        className="touch-pan-y [perspective:1600px]"
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerEnd}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        <div
          ref={cardRef}
          className="relative aspect-[1.6/1] w-full origin-center border border-border bg-[color:var(--ivory)] [backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform]"
          aria-label={t("Simulateur de scan NFC")}
        >
          {/* Reflet — lumière rasante d'atelier */}
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 opacity-70 [will-change:background]"
          />

          {/* Filet intérieur */}
          <span className="pointer-events-none absolute inset-3 border border-foreground/10" />

          {/* Contenu */}
          <div
            ref={contentRef}
            className="relative flex h-full flex-col justify-between p-6 md:p-10 [will-change:transform]"
          >
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
                          ? "animate-[nfc-pulse_1.8s_ease-out_infinite]"
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
