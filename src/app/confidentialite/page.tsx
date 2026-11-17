import type { Metadata } from "next";
import { site } from "@/config/site";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function Page() {
  return (
    <LegalLayout title="Vos données personnelles">
      <p>
        Quand vous demandez un devis, nous recueillons votre nom, votre téléphone, votre code postal et, si vous les indiquez, votre email et les détails de votre
        projet. Ces informations servent uniquement à vous recontacter et à établir votre devis.
      </p>
      <h2>Qui y a accès</h2>
      <p>Seule l&apos;équipe de {site.legalName}. Vos données ne sont ni vendues, ni louées, ni utilisées pour de la publicité.</p>
      <h2>Combien de temps</h2>
      <p>Trois ans après notre dernier échange si aucun chantier n&apos;est engagé, puis elles sont supprimées.</p>
      <h2>Vos droits</h2>
      <p>
        Vous pouvez consulter, corriger ou supprimer vos données à tout moment en écrivant à{" "}
        <a className="link" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        . En cas de désaccord, vous pouvez saisir la CNIL.
      </p>
      <h2>Prestataires techniques</h2>
      <p>Hébergement du site : Vercel. Stockage des demandes : Supabase (serveurs dans l&apos;Union européenne). Envoi des emails : Resend.</p>
    </LegalLayout>
  );
}
