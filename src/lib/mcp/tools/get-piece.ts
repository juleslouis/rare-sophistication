import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PIECES, findPiece } from "@/lib/pieces";

export default defineTool({
  name: "get_piece",
  title: "Détail d'une pièce",
  description:
    "Retourne la fiche complète d'une pièce DIVUS PARIS à partir de sa référence (ex. DVS-III-963-I) : description, fiche technique, édition, prix et statut.",
  inputSchema: {
    ref: z.string().describe("Référence de la pièce, ex. DVS-III-963-I."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ ref }) => {
    const piece = findPiece(ref.trim().toUpperCase());
    if (!piece) {
      throw new ToolError(
        `Référence inconnue : ${ref}. Références disponibles : ${PIECES.map((p) => p.ref).join(", ")}`,
      );
    }

    const payload = {
      ref: piece.ref,
      serie: piece.serie,
      drop: piece.drop,
      hommage: piece.hommage,
      matiere: piece.matiere,
      couleur: piece.couleur,
      edition: piece.edition,
      prix_eur: piece.prix,
      statut: piece.statut,
      annee: piece.year,
      description: piece.description,
      details: piece.details,
      url: `/piece/${piece.ref}`,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
