import { defineMcp } from "@lovable.dev/mcp-js";
import maisonInfo from "./tools/maison-info";

export default defineMcp({
  name: "atrium-lux",
  title: "Atrium Lux",
  version: "0.1.0",
  instructions:
    "Outils publics de la Maison DIVUS PARIS. `maison_info` pour la philosophie, le principe de rareté héritée et la certification NFC. Aucune série n'est encore ouverte.",
  tools: [maisonInfo],
});
