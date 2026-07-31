import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PIECES } from "@/lib/pieces";

const summarize = (p: (typeof PIECES)[number]) => ({
  ref: p.ref,
  serie: p.serie,
  drop: p.drop,
  hommage: p.hommage,
  matiere: p.matiere,
  couleur: p.couleur,
  edition: p.edition,
  prix_eur: p.prix,
  statut: p.statut,
  annee: p.year,
});

export default defineTool({
  name: "list_pieces",
  title: "Lister les pièces",
  description:
    "Liste le catalogue public DIVUS PARIS (référence, série, coloris, édition, prix, statut). Filtres optionnels par série ou par statut.",
  inputSchema: {
    drop: z
      .enum(["I", "II", "III"])
      .optional()
      .describe("Filtrer par série : I, II ou III."),
    statut: z
      .enum(["Sold out", "En cours", "Sur liste"])
      .optional()
      .describe("Filtrer par statut de disponibilité."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ drop, statut }) => {
    const pieces = PIECES.filter(
      (p) => (!drop || p.drop === drop) && (!statut || p.statut === statut),
    ).map(summarize);

    return {
      content: [{ type: "text", text: JSON.stringify(pieces, null, 2) }],
      structuredContent: { count: pieces.length, pieces },
    };
  },
});
