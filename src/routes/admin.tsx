import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import {
  TEST_TEMPLATES,
  adminLogin,
  adminLogout,
  getAdminDashboard,
  sendAdminTestEmail,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — DIVUS Paris" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Espace interne." },
      { property: "og:title", content: "Administration — DIVUS Paris" },
      { property: "og:description", content: "Espace interne." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type Dashboard = Awaited<ReturnType<typeof getAdminDashboard>>;

const LABELS: Record<string, string> = {
  "waitlist-confirmation": "Confirmation d'inscription",
  "waitlist-hint-1": "Indice n°1",
  "waitlist-hint-2": "Indice n°2",
};

const EVENT_LABELS: Record<string, string> = {
  sent: "Envoyé",
  rejected: "Refusé",
  bounced: "Rejeté (bounce)",
  complained: "Plainte",
  unsubscribed: "Désinscription",
  suppressed: "Supprimé (liste noire)",
  rate_limited: "Cadence limitée",
};

function isFailure(eventType: string) {
  return eventType !== "sent";
}

function AdminPage() {
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);
  const load = useServerFn(getAdminDashboard);
  const sendTest = useServerFn(sendAdminTestEmail);

  const [data, setData] = useState<Dashboard | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [template, setTemplate] =
    useState<(typeof TEST_TEMPLATES)[number]>("waitlist-confirmation");
  const [testEmail, setTestEmail] = useState("");
  const [locale, setLocale] = useState<"fr" | "en">("fr");
  const [testResult, setTestResult] = useState<string | null>(null);

  const refresh = async () => {
    setData(await load({ data: undefined }));
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await login({ data: { password } });
    setBusy(false);
    if (!res.ok) {
      setError("Mot de passe incorrect.");
      return;
    }
    setPassword("");
    await refresh();
  };

  const onTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTestResult(null);
    const res = await sendTest({
      data: { template, to: testEmail, locale },
    });
    setBusy(false);
    if (res.locked) {
      await refresh();
      return;
    }
    setTestResult(
      res.ok
        ? `Envoyé à ${testEmail}.`
        : `Échec — ${res.reason ?? "raison inconnue"}.`,
    );
    await refresh();
  };

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="label text-muted-foreground">Chargement</p>
      </main>
    );
  }

  if (data.locked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <form onSubmit={onLogin} className="w-full max-w-sm text-center">
          <p className="label text-muted-foreground">Espace interne</p>
          <h1 className="display mt-8 text-3xl md:text-4xl">Administration</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            aria-label="Mot de passe"
            className="mt-12 w-full border-b border-border bg-transparent pb-3 text-center text-sm outline-none focus:border-foreground"
          />
          {error && (
            <p className="mt-4 text-xs text-muted-foreground">{error}</p>
          )}
          <button
            type="submit"
            disabled={busy || !password}
            className="label mt-10 border-b border-foreground pb-1 disabled:opacity-30"
          >
            Entrer
          </button>
        </form>
      </main>
    );
  }

  const { waitlist, events, counts } = data;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-24 md:px-12 md:py-32">
        <header className="flex items-baseline justify-between border-b border-border pb-8">
          <div>
            <p className="label text-muted-foreground">Espace interne</p>
            <h1 className="display mt-4 text-3xl md:text-4xl">Envois</h1>
          </div>
          <button
            onClick={async () => {
              await logout({ data: undefined });
              await refresh();
            }}
            className="label text-muted-foreground hover:text-foreground"
          >
            Quitter
          </button>
        </header>

        {/* Agrégats */}
        <section className="grid grid-cols-2 gap-px border-b border-border md:grid-cols-4">
          {[
            ["Inscriptions", waitlist.total],
            ["Consentements", waitlist.consented],
            ["Indice n°1 envoyé", waitlist.hint1Sent],
            ["Indice n°2 envoyé", waitlist.hint2Sent],
          ].map(([label, value]) => (
            <div key={label as string} className="py-10">
              <p className="display text-3xl">
                {String(value).padStart(4, "0")}
              </p>
              <p className="label mt-3 text-muted-foreground">{label}</p>
            </div>
          ))}
        </section>

        {/* Test d'envoi */}
        <section className="border-b border-border py-16">
          <h2 className="display text-xl md:text-2xl">Envoi de test</h2>
          <form
            onSubmit={onTest}
            className="mt-8 flex flex-col gap-6 md:flex-row md:items-end"
          >
            <label className="flex-1">
              <span className="label text-muted-foreground">Modèle</span>
              <select
                value={template}
                onChange={(e) =>
                  setTemplate(
                    e.target.value as (typeof TEST_TEMPLATES)[number],
                  )
                }
                className="mt-3 w-full border-b border-border bg-transparent pb-2 text-sm outline-none focus:border-foreground"
              >
                {TEST_TEMPLATES.map((name) => (
                  <option key={name} value={name}>
                    {LABELS[name] ?? name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex-1">
              <span className="label text-muted-foreground">Destinataire</span>
              <input
                type="email"
                required
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="adresse@exemple.com"
                className="mt-3 w-full border-b border-border bg-transparent pb-2 text-sm outline-none focus:border-foreground"
              />
            </label>
            <label className="md:w-24">
              <span className="label text-muted-foreground">Langue</span>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as "fr" | "en")}
                className="mt-3 w-full border-b border-border bg-transparent pb-2 text-sm outline-none focus:border-foreground"
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={busy}
              className="label border-b border-foreground pb-1 disabled:opacity-30"
            >
              Envoyer
            </button>
          </form>
          {testResult && (
            <p className="mt-6 text-xs text-muted-foreground">{testResult}</p>
          )}
        </section>

        {/* Journal */}
        <section className="py-16">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="display text-xl md:text-2xl">Journal des envois</h2>
            <button
              onClick={() => void refresh()}
              className="label text-muted-foreground hover:text-foreground"
            >
              Actualiser
            </button>
          </div>

          {Object.keys(counts).length > 0 && (
            <p className="label mt-6 text-muted-foreground">
              {Object.entries(counts)
                .map(
                  ([type, n]) => `${EVENT_LABELS[type] ?? type} ${n}`,
                )
                .join("   ·   ")}
            </p>
          )}

          {data.logsError && (
            <p className="mt-6 text-xs text-muted-foreground">
              Journal indisponible — {data.logsError}
            </p>
          )}

          <table className="mt-10 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="label pb-4 font-normal text-muted-foreground">
                  Date
                </th>
                <th className="label pb-4 font-normal text-muted-foreground">
                  Destinataire
                </th>
                <th className="label pb-4 font-normal text-muted-foreground">
                  Modèle
                </th>
                <th className="label pb-4 font-normal text-muted-foreground">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((e, i) => (
                <tr
                  key={`${e.timestamp}-${e.recipient}-${i}`}
                  className="border-b border-border/50"
                >
                  <td className="py-4 text-muted-foreground">
                    {new Date(e.timestamp).toLocaleString("fr-FR")}
                  </td>
                  <td className="py-4">{e.recipient}</td>
                  <td className="py-4 text-muted-foreground">
                    {e.label ? (LABELS[e.label] ?? e.label) : "—"}
                  </td>
                  <td className="py-4">
                    <span
                      className={
                        isFailure(e.eventType)
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {EVENT_LABELS[e.eventType] ?? e.eventType}
                      {e.status ? ` — ${e.status}` : ""}
                    </span>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 text-center text-xs text-muted-foreground"
                  >
                    Aucun envoi enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {data.historyStartsAt && (
            <p className="mt-8 text-xs text-muted-foreground">
              Historique visible depuis le{" "}
              {new Date(data.historyStartsAt).toLocaleDateString("fr-FR")}.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
