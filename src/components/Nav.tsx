"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { Phone } from "./icons";

const links = [
  { href: "#prestations", label: "Prestations" },
  { href: "#avant-apres", label: "Avant / après" },
  { href: "#teintes", label: "Teintes" },
  { href: "#simulateur", label: "Prix" },
  { href: "#avis", label: "Avis" },
  { href: "#faq", label: "Questions" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden>
        <rect x="3" y="9" width="22" height="16" rx="2" fill="currentColor" />
        <path d="M1.5 10 14 2.5 26.5 10" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        <rect x="7" y="13" width="4.5" height="5" rx="0.6" fill="#fff" />
        <rect x="16.5" y="13" width="4.5" height="5" rx="0.6" fill="#2A3FF5" />
        <rect x="11.8" y="18.5" width="4.4" height="6.5" fill="#fff" />
      </svg>
      <span className="text-[1.3rem] font-[680] tracking-[-0.03em]" style={{ fontStretch: "118%" }}>
        {site.name}
      </span>
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        scrolled ? "bg-white/78 shadow-[0_1px_0_rgba(26,30,36,0.08)] backdrop-blur-xl backdrop-saturate-150" : "bg-white/0"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-6 px-5 md:px-8" aria-label="Navigation principale">
        <a href="#top" className="shrink-0 text-ardoise" aria-label={`${site.name}, retour en haut`}>
          <Logo />
        </a>
        <ul className="hidden items-center gap-7 text-[0.92rem] text-ardoise/80 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-ardoise">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 md:gap-4">
          <a href={`tel:${site.phoneHref}`} className="hidden items-center gap-2 text-[0.95rem] font-[560] md:inline-flex" aria-label={`Appeler le ${site.phone}`}>
            <Phone className="h-[18px] w-[18px] text-outremer" />
            {site.phone}
          </a>
          <a href={`tel:${site.phoneHref}`} className="grid h-10 w-10 place-items-center rounded-full bg-pierre md:hidden" aria-label={`Appeler le ${site.phone}`}>
            <Phone className="h-[18px] w-[18px] text-outremer" />
          </a>
          <a href="#devis" className="btn btn-primary !h-10 !px-4 text-[0.92rem]">
            Devis gratuit
          </a>
        </div>
      </nav>
    </header>
  );
}

export function MobileBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => {
      const devis = document.getElementById("devis");
      const r = devis?.getBoundingClientRect();
      const inForm = r ? r.top < window.innerHeight * 0.6 && r.bottom > 0 : false;
      setShow(window.scrollY > 520 && !inForm);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ligne bg-white/90 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur-xl transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="grid grid-cols-2 gap-3">
        <a href={`tel:${site.phoneHref}`} className="btn btn-ghost w-full">
          <Phone className="h-[18px] w-[18px]" />
          Appeler
        </a>
        <a href="#devis" className="btn btn-primary w-full">
          Devis gratuit
        </a>
      </div>
    </div>
  );
}
