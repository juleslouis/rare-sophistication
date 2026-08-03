import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "fr" | "en";

const STORAGE_KEY = "divus-lang";

/**
 * DIVUS — Traductions.
 * Le français est la langue source : chaque clé est la phrase française exacte.
 * Toute chaîne absente du dictionnaire reste affichée en français.
 */
const EN: Record<string, string> = {
  // ——— Navigation & Footer
  "Ouvrir le menu": "Open menu",
  Menu: "Menu",
  "DIVUS Paris — Accueil": "DIVUS Paris — Home",
  Rechercher: "Search",
  Fermer: "Close",
  Accueil: "Home",
  Collection: "Collection",
  Philosophie: "Philosophy",
  Atelier: "Atelier",
  Certification: "Certification",
  Contact: "Contact",
  Maison: "Maison",
  "© MMXXV · Fabricatum in Gallia": "© MMXXV · Fabricatum in Gallia",
  "Certification NFC · AES-128": "NFC certification · AES-128",
  Langue: "Language",

  // ——— Accueil
  "Paris · MMXXV": "Paris · MMXXV",
  "Demander un accès anticipé": "Request early access",
  "La maison": "The Maison",
  "Une maison de collection française. Chaque série sera confectionnée à la main, en nombre dicté, jamais choisi.": "A French collection house. Every series will be hand-crafted, in a number dictated, never chosen.",
  "La philosophie": "The philosophy",
  "Accès anticipé": "Early access",
  "Accès": "Access",
  "Liste d'attente": "Waitlist",
  "Une première série arrive.": "A first series is coming.",
  "DIVUS est une maison de collection française. La rareté n'y est jamais fabriquée : elle est héritée. Le nombre de pièces d'une série sera toujours identique au nombre d'exemplaires de l'objet qu'elle célèbre. Rien ne sera réédité.": "DIVUS is a French collection house. Rarity here is never manufactured: it is inherited. The number of pieces in a series will always match the number of examples of the object it celebrates. Nothing will ever be reissued.",
  "Adresse e-mail": "Email address",
  "S'inscrire": "Sign up",
  "Adresse e-mail invalide.": "Invalid email address.",
  "Adresse trop longue.": "Address too long.",
  "Inscription enregistrée. Vous disposerez d'un accès prioritaire à l'ouverture — aucune communication superflue avant cela.": "You are on the list. You will have priority access at opening — no unnecessary communication before then.",
  "La rareté héritée.": "Rarity, inherited.",
  "Découvrir la collection": "Discover the collection",
  "Les pièces du moment": "Pieces of the moment",
  "Édition Primus.": "Primus edition.",
  "Voir toute la collection": "View the entire collection",
  Signature: "Signature",
  "La rareté n'est jamais créée —": "Rarity is never created —",
  "elle est héritée.": "it is inherited.",
  Charbon: "Charcoal",
  Travertin: "Travertine",
  Cyprès: "Cypress",
  Terre: "Earth",

  // ——— Collection
  "Trouver une pièce": "Find a piece",
  "Rechercher par édition, matière ou référence":
    "Search by edition, material or reference",
  Toutes: "All",
  "Éditions en cours": "Current editions",
  Archives: "Archives",
  "pièces disponibles.": "pieces available.",
  "pièce disponible.": "piece available.",
  "Aucune pièce ne correspond.": "No piece matches.",
  "Essayez « Drop III » ou « Cyprès ».": "Try “Drop III” or “Cypress”.",
  "Note de la maison": "A note from the Maison",
  "Chaque pièce est confectionnée à la main en atelier de haute couture parisien.":
    "Every piece is hand-crafted in a Parisian haute couture atelier.",
  "La rareté n'est jamais créée — elle est héritée.":
    "Rarity is never created — it is inherited.",
  "Sold out": "Sold out",
  "En cours": "In production",
  "Sur liste": "By request",
  "Édition fondatrice": "Founding edition",
  Horlogerie: "Watchmaking",
  "À révéler": "To be revealed",

  // ——— Philosophie
  "DIVUS est une maison de collection française. Chaque édition est confectionnée à la main dans un atelier de haute couture parisien, en séries strictement numérotées, chacune scellée par une puce NFC chiffrée.":
    "DIVUS is a French collection house. Every edition is hand-crafted in a Parisian haute couture atelier, in strictly numbered series, each sealed with an encrypted NFC chip.",
  "L'atelier": "The atelier",
  "Fabricatum in Gallia.": "Fabricatum in Gallia.",
  "Atelier haute couture parisien": "Parisian haute couture atelier",
  "Chaque pièce naît d'un atelier de haute couture parisien. Les coutures chevauchées sont exécutées au fil doré. Les finitions demandent quarante heures de main d'œuvre.":
    "Every piece is born in a Parisian haute couture atelier. The overlapping seams are executed in gilded thread. The finishings require forty hours of handwork.",
  "Cette lenteur n'est pas un choix : c'est une contrainte que nous refusons de contourner.":
    "This slowness is not a choice: it is a constraint we refuse to circumvent.",
  "Rareté contractuelle": "Contractual rarity",
  "Le nombre est dicté, jamais choisi.": "The number is dictated, never chosen.",
  "Pièce Primus — Travertin": "Primus piece — Travertine",
  "Chaque série DIVUS célèbre un objet existant, documenté publiquement. Le nombre de pièces produites répond exactement au nombre d'exemplaires du sujet hommagé.":
    "Each DIVUS series celebrates an existing, publicly documented object. The number of pieces produced matches exactly the number of examples of the subject honoured.",
  "Ce principe rend impossible toute réédition. Il transforme chaque pièce en pièce d'archive dès sa livraison.":
    "This principle makes any reissue impossible. It turns every piece into an archive piece from the moment it is delivered.",
  "Une identité chiffrée.": "An encrypted identity.",
  "Une puce NFC NTAG424 DNA non clonable, chiffrement AES-128, est cousue dans la doublure de chaque pièce. Elle atteste de l'origine, de la série et du numéro individuel — et inscrit l'objet dans une archive vérifiable et transmissible.":
    "A non-clonable NTAG424 DNA NFC chip, AES-128 encryption, is sewn into the lining of every piece. It attests to the origin, the series and the individual number — and inscribes the object in a verifiable, transmissible archive.",
  Approchez: "Come closer",
  "Placez votre téléphone à moins de deux centimètres de la doublure. La puce s'active sans contact, sans application.":
    "Hold your phone less than two centimetres from the lining. The chip activates contactlessly, with no application.",
  "Lecture chiffrée": "Encrypted reading",
  "Chaque lecture génère une signature unique (AES-128 · SUN). Aucune donnée n'est copiable, aucune session n'est rejouable.":
    "Every read generates a unique signature (AES-128 · SUN). No data can be copied, no session can be replayed.",
  "Archive Maison": "Maison archive",
  "Le certificat s'ouvre sur nos serveurs, horodaté. La provenance de la pièce est inscrite dans notre registre privé.":
    "The certificate opens on our servers, timestamped. The provenance of the piece is inscribed in our private register.",
  Éditions: "Editions",
  "Trois séries, une seule maison.": "Three series, a single Maison.",
  Série: "Series",
  "L'édition fondatrice. Point de départ, sans partenaire, se légitime par elle-même.":
    "The founding edition. A point of departure, without partner, legitimised by itself.",
  "Le savoir-faire. Une collaboration avec un horloger indépendant français, à tirage documenté.":
    "The savoir-faire. A collaboration with an independent French watchmaker, in a documented run.",
  "L'hommage. 963 exemplaires, en écho au flagship célébré. Livraison MMXXVI.":
    "The homage. 963 examples, echoing the flagship celebrated. Delivery MMXXVI.",
  "Pour les demandes de cercle privé, de presse ou d'archives.":
    "For private circle, press or archive enquiries.",

  // ——— NFC
  "Simulateur de scan NFC": "NFC scan simulator",
  "Lecture en cours…": "Reading…",
  Authentifié: "Authenticated",
  "En attente d'un contact": "Awaiting contact",
  "Rejouer le scan": "Replay the scan",
  "Approcher la pièce": "Bring the piece closer",
  Réinitialiser: "Reset",
  "Certificat · Aperçu": "Certificate · Preview",
  "Déchiffrement du contenu chiffré AES-128…":
    "Decrypting AES-128 encrypted content…",
  "Le certificat s'affichera après lecture de la puce.":
    "The certificate will appear once the chip has been read.",
  "— CERTIFICAT D'AUTHENTICITÉ —": "— CERTIFICATE OF AUTHENTICITY —",
  "Série       : DROP III · SVJ · ULTIMA":
    "Series      : DROP III · SVJ · ULTIMA",
  "Référence   : DVS-III-963-II": "Reference   : DVS-III-963-II",
  "Numéro      : 042 / 963": "Number      : 042 / 963",
  "Matière     : Cachemire · Supima 400 g/m²":
    "Material    : Cashmere · Supima 400 g/m²",
  "Coloris     : Charbon": "Colour      : Charcoal",
  "Atelier     : Paris, VIIIᵉ": "Atelier     : Paris, VIIIth",
  "Année       : MMXXVI": "Year        : MMXXVI",
  "Puce        : NTAG424 DNA": "Chip        : NTAG424 DNA",
  "Chiffrement : AES-128 · SUN": "Encryption  : AES-128 · SUN",
  "Vérifié · Inscrit à l'archive Maison.":
    "Verified · Inscribed in the Maison archive.",

  // ——— Page pièce
  "Pièce introuvable": "Piece not found",
  "Cette référence n'appartient à aucune édition de la Maison.":
    "This reference belongs to no edition of the Maison.",
  "Retour à la collection": "Back to the collection",
  Édition: "Edition",
  exemplaires: "examples",
  Matière: "Material",
  Statut: "Status",
  Prix: "Price",
  "Édition épuisée": "Edition sold out",
  "Rejoindre la liste": "Join the list",
  "Demander cette pièce": "Request this piece",
  "Prendre rendez-vous à Paris": "Book an appointment in Paris",
  Hommage: "Homage",
  "Fiche technique": "Specifications",
  "Précision de la Maison": "Precision of the Maison",
  "Chaque pièce est confectionnée à la main dans notre atelier parisien. Le grammage, la doublure, le fil, la coupe — chaque paramètre est consigné et gravé sur la puce de certification.":
    "Every piece is hand-crafted in our Parisian atelier. The weight, the lining, the thread, the cut — every parameter is recorded and engraved on the certification chip.",
  "Une pièce, une identité, une trace.": "One piece, one identity, one trace.",
  "Chaque exemplaire porte une puce NFC chiffrée, cousue dans la doublure. Elle atteste de la référence, du numéro d'édition, de la date de confection et du nom de son premier propriétaire.":
    "Every example carries an encrypted NFC chip, sewn into the lining. It attests to the reference, the edition number, the date of making and the name of its first owner.",
  "La pièce peut être transmise. La certification, elle, ne s'efface pas.":
    "The piece can be passed on. The certification never fades.",
  "Dans la même série": "In the same series",
  "Voir la collection": "View the collection",
  // ——— Données pièces
  "Cachemire · Supima": "Cashmere · Supima",
  "Cachemire · Supima · 380 g/m²": "Cashmere · Supima · 380 g/m²",
  "Cachemire · Supima · 390 g/m²": "Cashmere · Supima · 390 g/m²",
  "Cachemire · Supima · 400 g/m²": "Cashmere · Supima · 400 g/m²",
  Composition: "Composition",
  Coloris: "Colour",
  Confection: "Making",
  "Atelier haute couture, Paris": "Haute couture atelier, Paris",
  "Puce NFC chiffrée, cousue en doublure":
    "Encrypted NFC chip, sewn into the lining",
  Année: "Year",
  Livraison: "Delivery",
  "Écrin de bois massif, main propre":
    "Solid wood case, hand-delivered",
  "La première pièce de la Maison. Coupe oversized, épaules tombées, coutures rabattues à la main. Une déclaration silencieuse — la genèse d'un vocabulaire.":
    "The Maison's first piece. Oversized cut, dropped shoulders, hand-folded seams. A silent statement — the genesis of a vocabulary.",
  "Déclinaison claire de l'édition fondatrice. Le travertin, patiné, absorbe la lumière comme la pierre romaine dont il tire son nom.":
    "The pale variation of the founding edition. Travertine, patinated, absorbs light like the Roman stone it takes its name from.",
  "Un vert profond, hérité des cadrans d'horlogerie viennoise. La matière tombe droite, sans effort — comme une aiguille qui trouve sa seconde.":
    "A deep green, inherited from Viennese watch dials. The fabric falls straight, effortlessly — like a hand finding its second.",
  "Terre cuite, brûlée par le temps. Une chaleur mate qui rappelle le cuir des bracelets patinés par des décennies de poignets.":
    "Terracotta, burnt by time. A matte warmth recalling straps patinated by decades of wrists.",
  "963 exemplaires, comme les 963 chevaux du moteur. Un hommage à la mécanique italienne, coulé dans la douceur du cachemire parisien.":
    "963 examples, as the engine's 963 horses. A homage to Italian mechanics, cast in the softness of Parisian cashmere.",
  "Le charbon profond du Drop III — absolue matité, presque une absence. La pièce se lit à la main, jamais à l'œil.":
    "The deep charcoal of Drop III — absolute matteness, almost an absence. The piece is read by hand, never by eye.",
  "Vert cyprès, hommage aux jardins de la Villa d'Este. Une pièce contemplative, taillée pour la lumière méridionale.":
    "Cypress green, a homage to the gardens of Villa d'Este. A contemplative piece, cut for southern light.",
  "Terre profonde et minérale, presque bronze. La dernière déclinaison du Drop III, réservée aux commandes tardives.":
    "Deep, mineral earth, almost bronze. The final variation of Drop III, reserved for late orders.",
  "L'édition suivante ne sera pas annoncée. Elle sera reçue — par lettre, en écrin scellé.":
    "The next edition will not be announced. It will be received — by letter, in a sealed case.",
  Vue: "View",

  // ——— Panier
  Panier: "Cart",
  "Votre sélection": "Your selection",
  "Votre sélection est vide": "Your selection is empty",
  "Aucune pièce dans votre sélection": "No piece in your selection",
  pièce: "piece",
  pièces: "pieces",
  sélectionnée: "selected",
  Total: "Total",
  "Procéder au paiement": "Proceed to payment",
  "Paiement sécurisé par Shopify": "Secure payment by Shopify",
  "Ajouter à ma sélection": "Add to my selection",
  "Ajouter au panier": "Add to cart",
  "Supprimer de la sélection": "Remove from selection",
  Quantité: "Quantity",
  "Continuer mes achats": "Continue shopping",
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (fr: string) => string;
};

const LangContext = createContext<Ctx>({
  lang: "fr",
  setLang: () => {},
  t: (fr) => fr,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "fr") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const t = useCallback(
    (fr: string) => {
      if (lang !== "en") return fr;
      const direct = EN[fr];
      if (direct) return direct;
      // Chaînes dynamiques (ex. « 963 exemplaires numérotés »)
      const numbered = fr.match(/^(\d+) exemplaires numérotés$/);
      if (numbered) return `${numbered[1]} numbered examples`;
      return fr;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
