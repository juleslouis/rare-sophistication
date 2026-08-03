import piece01 from "@/assets/piece-01.jpg";
import piece02 from "@/assets/piece-02.jpg";
import piece03 from "@/assets/piece-03.jpg";
import piece04 from "@/assets/piece-04.jpg";

export type Piece = {
  ref: string;
  serie: string;
  drop: "I" | "II" | "III";
  hommage: string;
  matiere: string;
  couleur: string;
  edition: number;
  prix: number;
  statut: "Sold out" | "En cours" | "Sur liste";
  image: string;
  gallery: string[];
  year: string;
  description: string;
  details: { label: string; value: string }[];
  shopifyHandle?: string;
};

const baseDetails = (p: {
  matiere: string;
  couleur: string;
  edition: number;
  year: string;
  hommage: string;
}) => [
  { label: "Composition", value: p.matiere },
  { label: "Coloris", value: p.couleur },
  {
    label: "Édition",
    value: p.edition > 0 ? `${p.edition} exemplaires numérotés` : "À révéler",
  },
  { label: "Hommage", value: p.hommage },
  { label: "Confection", value: "Atelier haute couture, Paris" },
  { label: "Certification", value: "Puce NFC chiffrée, cousue en doublure" },
  { label: "Année", value: p.year },
  { label: "Livraison", value: "Écrin de bois massif, main propre" },
];

export const PIECES: Piece[] = [
  {
    ref: "DVS-I-100",
    serie: "Drop I",
    drop: "I",
    hommage: "Édition fondatrice",
    matiere: "Cachemire · Supima · 380 g/m²",
    couleur: "Charbon",
    edition: 100,
    prix: 1300,
    statut: "Sold out",
    image: piece01,
    gallery: [piece01, piece02, piece03, piece04],
    year: "MMXXV",
    description:
      "La première pièce de la Maison. Coupe oversized, épaules tombées, coutures rabattues à la main. Une déclaration silencieuse — la genèse d'un vocabulaire.",
    details: [],
    shopifyHandle: "drop-i-charbon",
  },
  {
    ref: "DVS-I-100-IV",
    serie: "Drop I",
    drop: "I",
    hommage: "Édition fondatrice",
    matiere: "Cachemire · Supima · 380 g/m²",
    couleur: "Travertin",
    edition: 100,
    prix: 1300,
    statut: "Sold out",
    image: piece02,
    gallery: [piece02, piece01, piece04, piece03],
    year: "MMXXV",
    description:
      "Déclinaison claire de l'édition fondatrice. Le travertin, patiné, absorbe la lumière comme la pierre romaine dont il tire son nom.",
    details: [],
    shopifyHandle: "drop-i-travertin",
  },
  {
    ref: "DVS-II-250-C",
    serie: "Drop II",
    drop: "II",
    hommage: "Horlogerie",
    matiere: "Cachemire · Supima · 390 g/m²",
    couleur: "Cyprès",
    edition: 250,
    prix: 1400,
    statut: "Sold out",
    image: piece03,
    gallery: [piece03, piece04, piece01, piece02],
    year: "MMXXV",
    description:
      "Un vert profond, hérité des cadrans d'horlogerie viennoise. La matière tombe droite, sans effort — comme une aiguille qui trouve sa seconde.",
    details: [],
    shopifyHandle: "drop-ii-cypres",
  },
  {
    ref: "DVS-II-250-T",
    serie: "Drop II",
    drop: "II",
    hommage: "Horlogerie",
    matiere: "Cachemire · Supima · 390 g/m²",
    couleur: "Terre",
    edition: 250,
    prix: 1400,
    statut: "Sold out",
    image: piece04,
    gallery: [piece04, piece03, piece02, piece01],
    year: "MMXXV",
    description:
      "Terre cuite, brûlée par le temps. Une chaleur mate qui rappelle le cuir des bracelets patinés par des décennies de poignets.",
    details: [],
    shopifyHandle: "drop-ii-terre",
  },
  {
    ref: "DVS-III-963-I",
    serie: "Drop III",
    drop: "III",
    hommage: "Lamborghini SVJ",
    matiere: "Cachemire · Supima · 400 g/m²",
    couleur: "Travertin",
    edition: 963,
    prix: 1490,
    statut: "En cours",
    image: piece02,
    gallery: [piece02, piece01, piece04, piece03],
    year: "MMXXVI",
    description:
      "963 exemplaires, comme les 963 chevaux du moteur. Un hommage à la mécanique italienne, coulé dans la douceur du cachemire parisien.",
    details: [],
    shopifyHandle: "drop-iii-travertin",
  },
  {
    ref: "DVS-III-963-II",
    serie: "Drop III",
    drop: "III",
    hommage: "Lamborghini SVJ",
    matiere: "Cachemire · Supima · 400 g/m²",
    couleur: "Charbon",
    edition: 963,
    prix: 1490,
    statut: "En cours",
    image: piece01,
    gallery: [piece01, piece02, piece03, piece04],
    year: "MMXXVI",
    description:
      "Le charbon profond du Drop III — absolue matité, presque une absence. La pièce se lit à la main, jamais à l'œil.",
    details: [],
    shopifyHandle: "drop-iii-charbon",
  },
  {
    ref: "DVS-III-963-III",
    serie: "Drop III",
    drop: "III",
    hommage: "Lamborghini SVJ",
    matiere: "Cachemire · Supima · 400 g/m²",
    couleur: "Cyprès",
    edition: 963,
    prix: 1490,
    statut: "En cours",
    image: piece03,
    gallery: [piece03, piece04, piece01, piece02],
    year: "MMXXVI",
    description:
      "Vert cyprès, hommage aux jardins de la Villa d'Este. Une pièce contemplative, taillée pour la lumière méridionale.",
    details: [],
    shopifyHandle: "drop-iii-cypres",
  },
  {
    ref: "DVS-III-963-IV",
    serie: "Drop III",
    drop: "III",
    hommage: "Lamborghini SVJ",
    matiere: "Cachemire · Supima · 400 g/m²",
    couleur: "Terre",
    edition: 963,
    prix: 1490,
    statut: "En cours",
    image: piece04,
    gallery: [piece04, piece03, piece02, piece01],
    year: "MMXXVI",
    description:
      "Terre profonde et minérale, presque bronze. La dernière déclinaison du Drop III, réservée aux commandes tardives.",
    details: [],
    shopifyHandle: "drop-iii-terre",
  },
  {
    ref: "DVS-IV",
    serie: "Drop IV",
    drop: "III",
    hommage: "À révéler",
    matiere: "—",
    couleur: "—",
    edition: 0,
    prix: 0,
    statut: "Sur liste",
    image: piece02,
    gallery: [piece02],
    year: "MMXXVI",
    description:
      "L'édition suivante ne sera pas annoncée. Elle sera reçue — par lettre, en écrin scellé.",
    details: [],
  },
].map((p) => ({ ...p, details: baseDetails(p) })) as Piece[];

export const findPiece = (ref: string) => PIECES.find((p) => p.ref === ref);
