import { defineTool } from "@lovable.dev/mcp-js";
import { PIECES } from "@/lib/pieces";

export default defineTool({
  name: "maison_info",
  title: "La Maison",
  description:
    "Présente la Maison DIVUS PARIS : philosophie, rareté contractuelle des séries, certification NFC chiffrée et pages du site.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      maison: "DIVUS PARIS",
      philosophie:
        "Maison de collection parisienne. Pièces oversized en cachemire Supima, confectionnées en atelier haute couture, inspirées d'objets iconiques (horlogerie, automobile).",
      rarete:
        "Chaque série est close par contrat : Drop I (100 pièces), Drop II (250 pièces), Drop III (963 pièces). Aucune réédition.",
      certification:
        "Chaque pièce embarque une puce NFC chiffrée cousue en doublure, liée à l'archive de la Maison.",
      livraison: "Écrin de bois massif, remise en main propre.",
      series: [...new Set(PIECES.map((p) => p.serie))],
      pages: {
        accueil: "/",
        collection: "/collection",
        philosophie: "/philosophie",
        piece: "/piece/{ref}",
      },
    };

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
