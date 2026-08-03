import { createFileRoute } from "@tanstack/react-router";

// Flux SSE public : n'expose qu'une donnée agrégée (le nombre d'inscriptions).
// Aucune donnée personnelle ne transite par cet endpoint.

const POLL_MS = 2000;
const MAX_DURATION_MS = 5 * 60 * 1000;

export const Route = createFileRoute("/api/public/waitlist-count")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        const readCount = async (): Promise<number | null> => {
          const { count, error } = await supabaseAdmin
            .from("waitlist_signups")
            .select("id", { count: "exact", head: true });
          if (error) return null;
          return count ?? 0;
        };

        const encoder = new TextEncoder();
        const startedAt = Date.now();
        let last: number | null = null;
        let closed = false;

        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const send = (event: string, data: string) => {
              controller.enqueue(
                encoder.encode(`event: ${event}\ndata: ${data}\n\n`),
              );
            };

            const stop = () => {
              if (closed) return;
              closed = true;
              try {
                controller.close();
              } catch {
                /* déjà fermé */
              }
            };

            request.signal.addEventListener("abort", stop);

            send("ready", "1");

            while (!closed && Date.now() - startedAt < MAX_DURATION_MS) {
              const value = await readCount();
              if (closed) break;
              if (value !== null && value !== last) {
                last = value;
                send("count", JSON.stringify({ count: value }));
              } else {
                // commentaire keep-alive pour maintenir la connexion ouverte
                controller.enqueue(encoder.encode(": ping\n\n"));
              }
              await new Promise((resolve) => setTimeout(resolve, POLL_MS));
            }

            stop();
          },
          cancel() {
            closed = true;
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-store, no-transform",
            Connection: "keep-alive",
            "X-Accel-Buffering": "no",
          },
        });
      },
    },
  },
});
