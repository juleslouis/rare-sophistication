# Déplacer le DNS de maisondivus.com vers Cloudflare (manuel, guidé)

Objectif : pouvoir créer les deux enregistrements NS de `notify.maisondivus.com` (impossibles chez Hostinger), débloquer la vérification du domaine d'envoi d'e-mails et lancer la séquence d'e-mails de la waitlist.

## Vos étapes (chez Cloudflare — compte gratuit)

1. Créez un compte sur **cloudflare.com** (offre **Free**, carte bancaire non requise).
2. Depuis le tableau de bord : **Add a domain** (Ajouter un site) → saisissez `maisondivus.com` → choisissez le plan **Free**.
3. Cloudflare scanne vos enregistrements existants et vous les montre. Vérifiez que les enregistrements de `maisondivus.com` et `www` (vers le site) apparaissent, puis validez. Ne touchez à rien d'autre à cette étape.
4. Cloudflare vous attribue **deux serveurs de noms** (de la forme `xxxx.ns.cloudflare.com` — les vôtres, pas ceux d'un exemple). Notez-les.

## Vos étapes (chez Hostinger)

5. Hostinger → **Domaines** → `maisondivus.com` → **DNS / Serveurs de noms**.
6. Remplacez les serveurs de noms actuels (`pixel.dns-parking.com` / `byte.dns-parking.com`) par les **deux serveurs Cloudflare** notés à l'étape 4. Attention : ici on change les **serveurs de noms du domaine** (champ "Nameservers"), pas un enregistrement DNS — c'est différent des NS de `notify` qui étaient impossibles à créer.
7. Revenez dans Cloudflare et cliquez sur **Check nameservers** / **Done**. L'activation prend généralement de quelques minutes à quelques heures (Cloudflare envoie un e-mail quand c'est actif).

## Vos étapes (retour dans Cloudflare, une fois le site "Active")

8. Cloudflare → `maisondivus.com` → **DNS** → **Records** → **Add record**, deux fois :
   - Type `NS`, Name `notify`, Nameserver `ns3.lovable.cloud`
   - Type `NS`, Name `notify`, Nameserver `ns4.lovable.cloud`
9. Vérifiez que l'enregistrement TXT existe toujours (normalement repris automatiquement lors du scan) :
   - Type `TXT`, Name `_lovable-email`, Content `lovable_email_verify=ee22771038e22032b062a89c823af3e3a4ee893a02d16339d6c78fdf56bc67b8`
   - S'il manque, ajoutez-le avec ces valeurs exactes.

## De mon côté (après vos étapes)

1. Vérifier publiquement que les deux NS de `notify.maisondivus.com` et le TXT sont visibles.
2. Relancer la vérification du domaine d'expédition (Cloud → Emails → Retry setup côté réglages).
3. Confirmer que la séquence d'e-mails repart automatiquement : confirmation immédiate, Indice n°1 à 18 jours, Indice n°2 à 32 jours.

## Points d'attention

- Le site publié (`maisondivus.com` / `www`) reste en ligne pendant toute l'opération : changer de serveurs de noms ne fait que déplacer la gestion du DNS, les enregistrements pointant vers le site sont repris par Cloudflare.
- Aucune downtime attendu ; propagation jusqu'à quelques heures pour l'activation Cloudflare.
- Ne rien ajouter d'autre dans la zone Cloudflare : SPF/DKIM/DMARC de `notify` sont gérés automatiquement par Lovable une fois la délégation en place.
