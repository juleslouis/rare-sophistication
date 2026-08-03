import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "maison_info",
  title: "La Maison",
  description:
    "Présente la Maison DIVUS PARIS : philosophie, principe de rareté héritée, certification NFC chiffrée et pages du site.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      maison: "DIVUS PARIS",
      philosophie:
        "Maison de collection parisienne. Pièces oversized en cachemire Supima, confectionnées en atelier haute couture.",
      rarete:
        "La rareté n'est jamais fabriquée : elle est héritée. Le nombre de pièces d'une série est toujours identique au nombre d'exemplaires de l'objet qu'elle célèbre. Aucune réédition.",
      certification:
        "Chaque pièce embarque une puce NFC chiffrée cousue en doublure, liée à l'archive de la Maison.",
      livraison: "Écrin de bois massif, remise en main propre.",
      statut:
        "Aucune série n'est encore ouverte. Accès prioritaire par liste d'attente.",
      pages: {
        accueil: "/",
        "liste-attente": "/collection",
        philosophie: "/philosophie",
      },
    };

    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
