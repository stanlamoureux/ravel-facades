"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { chapterAnchor, chapters } from "@/config/chapters";
import { site } from "@/config/site";
import { useQuote } from "./QuoteContext";
import { Chevron, Close, Menu, Phone } from "./icons";

/** Le plan de la page : les chapitres, plus un raccourci vers l'estimation. */
const sections = [
  ...chapters.map((c) => ({ id: chapterAnchor(c.id), label: c.title, hint: c.hint })),
  { id: "simulateur", label: "Estimation en ligne", hint: "Votre budget en 30 secondes" },
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

/** `solid` : en-tête plein dès le départ, pour les pages sans photo plein écran (fiches prestation). */
export function Nav({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [past, setPast] = useState(solid); // sous le hero (sur mobile, le hero est une photo plein écran)
  const [current, setCurrent] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { goToQuote } = useQuote();
  const home = usePathname() === "/";
  const to = (id: string) => (home ? `#${id}` : `/#${id}`);
  const tel = `tel:${site.phoneHref}`;

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const hero = document.getElementById("top");
      setScrolled(window.scrollY > 12);
      setPast(!hero || window.scrollY > hero.offsetHeight - 72);
      // la section en cours : la dernière dont le haut a franchi le premier tiers de l'écran
      let now: string | null = null;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) now = s.id;
      }
      setCurrent(now);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
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
        className={`group/h fixed inset-x-0 top-0 z-50 text-white transition-[background-color,color,box-shadow] duration-300 data-[past=true]:bg-white/90 data-[past=true]:text-encre data-[past=true]:shadow-[0_1px_0_rgb(14_26_38/0.08)] data-[past=true]:backdrop-blur-xl md:text-encre md:data-[scrolled=true]:bg-white/90 md:data-[scrolled=true]:shadow-[0_1px_0_rgb(14_26_38/0.08)] md:data-[scrolled=true]:backdrop-blur-xl ${home ? "lg:left-[248px]" : ""}`}
      >
        <div className="wrap flex h-16 items-center justify-between gap-4 md:h-[72px]">
          <a href={home ? "#top" : "/"} className={home ? "lg:hidden" : ""} aria-label={home ? `${site.name}, retour en haut de page` : `${site.name}, retour à l'accueil`}>
            <Logo />
          </a>

          {/* Sur ordinateur, le plan de la page reste dans l'en-tête */}
          <nav className="hidden lg:block" aria-label="Plan du site">
            <ul className="flex items-center gap-0.5 rounded-full bg-encre/[0.05] p-1">
              {chapters.map((c) => {
                const id = chapterAnchor(c.id);
                const here = home && current === id;
                return (
                  <li key={c.id}>
                    <a
                      href={to(id)}
                      aria-current={here ? "location" : undefined}
                      className={`inline-flex h-9 items-center rounded-full px-3.5 text-[0.9375rem] font-[580] tracking-[-0.01em] transition-[background-color,color,box-shadow] duration-200 xl:px-4 ${
                        here ? "bg-white text-encre shadow-[0_2px_10px_-3px_rgb(14_26_38/0.25)]" : "text-encre/70 hover:bg-white/60 hover:text-encre"
                      }`}
                    >
                      {c.short}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <a href={tel} className="hidden items-center gap-2 text-[0.9375rem] font-[620] tabular-nums xl:inline-flex">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-appel text-white">
                <Phone className="h-4 w-4" />
              </span>
              {site.phone}
            </a>
            <a
              href={tel}
              aria-label={`Appeler le ${site.phone}`}
              className="inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-full bg-appel px-3 text-[0.9375rem] font-[640] text-white shadow-[0_6px_18px_-6px_rgb(29_122_82/0.9)] transition-colors duration-200 hover:bg-appel-2 md:pl-3.5 md:pr-4 xl:hidden"
            >
              <Phone className="h-[1.15rem] w-[1.15rem]" />
              <span className="hidden md:inline">Appeler</span>
            </a>
            <button type="button" className="btn btn-cta btn-sm hidden md:inline-flex" onClick={() => goToQuote({ source: "menu" })}>
              Devis gratuit
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white pl-3.5 pr-[1.125rem] text-[0.9375rem] font-[620] text-encre shadow-[0_4px_16px_rgb(8_20_34/0.22)] transition-[background-color,color,box-shadow] duration-300 group-data-[past=true]/h:bg-encre group-data-[past=true]/h:text-white group-data-[past=true]/h:shadow-none md:bg-encre md:text-white md:shadow-none lg:hidden"
              aria-label="Ouvrir le menu"
              aria-haspopup="dialog"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
              Menu
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
              <button type="button" className="inline-flex h-11 items-center gap-2 rounded-full bg-gris pl-3.5 pr-[1.125rem] text-[0.9375rem] font-[620]" onClick={() => setOpen(false)} autoFocus>
                <Close className="h-5 w-5" />
                Fermer
              </button>
            </div>
            <motion.nav className="flex-1 overflow-y-auto overscroll-contain" aria-label="Sections de la page" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <ul className="wrap pb-3">
                {sections.map((s) => {
                  const here = home && current === s.id;
                  return (
                    <li key={s.id} className="border-b border-trait last:border-0">
                      <a href={to(s.id)} aria-current={here ? "location" : undefined} className="flex items-center gap-4 py-3" onClick={() => setOpen(false)}>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[1.1875rem] font-[640] leading-[1.2] tracking-[-0.02em]">{s.label}</span>
                          <span className="mt-0.5 block text-[0.875rem] text-ardoise">{s.hint}</span>
                        </span>
                        {here ? (
                          <span className="shrink-0 rounded-full bg-volet/10 px-2.5 py-1 text-[0.75rem] font-[620] text-volet">Vous êtes ici</span>
                        ) : (
                          <Chevron className="h-5 w-5 shrink-0 text-brume" />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
            <div className="wrap grid shrink-0 grid-cols-2 gap-2.5 border-t border-trait pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              <a href={tel} className="btn btn-call !px-3">
                <Phone className="h-5 w-5" />
                Appeler
              </a>
              <button
                type="button"
                className="btn btn-cta !px-3"
                onClick={() => {
                  setOpen(false);
                  goToQuote({ source: "menu" });
                }}
              >
                Devis gratuit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Barre d'action collée en bas sur mobile : appeler ou demander un devis, toujours à portée de pouce.
 * Elle apparaît sous le haut de page et s'efface devant les formulaires, dont le bouton prend le relais.
 */
export function MobileBar({ primary }: { primary?: { label: string; href: string } }) {
  const [show, setShow] = useState(false);
  const { goToQuote } = useQuote();

  useEffect(() => {
    const visible = new Set<Element>();
    const hero = document.getElementById("top");
    const update = () => setShow(window.scrollY > (hero ? window.innerHeight * 0.75 : 220) && visible.size === 0);
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
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-encre/[0.06] bg-white/92 px-4 pt-3 backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      aria-hidden={!show}
    >
      <div className="grid grid-cols-2 gap-2.5">
        <a href={`tel:${site.phoneHref}`} className="btn btn-call !gap-2.5 !px-3" tabIndex={show ? 0 : -1} aria-label={`Appeler le ${site.phone}`}>
          <Phone className="sonne h-[1.35rem] w-[1.35rem] shrink-0" />
          <span className="flex flex-col items-start leading-none">
            <span className="text-[0.9375rem] font-[650]">Appeler</span>
            <span className="mt-[3px] text-[0.75rem] font-[540] tabular-nums text-white/85">{site.phone}</span>
          </span>
        </a>
        {primary ? (
          <a href={primary.href} className="btn btn-cta !px-3" tabIndex={show ? 0 : -1}>
            {primary.label}
          </a>
        ) : (
          <button type="button" className="btn btn-cta !px-3" tabIndex={show ? 0 : -1} onClick={() => goToQuote({ source: "barre-mobile" })}>
            Devis gratuit
          </button>
        )}
      </div>
    </div>
  );
}
