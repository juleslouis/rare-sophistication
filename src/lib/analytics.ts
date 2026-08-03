// GA4 (gtag.js) — chargé uniquement côté navigateur.
// L'ID de mesure vient du connecteur Google Analytics :
// VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const measurementId = import.meta.env
  .VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY as string | undefined;

let initialized = false;

function push(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export function initAnalytics() {
  if (typeof window === "undefined" || initialized) return;
  if (!measurementId) return; // pas d'ID configuré : aucun script chargé
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  push("js", new Date());
  push("config", measurementId, { send_page_view: true });
}

export function trackPageView(path: string) {
  if (!measurementId) return;
  push("event", "page_view", { page_path: path, page_location: window.location.href });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (!measurementId) return;
  push("event", name, params);
}

/** Événements de l'entonnoir liste d'attente. */
export const waitlistAnalytics = {
  view: (locale: string) =>
    trackEvent("waitlist_form_view", { locale, form_id: "waitlist" }),
  start: (locale: string) =>
    trackEvent("waitlist_form_start", { locale, form_id: "waitlist" }),
  submit: (locale: string) =>
    trackEvent("waitlist_submit", { locale, form_id: "waitlist" }),
  validationError: (locale: string, reason: string) =>
    trackEvent("waitlist_validation_error", { locale, form_id: "waitlist", reason }),
  error: (locale: string) =>
    trackEvent("waitlist_submit_error", { locale, form_id: "waitlist" }),
  /** Conversion. */
  signup: (locale: string) => {
    trackEvent("sign_up", { method: "waitlist", locale });
    trackEvent("waitlist_signup", { locale, form_id: "waitlist", value: 1 });
  },
};
