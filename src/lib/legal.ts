/**
 * Documents légaux — libellés FR/EN alignés sur les politiques Shopify.
 * Les contenus sont rédigés dans Shopify et récupérés via l'API Storefront.
 */
export interface LegalDoc {
  handle: string;
  fr: string;
  description: string;
}

export const LEGAL_DOCS: LegalDoc[] = [
  {
    handle: "terms-of-service",
    fr: "Conditions générales de vente",
    description:
      "Conditions générales de vente de la maison DIVUS Paris : commandes, paiement, livraison et responsabilités.",
  },
  {
    handle: "privacy-policy",
    fr: "Politique de confidentialité",
    description:
      "Politique de confidentialité DIVUS Paris : données collectées, finalités, conservation et droits.",
  },
  {
    handle: "shipping-policy",
    fr: "Livraison",
    description:
      "Conditions d'expédition et de livraison des pièces DIVUS Paris.",
  },
  {
    handle: "refund-policy",
    fr: "Retours et remboursements",
    description:
      "Conditions de retour et de remboursement des pièces DIVUS Paris.",
  },
  {
    handle: "subscription-policy",
    fr: "Abonnements",
    description: "Conditions applicables aux abonnements DIVUS Paris.",
  },
];
