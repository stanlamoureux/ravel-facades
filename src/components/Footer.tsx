import Link from "next/link";
import { ficheHref } from "@/config/fiches";
import { services } from "@/config/offer";
import { site } from "@/config/site";
import { Logo } from "./Nav";

export function Footer() {
  return (
    <footer className="bg-encre pb-28 pt-16 text-white md:pb-12 md:pt-20">
      <div className="wrap">
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[28ch] text-white/60">Ravalement, peinture et nettoyage de façade en Sologne, depuis {site.foundedYear}.</p>
          </div>
          <div>
            <h2 className="text-[0.875rem] font-[600] text-white/50">Nous joindre</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={`tel:${site.phoneHref}`} className="text-[1.25rem] font-[640] tabular-nums tracking-[-0.02em]">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="text-white/75 hover:text-white">
                  {site.email}
                </a>
              </li>
              <li className="text-white/60">{site.hours}</li>
            </ul>
          </div>
          <div>
            <h2 className="text-[0.875rem] font-[600] text-white/50">Prestations</h2>
            <ul className="mt-3 space-y-2">
              {services.map((s) => (
                <li key={s.id}>
                  <Link href={ficheHref(s.id)} className="text-white/75 hover:text-white">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[0.875rem] font-[600] text-white/50">Adresse</h2>
            <address className="mt-3 not-italic leading-[1.6] text-white/75">
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.875rem] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. SIRET {site.siret}.
          </p>
          <p className="flex gap-6">
            <a href="/mentions-legales" className="hover:text-white">
              Mentions légales
            </a>
            <a href="/confidentialite" className="hover:text-white">
              Confidentialité
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
