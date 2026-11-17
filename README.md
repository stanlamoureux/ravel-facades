# Ravel - site façades (démo)

Site vitrine orienté conversion pour une entreprise de nettoyage, ravalement et peinture de façades.
Next.js 16 (App Router) + TypeScript + Tailwind 4 + Motion. Formulaire branché sur Supabase et Resend.

## Ce qu'il y a dedans

- **Hero au scroll** : une façade dessinée en SVG qui passe par les 4 étapes du chantier (diagnostic avec cotes, nettoyage au jet, protection hydrofuge, peinture au rouleau).
- **Avant / après** à glisser, sur 3 types de bâtiments (pavillon, maison de ville, immeuble).
- **Nuancier** : le visiteur essaie les teintes de mur et de volets, la teinte part dans le devis.
- **Simulateur de prix** : fourchette en direct, reprise dans le formulaire.
- **Formulaire de devis en 3 étapes** : validation zod, pot de miel anti-robots, enregistrement Supabase + mail Resend.
- Avis, parcours client, zones, FAQ (avec données structurées), mentions légales, confidentialité, OG image, sitemap.
- Barre d'appel fixe sur mobile, respect de `prefers-reduced-motion`.

## Remplacer les données test

Tout est centralisé dans `src/config/` :

| Fichier | Contenu |
| --- | --- |
| `site.ts` | nom, téléphone, adresse, chiffres, labels, zones, avis |
| `offer.ts` | prestations, prix au m², règles du simulateur, nuancier |
| `faq.ts` | questions / réponses |

Quand tout est réel, passe `demo: false` dans `site.ts` : ça retire les étiquettes « exemple », réactive l'indexation Google et publie la note dans les données structurées.

Le numéro 01 99 00 12 34 est dans la plage réservée par l'ARCEP aux fictions : il ne sonne chez personne.

## Back-end

- Table `public.facade_leads` dans le projet Supabase « images site vitrine ». RLS active : le site peut seulement **ajouter** une ligne (rôle `anon`), personne ne peut lire via l'API. Les demandes se consultent dans le dashboard Supabase. Colonne `status` prévue pour le suivi (nouveau, rappele, visite, devis_envoye, gagne, perdu).
- Mail de notification via Resend, expéditeur `devis@klipt.fr` (domaine vérifié). Clé API à envoi seul, limitée à ce domaine.
- Route : `src/app/api/devis/route.ts`. Si Supabase OU Resend répond, la demande est acceptée.

## Dev

```bash
npm install
cp .env.example .env.local   # puis remplis les valeurs
npm run dev
```

`node scripts/textures.mjs` régénère les textures de crasse et de crépi (`public/textures`).
