# Page privée — Série I

## Objectif
Créer une page de présentation et de confirmation réservée aux personnes autorisées, sans l’exposer publiquement ni publier le paiement.

## À réaliser
- Créer la fiche « Série I » en mode test, au prix de 1 500 €, sans la rendre accessible publiquement.
- Générer un lien secret unique par personne inscrite, révocable et utilisable uniquement après attribution depuis l’administration.
- Afficher la page demandée : bandeau DIVUS, titre, images de matière, quatre phrases exactes, prix, compteur réel, bouton « Confirmer mon inscription » et phrase de fermeture.
- Conserver le nom, le prix, le stock et le contenu côté serveur jusqu’à validation du lien secret afin qu’ils ne figurent pas dans le HTML public, les aperçus sociaux ou les fichiers accessibles aux visiteurs.
- Exclure cette page du plan du site et du référencement, avec blocage des robots et en-têtes `noindex`.
- Préparer le paiement Stripe en mode test avec adresse de livraison et TVA automatique, sans mise en ligne ni envoi d’accès.
- Ajouter dans l’administration les commandes nécessaires pour attribuer ou retirer un accès et suivre le nombre réel de pièces attribuées.

## Résultat attendu
Aucun produit n’apparaît sur le site public. Seul un lien individuel autorisé ouvre « Série I » ; le paiement reste en test jusqu’à votre demande explicite de publication.

## Détails techniques
- Jetons longs stockés sous forme d’empreinte, jamais en clair dans la base.
- Données produit renvoyées uniquement après validation serveur du jeton.
- Page privée non présente dans la navigation, le sitemap, `llms.txt` ou les données structurées.
- Le compteur provient des attributions enregistrées, sans faux sentiment d’urgence.
