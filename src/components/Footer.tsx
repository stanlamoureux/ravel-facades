import { site } from "@/config/site";
import { services } from "@/config/offer";
import { Logo } from "./Nav";

export function Footer() {
  return (
    <footer className="bg-pierre px-5 pb-28 pt-16 text-[0.92rem] md:pb-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-10 border-b border-ardoise/10 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[34ch] text-zinc">
              {site.tagline} en Île-de-France depuis {site.foundedYear}. Nettoyage, ravalement, peinture et isolation de façades.
            </p>
            <address className="mt-5 not-italic leading-relaxed text-zinc">
              {site.legalName}
              <br />
              {site.address.street}, {site.address.postalCode} {site.address.city}
              <br />
              <a className="link" href={`tel:${site.phoneHref}`}>
                {site.phone}
              </a>
              <br />
              <a className="link" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </address>
          </div>
          <nav aria-label="Prestations">
            <p className="font-[620]">Prestations</p>
            <ul className="mt-4 space-y-2.5 text-zinc">
              {services.map((s) => (
                <li key={s.id}>
                  <a href="#prestations" className="hover:text-ardoise">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Liens utiles">
            <p className="font-[620]">Le site</p>
            <ul className="mt-4 space-y-2.5 text-zinc">
              <li>
                <a href="#simulateur" className="hover:text-ardoise">
                  Estimer mon prix
                </a>
              </li>
              <li>
                <a href="#teintes" className="hover:text-ardoise">
                  Choisir une teinte
                </a>
              </li>
              <li>
                <a href="#devis" className="hover:text-ardoise">
                  Demander un devis
                </a>
              </li>
              <li>
                <a href="/mentions-legales" className="hover:text-ardoise">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="/confidentialite" className="hover:text-ardoise">
                  Confidentialité
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex flex-col justify-between gap-3 pt-6 text-zinc md:flex-row">
          <p>
            © {new Date().getFullYear()} {site.legalName}. SIRET {site.siret}.
          </p>
          {site.demo && <p className="demo-tag self-start">Site de démonstration : coordonnées, chiffres et avis d&apos;exemple</p>}
        </div>
      </div>
    </footer>
  );
}
