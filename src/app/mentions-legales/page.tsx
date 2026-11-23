import type { Metadata } from "next";
import { site } from "@/config/site";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Mentions légales" };

export default function Page() {
  const l = site.legal;
  return (
    <LegalLayout title="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        Steevy GARAND, entrepreneur individuel (EI)
        <br />
        Adresse : {site.address.street}, {site.address.postalCode} {site.address.city}
        <br />
        SIREN : {l.siren}, SIRET : {site.siret}
        <br />
        Immatriculation : {l.rcs}, depuis le {l.registeredOn}
        <br />
        TVA intracommunautaire : {l.tva}
        <br />
        Code APE : {l.naf}
        <br />
        Téléphone : <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
        <br />
        Directeur de la publication : Steevy GARAND
      </p>
      {l.insurance && (
        <>
          <h2>Assurance professionnelle</h2>
          <p>
            Assurance décennale : {l.insurance.insurer}, contrat n° {l.insurance.contract}, couverture géographique : France métropolitaine.
          </p>
        </>
      )}
      <h2>Hébergement</h2>
      <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p>
      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, photos et éléments graphiques de ce site appartiennent à Steevy GARAND, sauf mention contraire. Toute reproduction sans autorisation est interdite.
      </p>
      <h2>Données personnelles</h2>
      <p>
        Les informations envoyées par les formulaires servent uniquement à répondre à votre demande. Le détail est dans la <a href="/confidentialite">politique de confidentialité</a>.
      </p>
    </LegalLayout>
  );
}
