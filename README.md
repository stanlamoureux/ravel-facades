# Ravel - site façades (démo)

Site vitrine orienté conversion pour une entreprise de ravalement, peinture et nettoyage de façades.
Next.js 16 (App Router) + TypeScript + Tailwind 4 + Motion. Formulaires branchés sur Supabase et Resend.

## Ce qu'il y a dedans

- **Hero photo** : une vraie façade, l'après balaie l'avant au chargement, puis le visiteur bascule lui-même.
- **Prestations** : les trois métiers en photo, trois prestations complémentaires. Aucun prix affiché, chaque carte mène au simulateur.
- **Avant / après** à glisser sur trois chantiers (pavillon, immeuble, maison de bourg).
- **Réalisations** : galerie de façades variées (meulière, longère, contemporain, immeuble ancien).
- **Nuancier sur photo réelle** : la façade est recolorée en direct dans un canvas, ombres et lumière conservées.
- **Estimation masquée** : le visiteur répond à cinq questions, voit un montant flouté, laisse nom, email, téléphone et code postal, et reçoit le chiffre par email. Le prix est calculé sur le serveur, il n'est jamais envoyé au navigateur.
- **Devis en 3 étapes** : validation zod, pot de miel anti-robots, enregistrement Supabase + mail Resend.
- Méthode, avis, zones avec test du code postal, FAQ, mentions légales, confidentialité, image de partage, sitemap.
- Barre d'appel fixe sur mobile, respect de `prefers-reduced-motion`.

## Remplacer les données test

Tout est centralisé dans `src/config/` :

| Fichier | Contenu |
| --- | --- |
| `site.ts` | nom, téléphone, adresse, chiffres, labels, zones, avis |
| `offer.ts` | prestations, choix du simulateur, nuancier (sans prix) |
| `pricing.ts` | grille de prix et calcul de l'estimation (lu par le serveur uniquement) |
| `faq.ts` | questions / réponses |

Les fiches des chantiers avant / après sont en tête de `src/components/BeforeAfter.tsx`, les réalisations en tête de `Gallery.tsx`.

Quand tout est réel, passe `demo: false` dans `site.ts` : ça retire les mentions "exemple", réactive l'indexation Google et publie la note dans les données structurées.

Le numéro 01 99 00 12 34 est dans la plage réservée par l'ARCEP aux fictions : il ne sonne chez personne.

## Photos

Les photos de `public/images` sont des visuels de démonstration générés avec Flux (kie.ai). `scripts/images.mjs` les prépare : recalage des paires avant / après, même ciel sur les deux versions, cadrages, masques du nuancier. Il tourne avant chaque build et ne fait rien si le dossier est complet.

Pour passer aux vraies photos du client : dépose les fichiers dans `public/images` sous les mêmes noms. Pour le nuancier, il faut la photo et son masque (rouge = mur, vert = volets, bleu = porte) ainsi que les constantes en tête de `src/components/Nuancier.tsx`.

## Back-end

- Table `public.facade_leads` dans le projet Supabase "images site vitrine". RLS active : le site peut seulement **ajouter** une ligne (rôle `anon`), personne ne peut lire via l'API. Les demandes se consultent dans le dashboard Supabase. Colonne `status` prévue pour le suivi (nouveau, rappele, visite, devis_envoye, gagne, perdu).
- Mails via Resend, expéditeur `devis@klipt.fr` (domaine vérifié). Clé API à envoi seul, limitée à ce domaine.
- `src/app/api/devis/route.ts` : demande de devis, notification à l'équipe.
- `src/app/api/estimation/route.ts` : estimation du simulateur. Enregistre le lead avec la fourchette, prévient l'équipe et envoie le montant au visiteur. Si l'email au visiteur ne part pas, le montant lui est affiché à l'écran.

## Dev

```bash
npm install
cp .env.example .env.local   # puis remplis les valeurs
npm run dev
```

`npm run images` régénère les visuels à partir des photos sources.
