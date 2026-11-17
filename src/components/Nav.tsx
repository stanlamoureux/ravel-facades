"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { useQuote } from "./QuoteContext";
import { Close, Menu, Phone } from "./icons";

const links = [
  { href: "#prestations", label: "Prestations" },
  { href: "#avant-apres", label: "Avant / après" },
  { href: "#teintes", label: "Teintes" },
  { href: "#simulateur", label: "Estimation" },
  { href: "#avis", label: "Avis" },
  { href: "#faq", label: "Questions" },
];

/** Le carré coupé en deux : moitié avant, moitié après. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[1.3rem] font-[680] tracking-[-0.035em] ${className}`}>
      <svg viewBox="0 0 24 24" className="h-[1.15em] w-[1.15em]" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="6.5" fill="currentColor" opacity="0.3" />
        <path d="M12.75 2H15.5A6.5 6.5 0 0 1 22 8.5v7a6.5 6.5 0 0 1-6.5 6.5h-2.75z" fill="currentColor" />
      </svg>
      {site.name}
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [past, setPast] = useState(false); // sous le hero (sur mobile, le hero est une photo plein écran)
  const [open, setOpen] = useState(false);
  const { goToQuote } = useQuote();

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("top");
      setScrolled(window.scrollY > 12);
      setPast(window.scrollY > (hero ? hero.offsetHeight - 72 : 400));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        data-past={past}
        data-scrolled={scrolled}
        className="fixed inset-x-0 top-0 z-50 text-white transition-[background-color,color,box-shadow] duration-300 data-[past=true]:bg-white/85 data-[past=true]:text-encre data-[past=true]:shadow-[0_1px_0_rgb(14_26_38/0.08)] data-[past=true]:backdrop-blur-xl md:text-encre md:data-[scrolled=true]:bg-white/85 md:data-[scrolled=true]:shadow-[0_1px_0_rgb(14_26_38/0.08)] md:data-[scrolled=true]:backdrop-blur-xl"
      >
        <div className="wrap flex h-16 items-center justify-between md:h-[72px]">
          <a href="#top" aria-label={`${site.name}, retour en haut de page`}>
            <Logo />
          </a>

          <nav className="hidden items-center gap-7 text-[0.9375rem] font-[520] lg:flex" aria-label="Sections de la page">
            {links.slice(0, 5).map((l) => (
              <a key={l.href} href={l.href} className="text-encre/70 transition-colors hover:text-encre">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 md:gap-3">
            <a href={`tel:${site.phoneHref}`} className="hidden items-center gap-2 text-[0.9375rem] font-[600] tabular-nums md:inline-flex">
              <Phone className="h-[1.1rem] w-[1.1rem]" />
              {site.phone}
            </a>
            <button type="button" className="btn btn-ink btn-sm hidden md:inline-flex" onClick={() => goToQuote({ source: "menu" })}>
              Devis gratuit
            </button>
            <a href={`tel:${site.phoneHref}`} className="grid h-11 w-11 place-items-center rounded-full md:hidden" aria-label={`Appeler le ${site.phone}`}>
              <Phone className="h-[1.35rem] w-[1.35rem]" />
            </a>
            <button type="button" className="-mr-2 grid h-11 w-11 place-items-center rounded-full lg:hidden" aria-label="Ouvrir le menu" aria-expanded={open} onClick={() => setOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-white text-encre lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="wrap flex h-16 shrink-0 items-center justify-between md:h-[72px]">
              <Logo />
              <button type="button" className="-mr-2 grid h-11 w-11 place-items-center rounded-full" aria-label="Fermer le menu" onClick={() => setOpen(false)} autoFocus>
                <Close className="h-6 w-6" />
              </button>
            </div>
            <motion.nav
              className="wrap flex flex-1 flex-col justify-center gap-1 overflow-y-auto pb-6"
              aria-label="Sections de la page"
              initial={{ y: 14 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {links.map((l) => (
                <a key={l.href} href={l.href} className="py-2 text-[2.1rem] font-[640] leading-tight tracking-[-0.03em]" onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
            </motion.nav>
            <div className="wrap grid shrink-0 gap-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                className="btn btn-ink w-full"
                onClick={() => {
                  setOpen(false);
                  goToQuote({ source: "menu" });
                }}
              >
                Demander un devis gratuit
              </button>
              <a href={`tel:${site.phoneHref}`} className="btn btn-soft w-full tabular-nums">
                <Phone className="h-5 w-5" />
                {site.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Barre d'action collée en bas sur mobile : apparaît sous le hero, s'efface devant le formulaire. */
export function MobileBar() {
  const [show, setShow] = useState(false);
  const { goToQuote } = useQuote();

  useEffect(() => {
    // la barre s'efface devant les formulaires (devis, estimation) : leur bouton prend le relais
    const visible = new Set<Element>();
    const update = () => setShow(window.scrollY > window.innerHeight * 0.75 && visible.size === 0);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
        update();
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    document.querySelectorAll("[data-form-zone]").forEach((el) => io.observe(el));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-encre/[0.06] bg-white/90 px-4 pt-3 backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      aria-hidden={!show}
    >
      <div className="grid grid-cols-[auto_1fr] gap-2.5">
        <a href={`tel:${site.phoneHref}`} className="btn btn-soft !px-5" tabIndex={show ? 0 : -1}>
          <Phone className="h-5 w-5" />
          Appeler
        </a>
        <button type="button" className="btn btn-ink" tabIndex={show ? 0 : -1} onClick={() => goToQuote({ source: "barre-mobile" })}>
          Devis gratuit
        </button>
      </div>
    </div>
  );
}
