import type { Metadata } from "next";
import { site } from "@/config/site";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Mentions légales" };

export default function Page() {
  return (
    <LegalLayout title="Mentions légales">
      <p>À compléter avec les informations réelles de l&apos;entreprise avant la mise en ligne.</p>
      <h2>Éditeur du site</h2>
      <p>
        {site.legalName}, société par actions simplifiée.
        <br />
        Siège : {site.address.street}, {site.address.postalCode} {site.address.city}
        <br />
        SIRET : {site.siret}
        <br />
        Téléphone : {site.phone}, email : {site.email}
        <br />
        Directeur de la publication : [nom du dirigeant]
      </p>
      <h2>Assurance professionnelle</h2>
      <p>Assurance décennale : [assureur], contrat n° [numéro], couverture géographique : France métropolitaine.</p>
      <h2>Hébergement</h2>
      <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p>
      <h2>Propriété intellectuelle</h2>
      <p>Les textes, illustrations et éléments graphiques de ce site sont la propriété de {site.legalName}. Toute reproduction sans autorisation est interdite.</p>
    </LegalLayout>
  );
}
