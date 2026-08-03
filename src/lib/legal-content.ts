/**
 * Contenu des documents légaux — rédigé par la maison, bilingue FR/EN.
 * Structure éditoriale : chaque document est une suite de sections numérotées,
 * composées de paragraphes et, si nécessaire, d'une liste de points.
 *
 * Ces textes remplacent les politiques génériques Shopify afin de tenir un ton
 * et une mise en page uniformes. À faire relire par un conseil juridique avant
 * l'ouverture des ventes.
 */

export interface LegalSection {
  title: { fr: string; en: string };
  paragraphs?: { fr: string; en: string }[];
  bullets?: { fr: string; en: string }[];
}

export const LEGAL_UPDATED = { fr: "Août 2026", en: "August 2026" };

export const LEGAL_CONTENT: Record<string, LegalSection[]> = {
  "terms-of-service": [
    {
      title: { fr: "Objet", en: "Purpose" },
      paragraphs: [
        {
          fr: "Les présentes conditions générales régissent la relation entre DIVUS Paris, maison de collection française, et toute personne consultant le site maisondivus.com ou passant commande d'une pièce. Toute commande implique leur acceptation sans réserve.",
          en: "These general conditions govern the relationship between DIVUS Paris, a French collection house, and any person browsing maisondivus.com or ordering a piece. Placing an order implies their unreserved acceptance.",
        },
      ],
    },
    {
      title: { fr: "Les pièces", en: "The pieces" },
      paragraphs: [
        {
          fr: "Chaque série est produite en un nombre d'exemplaires strictement égal au nombre d'exemplaires de l'objet qu'elle célèbre. Aucune série n'est rééditée. Les visuels, matières et finitions sont présentés avec la plus grande exactitude ; de légères variations, propres au travail de la main, ne constituent pas un défaut.",
          en: "Each series is produced in a number of examples strictly equal to the number of examples of the object it celebrates. No series is ever reissued. Visuals, materials and finishes are presented as accurately as possible; slight variations inherent to handwork do not constitute a defect.",
        },
      ],
    },
    {
      title: { fr: "Commande et disponibilité", en: "Orders and availability" },
      paragraphs: [
        {
          fr: "Avant l'ouverture des ventes, seule l'inscription à la liste d'attente est possible : elle ne constitue ni une commande, ni une réservation, ni un engagement d'achat. À l'ouverture, une commande n'est ferme qu'après confirmation écrite de la maison et encaissement du prix.",
          en: "Before sales open, only registration on the waiting list is possible: it constitutes neither an order, nor a reservation, nor a purchase commitment. Once sales open, an order becomes firm only after written confirmation from the maison and receipt of payment.",
        },
        {
          fr: "La maison se réserve le droit de refuser une commande en cas d'indisponibilité, de soupçon de revente spéculative ou d'anomalie de paiement.",
          en: "The maison reserves the right to decline an order in the event of unavailability, suspected speculative resale or a payment irregularity.",
        },
      ],
    },
    {
      title: { fr: "Prix et paiement", en: "Prices and payment" },
      paragraphs: [
        {
          fr: "Les prix sont indiqués en euros, toutes taxes comprises pour l'Union européenne, hors frais d'acheminement affichés avant validation. Le paiement s'effectue par les moyens sécurisés proposés lors du règlement ; aucune donnée bancaire n'est conservée par la maison.",
          en: "Prices are shown in euros, inclusive of tax for the European Union, excluding shipping costs displayed before validation. Payment is made through the secure methods offered at checkout; no card data is retained by the maison.",
        },
      ],
    },
    {
      title: { fr: "Transfert de propriété", en: "Transfer of ownership" },
      paragraphs: [
        {
          fr: "La propriété est transférée après encaissement intégral du prix. Les risques sont transférés à la remise de la pièce entre les mains du destinataire.",
          en: "Ownership transfers upon full receipt of payment. Risk transfers when the piece is handed over to the recipient.",
        },
      ],
    },
    {
      title: { fr: "Garanties", en: "Warranties" },
      paragraphs: [
        {
          fr: "L'acheteur bénéficie de la garantie légale de conformité et de la garantie contre les vices cachés prévues par le droit français. La certification NFC de chaque pièce demeure active et vérifiable ; sa dégradation par une intervention extérieure n'est pas couverte.",
          en: "The buyer benefits from the statutory warranty of conformity and the warranty against hidden defects provided by French law. The NFC certification of each piece remains active and verifiable; damage caused by outside intervention is not covered.",
        },
      ],
    },
    {
      title: { fr: "Droit applicable", en: "Governing law" },
      paragraphs: [
        {
          fr: "Les présentes conditions sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en écrivant à contact@maisondivus.com avant toute action judiciaire.",
          en: "These conditions are governed by French law. In the event of a dispute, an amicable solution will be sought by writing to contact@maisondivus.com before any legal action.",
        },
      ],
    },
  ],

  "privacy-policy": [
    {
      title: { fr: "Responsable du traitement", en: "Data controller" },
      paragraphs: [
        {
          fr: "DIVUS Paris est responsable du traitement des données collectées sur maisondivus.com. Toute demande relative à vos données peut être adressée à contact@maisondivus.com.",
          en: "DIVUS Paris is the controller of the data collected on maisondivus.com. Any request concerning your data may be sent to contact@maisondivus.com.",
        },
      ],
    },
    {
      title: { fr: "Données collectées", en: "Data collected" },
      bullets: [
        {
          fr: "Liste d'attente : adresse e-mail, langue d'affichage, date d'inscription.",
          en: "Waiting list: email address, display language, registration date.",
        },
        {
          fr: "Preuve de consentement : texte accepté, version, horodatage, adresse IP et navigateur.",
          en: "Consent record: text accepted, version, timestamp, IP address and browser.",
        },
        {
          fr: "Commande, le cas échéant : identité, adresses de facturation et de livraison, historique d'achat.",
          en: "Order, where applicable: identity, billing and delivery addresses, purchase history.",
        },
        {
          fr: "Mesure d'audience : données de fréquentation agrégées, sans profilage publicitaire.",
          en: "Audience measurement: aggregated traffic data, with no advertising profiling.",
        },
      ],
    },
    {
      title: { fr: "Finalités et bases légales", en: "Purposes and legal bases" },
      paragraphs: [
        {
          fr: "Les données de la liste d'attente sont traitées sur la base de votre consentement explicite, recueilli par une case à cocher. Les données de commande sont traitées pour l'exécution du contrat et le respect des obligations comptables. La mesure d'audience répond à l'intérêt légitime d'améliorer le site.",
          en: "Waiting-list data is processed on the basis of your explicit consent, collected through a checkbox. Order data is processed to perform the contract and meet accounting obligations. Audience measurement rests on the legitimate interest of improving the site.",
        },
      ],
    },
    {
      title: { fr: "Destinataires", en: "Recipients" },
      paragraphs: [
        {
          fr: "Les données sont hébergées et traitées par nos prestataires techniques : hébergement du site et de la base de données, plateforme de commerce et de gestion clients, service d'envoi d'e-mails, mesure d'audience. Aucune donnée n'est vendue ni cédée à des fins publicitaires.",
          en: "Data is hosted and processed by our technical providers: site and database hosting, commerce and customer-management platform, email delivery service, audience measurement. No data is sold or transferred for advertising purposes.",
        },
      ],
    },
    {
      title: { fr: "Conservation", en: "Retention" },
      paragraphs: [
        {
          fr: "Les inscriptions à la liste d'attente sont conservées jusqu'au retrait du consentement, et au plus trois ans après le dernier contact. Les documents comptables liés à une commande sont conservés dix ans, conformément à la loi.",
          en: "Waiting-list registrations are kept until consent is withdrawn, and no longer than three years after the last contact. Accounting records relating to an order are kept for ten years, as required by law.",
        },
      ],
    },
    {
      title: { fr: "Vos droits", en: "Your rights" },
      paragraphs: [
        {
          fr: "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité, ainsi que du droit de retirer votre consentement à tout moment. Une demande adressée à contact@maisondivus.com est traitée dans un délai d'un mois. Vous pouvez saisir la CNIL en cas de désaccord.",
          en: "You have the right to access, rectify, erase, restrict, object and port your data, as well as the right to withdraw your consent at any time. A request sent to contact@maisondivus.com is handled within one month. You may refer the matter to the CNIL in case of disagreement.",
        },
      ],
    },
    {
      title: { fr: "Cookies", en: "Cookies" },
      paragraphs: [
        {
          fr: "Le site n'utilise que les cookies nécessaires à son fonctionnement et, le cas échéant, à la mesure d'audience. Aucun cookie publicitaire tiers n'est déposé.",
          en: "The site uses only the cookies necessary for its operation and, where applicable, for audience measurement. No third-party advertising cookies are set.",
        },
      ],
    },
  ],

  "shipping-policy": [
    {
      title: { fr: "Préparation", en: "Preparation" },
      paragraphs: [
        {
          fr: "Chaque pièce est contrôlée, numérotée et appairée à sa certification avant expédition. Ce contrôle demande deux à cinq jours ouvrés après confirmation de la commande ; il n'est jamais abrégé.",
          en: "Each piece is inspected, numbered and paired with its certification before dispatch. This inspection takes two to five business days after order confirmation; it is never shortened.",
        },
      ],
    },
    {
      title: { fr: "Acheminement", en: "Shipping" },
      bullets: [
        {
          fr: "France : deux à trois jours ouvrés, remise contre signature.",
          en: "France: two to three business days, delivery against signature.",
        },
        {
          fr: "Union européenne : trois à six jours ouvrés, remise contre signature.",
          en: "European Union: three to six business days, delivery against signature.",
        },
        {
          fr: "Reste du monde : cinq à dix jours ouvrés, selon les formalités douanières.",
          en: "Rest of the world: five to ten business days, subject to customs formalities.",
        },
      ],
      paragraphs: [
        {
          fr: "Les envois sont assurés à hauteur de la valeur de la pièce et suivis de bout en bout. Un numéro de suivi est communiqué au départ.",
          en: "Shipments are insured for the full value of the piece and tracked end to end. A tracking number is provided at dispatch.",
        },
      ],
    },
    {
      title: { fr: "Emballage", en: "Packaging" },
      paragraphs: [
        {
          fr: "La pièce voyage dans son écrin de maison, sous scellé. Un scellé rompu à la réception doit être signalé au transporteur et à la maison dans les quarante-huit heures.",
          en: "The piece travels in its house case, under seal. A seal broken on arrival must be reported to the carrier and to the maison within forty-eight hours.",
        },
      ],
    },
    {
      title: { fr: "Droits et taxes", en: "Duties and taxes" },
      paragraphs: [
        {
          fr: "Hors Union européenne, les droits de douane et taxes locales restent à la charge du destinataire et sont exigibles à la livraison.",
          en: "Outside the European Union, customs duties and local taxes remain payable by the recipient and are due on delivery.",
        },
      ],
    },
    {
      title: { fr: "Remise en main propre", en: "Hand delivery" },
      paragraphs: [
        {
          fr: "Pour certaines séries, une remise en main propre à Paris peut être organisée sur demande écrite à contact@maisondivus.com.",
          en: "For certain series, hand delivery in Paris can be arranged on written request to contact@maisondivus.com.",
        },
      ],
    },
  ],

  "refund-policy": [
    {
      title: { fr: "Droit de rétractation", en: "Right of withdrawal" },
      paragraphs: [
        {
          fr: "Pour tout achat à distance, vous disposez de quatorze jours à compter de la réception pour renoncer à votre commande, sans motif à fournir. La demande s'effectue par écrit à contact@maisondivus.com, qui délivre une autorisation de retour.",
          en: "For any distance purchase, you have fourteen days from receipt to withdraw from your order, without giving a reason. Requests are made in writing to contact@maisondivus.com, which issues a return authorisation.",
        },
      ],
    },
    {
      title: { fr: "État de restitution", en: "Condition on return" },
      bullets: [
        {
          fr: "Pièce non portée, non altérée, sans trace d'usage.",
          en: "Piece unworn, unaltered, with no signs of use.",
        },
        {
          fr: "Écrin, certification NFC et documents d'origine complets.",
          en: "Case, NFC certification and original documents complete.",
        },
        {
          fr: "Autorisation de retour jointe à l'envoi.",
          en: "Return authorisation enclosed with the shipment.",
        },
      ],
      paragraphs: [
        {
          fr: "Une pièce gravée, personnalisée ou dont la certification a été désappairée ne peut être reprise.",
          en: "A piece that has been engraved, personalised, or whose certification has been unpaired cannot be taken back.",
        },
      ],
    },
    {
      title: { fr: "Retour", en: "Return shipment" },
      paragraphs: [
        {
          fr: "Le retour voyage assuré, sous la responsabilité de l'expéditeur jusqu'à réception par la maison. Les frais de retour sont à votre charge, sauf pièce non conforme ou endommagée, auquel cas la maison les prend intégralement en charge.",
          en: "Returns travel insured, at the sender's risk until received by the maison. Return costs are yours, except for a non-conforming or damaged piece, in which case the maison covers them in full.",
        },
      ],
    },
    {
      title: { fr: "Remboursement", en: "Refund" },
      paragraphs: [
        {
          fr: "Après contrôle de la pièce, le remboursement est effectué sous quatorze jours par le moyen de paiement d'origine, frais d'acheminement initiaux inclus au tarif standard.",
          en: "After inspection of the piece, the refund is issued within fourteen days to the original payment method, including the initial standard shipping cost.",
        },
      ],
    },
    {
      title: { fr: "Pièce endommagée", en: "Damaged piece" },
      paragraphs: [
        {
          fr: "Toute anomalie constatée à la réception doit être signalée dans les quarante-huit heures, photographies à l'appui. La maison propose alors la réparation, l'échange dans la limite des exemplaires disponibles, ou le remboursement.",
          en: "Any issue noted on receipt must be reported within forty-eight hours, with photographs. The maison will then offer repair, exchange within the limits of available examples, or a refund.",
        },
      ],
    },
  ],
};
