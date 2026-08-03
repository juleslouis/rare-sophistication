/**
 * Documents légaux — libellés FR/EN alignés sur les politiques Shopify.
 * Les contenus sont rédigés dans Shopify et récupérés via l'API Storefront.
 * L'ordre du tableau est l'ordre de lecture officiel de la maison.
 */
export interface LegalDoc {
  handle: string;
  /** Numérotation romaine, pour la mise en page éditoriale. */
  numeral: string;
  fr: string;
  /** Résumé d'une ligne, affiché sur le sommaire. */
  summary: string;
  description: string;
}

export const LEGAL_DOCS: LegalDoc[] = [
  {
    handle: "terms-of-service",
    numeral: "I",
    fr: "Conditions générales de vente",
    summary:
      "Commande, paiement, transfert de propriété et responsabilités de la maison.",
    description:
      "Conditions générales de vente de la maison DIVUS Paris : commandes, paiement, livraison et responsabilités.",
  },
  {
    handle: "privacy-policy",
    numeral: "II",
    fr: "Politique de confidentialité",
    summary:
      "Données collectées, finalités, durée de conservation et exercice de vos droits.",
    description:
      "Politique de confidentialité DIVUS Paris : données collectées, finalités, conservation et droits.",
  },
  {
    handle: "shipping-policy",
    numeral: "III",
    fr: "Livraison",
    summary:
      "Acheminement assuré, délais indicatifs et remise en main propre des pièces.",
    description:
      "Conditions d'expédition et de livraison des pièces DIVUS Paris.",
  },
  {
    handle: "refund-policy",
    numeral: "IV",
    fr: "Retours et remboursements",
    summary:
      "Droit de rétractation, état de restitution et modalités de remboursement.",
    description:
      "Conditions de retour et de remboursement des pièces DIVUS Paris.",
  },
];
