import { defineMcp } from "@lovable.dev/mcp-js";
import listPieces from "./tools/list-pieces";
import getPiece from "./tools/get-piece";
import maisonInfo from "./tools/maison-info";

export default defineMcp({
  name: "atrium-lux",
  title: "Atrium Lux",
  version: "0.1.0",
  instructions:
    "Outils publics de la Maison DIVUS PARIS. `list_pieces` pour parcourir le catalogue, `get_piece` pour la fiche détaillée d'une référence, `maison_info` pour la philosophie, la rareté des séries et la certification NFC.",
  tools: [listPieces, getPiece, maisonInfo],
});
