"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { PROPERTY_OPTIONS, TIMELINE_OPTIONS, WORK_OPTIONS, leadSchema } from "@/lib/lead";
import { useQuote } from "./QuoteContext";
import { Check, Clock, Phone, Shield } from "./icons";

type State = {
  works: string[];
  property: string;
  postalCode: string;
  surface: string;
  timeline: string;
  color: string;
  accent: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
  website: string;
};

const initial: State = {
  works: [],
  property: "",
  postalCode: "",
  surface: "",
  timeline: "",
  color: "",
  accent: "",
  name: "",
  phone: "",
  email: "",
  message: "",
  consent: false,
  website: "",
};

const stepFields: (keyof State)[][] = [["works"], ["postalCode"], ["name", "phone", "email", "consent"]];
const stepTitles = ["Vos travaux", "Votre projet", "Vos coordonnées"];

/** Traduit un libellé du simulateur / des prestations vers les choix du formulaire. */
function mapWork(label: string): string[] {
  const l = label.toLowerCase();
  const out: string[] = [];
  if (l.includes("nettoy")) out.push("Nettoyage");
  if (l.includes("hydrofuge")) out.push("Hydrofuge");
  if (l.includes("peinture")) out.push("Peinture");
  if (l.includes("ravalement")) out.push("Ravalement");
  if (l.includes("fissure")) out.push("Fissures");
  if (l.includes("isolation") || l === "ite") out.push("ITE");
  if (l.includes("démouss")) out.push("Démoussage");
  return out.length ? out : WORK_OPTIONS.includes(label as never) ? [label] : [];
}

export function QuoteSection() {
  return (
    <section id="devis" className="relative pb-20 md:pb-32" aria-labelledby="devis-title">
      {/* le ciel et le faîtage de la maison du haut de page */}
      <div className="relative h-[400px] overflow-hidden bg-[#2a6a9e] md:h-[540px]">
        <Image src="/images/ciel.webp" alt="" fill quality={80} sizes="100vw" className="object-cover object-bottom md:object-[50%_56%]" />
        <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-[#0b2740]/45 to-transparent" aria-hidden />
        <div className="wrap relative pt-14 text-white md:pt-24">
          <h2 id="devis-title" className="t-h2 max-w-[11ch]">
            Parlons de votre façade.
          </h2>
          <p className="t-lede mt-4 max-w-[30ch] !text-white/90 md:mt-6 md:max-w-[34ch]">Trois questions, une minute. On vous rappelle sous {site.callbackDelay} pour fixer la visite.</p>
        </div>
      </div>

      <div className="wrap relative -mt-[72px] grid gap-x-14 gap-y-12 md:-mt-[150px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div data-form-zone className="lg:col-start-2 lg:row-start-1 lg:-mt-[150px]">
          <QuoteForm />
        </div>
        <div className="lg:col-start-1 lg:row-start-1 lg:pt-[190px]">
          <ul className="space-y-6">
            {[
              { icon: Clock, t: `Rappel sous ${site.callbackDelay}`, d: "Du lundi au samedi, par un technicien, pas par un centre d'appels." },
              { icon: Check, t: "Visite et devis gratuits", d: `Un devis poste par poste, sous ${site.quoteDelay} après la visite.` },
              { icon: Shield, t: "Sans engagement", d: "Vous décidez à votre rythme. Aucune relance insistante." },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gris">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[1.0625rem] font-[620] tracking-[-0.01em]">{t}</span>
                  <span className="mt-0.5 block leading-[1.5] text-ardoise">{d}</span>
                </span>
              </li>
            ))}
          </ul>
          <a href={`tel:${site.phoneHref}`} className="mt-10 flex items-center gap-4 rounded-[24px] bg-gris p-5 transition-colors hover:bg-gris-2 md:p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-encre text-white">
              <Phone className="h-[1.35rem] w-[1.35rem]" />
            </span>
            <span>
              <span className="block text-[0.9375rem] text-ardoise">Plutôt par téléphone ?</span>
              <span className="block text-[1.625rem] font-[650] leading-tight tracking-[-0.03em] tabular-nums">{site.phone}</span>
              <span className="block text-[0.875rem] text-ardoise">{site.hours}</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function QuoteForm() {
  const { prefill } = useQuote();
  const [s, setS] = useState<State>(initial);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof State, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const startedAt = useRef<number>(0);
  const form = useRef<HTMLFormElement>(null);

  // à chaque changement d'étape, le haut du formulaire revient sous la barre de navigation
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    const el = form.current;
    if (el && el.getBoundingClientRect().top < 76) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 92, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // reprise des infos venues du simulateur / nuancier / prestations
  useEffect(() => {
    if (!prefill || Object.keys(prefill).length === 0) return;
    setS((prev) => {
      const works = new Set(prev.works);
      prefill.works?.forEach((w) => mapWork(w).forEach((m) => works.add(m)));
      return {
        ...prev,
        works: [...works],
        property: prefill.property ?? prev.property,
        surface: prefill.surface ? String(prefill.surface) : prev.surface,
        color: prefill.color ?? prev.color,
        accent: prefill.accent ?? prev.accent,
      };
    });
    setStep(0);
    setStatus((st) => (st === "done" ? st : "idle"));
  }, [prefill]);

  const set = <K extends keyof State>(k: K, v: State[K]) => {
    setS((prev) => ({ ...prev, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const payload = () => ({
    works: s.works,
    property: s.property,
    postalCode: s.postalCode,
    surface: s.surface ? Math.round(Number(s.surface)) : undefined,
    timeline: s.timeline,
    color: s.color,
    accent: s.accent,
    name: s.name,
    phone: s.phone,
    email: s.email,
    message: s.message,
    consent: s.consent as true,
    source: prefill.source ?? "formulaire",
    page: typeof window !== "undefined" ? window.location.href : "",
    utm: typeof window !== "undefined" ? Object.fromEntries([...new URLSearchParams(window.location.search)].filter(([k]) => k.startsWith("utm_"))) : {},
    website: s.website,
    startedAt: startedAt.current,
  });

  const validateStep = (i: number) => {
    const res = leadSchema.safeParse(payload());
    if (res.success) return true;
    const fields = stepFields[i];
    const errs: Partial<Record<keyof State, string>> = {};
    for (const issue of res.error.issues) {
      const k = issue.path[0] as keyof State;
      if (fields.includes(k) && !errs[k]) errs[k] = issue.message;
    }
    setErrors(errs);
    const ok = Object.keys(errs).length === 0;
    if (!ok) requestAnimationFrame(() => (form.current?.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus());
    return ok;
  };

  const next = () => {
    if (validateStep(step)) setStep((x) => Math.min(2, x + 1));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) return next();
    if (!validateStep(2)) return;
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/devis", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload()) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Envoi impossible");
      setStatus("done");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Envoi impossible");
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center rounded-[28px] bg-white p-7 shadow-[0_30px_80px_-30px_rgb(14_26_38/0.4)] md:rounded-[32px] md:p-12" role="status">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-volet text-white">
          <Check className="h-7 w-7" />
        </span>
        <h3 className="mt-6 text-[2rem] font-[650] leading-[1.05] tracking-[-0.03em]">Demande envoyée.</h3>
        <p className="t-lede mt-3 max-w-[38ch]">
          Merci {s.name.split(" ")[0]}. Un technicien vous rappelle sous {site.callbackDelay} au {s.phone} pour fixer la visite.
        </p>
        <p className="mt-8 text-ardoise">
          Une question d&apos;ici là ?{" "}
          <a className="link" href={`tel:${site.phoneHref}`}>
            Appelez le {site.phone}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form ref={form} onSubmit={submit} noValidate className="relative rounded-[28px] bg-white p-5 shadow-[0_30px_80px_-30px_rgb(14_26_38/0.4)] ring-1 ring-encre/[0.04] md:rounded-[32px] md:p-10" aria-labelledby="form-step-title">
      <div className="flex items-center justify-between text-[0.875rem]">
        <p className="font-[600]">Étape {step + 1} sur 3</p>
        <p className="text-ardoise">Environ 1 minute</p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span key={i} className={`h-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-encre" : "bg-gris-2"}`} />
        ))}
      </div>
      <h3 id="form-step-title" className="mt-6 text-[1.75rem] font-[650] leading-[1.1] tracking-[-0.03em]">
        {stepTitles[step]}
      </h3>

      {/* pot de miel */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Ne pas remplir
          <input tabIndex={-1} autoComplete="off" value={s.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-6"
        >
          {step === 0 && (
            <div className="space-y-7">
              <fieldset>
                <legend className="t-label">Quels travaux ? Plusieurs choix possibles.</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {WORK_OPTIONS.map((w, i) => {
                    const on = s.works.includes(w);
                    return (
                      <button
                        key={w}
                        type="button"
                        className="chip"
                        data-on={on}
                        aria-pressed={on}
                        data-autofocus={i === 0 ? "" : undefined}
                        onClick={() => set("works", on ? s.works.filter((x) => x !== w) : [...s.works, w])}
                      >
                        {on && <Check className="h-4 w-4" />}
                        {w}
                      </button>
                    );
                  })}
                </div>
                {errors.works && <p className="mt-2 text-sm text-alerte">{errors.works}</p>}
              </fieldset>
              <fieldset>
                <legend className="t-label">Type de bien</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PROPERTY_OPTIONS.map((p) => (
                    <button key={p} type="button" className="chip" data-on={s.property === p} aria-pressed={s.property === p} onClick={() => set("property", s.property === p ? "" : p)}>
                      {p}
                    </button>
                  ))}
                </div>
              </fieldset>
              {s.color && (
                <p className="rounded-2xl bg-gris p-4 text-[0.9375rem]">
                  Teinte choisie&nbsp;: <strong className="font-[640]">{s.color}</strong>
                  {s.accent && <>, menuiseries {s.accent.toLowerCase()}</>}
                </p>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Code postal du chantier" error={errors.postalCode}>
                  <input
                    className="field"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={5}
                    placeholder="91000"
                    value={s.postalCode}
                    aria-invalid={!!errors.postalCode}
                    onChange={(e) => set("postalCode", e.target.value.replace(/\D/g, ""))}
                    data-autofocus=""
                  />
                </Field>
                <Field label="Surface de façade (si connue)" hint="En m², une estimation suffit">
                  <input className="field" inputMode="numeric" placeholder="140" value={s.surface} onChange={(e) => set("surface", e.target.value.replace(/\D/g, ""))} />
                </Field>
              </div>
              <fieldset>
                <legend className="t-label">Quand souhaitez-vous démarrer ?</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TIMELINE_OPTIONS.map((t) => (
                    <button key={t} type="button" className="chip" data-on={s.timeline === t} aria-pressed={s.timeline === t} onClick={() => set("timeline", s.timeline === t ? "" : t)}>
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Field label="Nom et prénom" error={errors.name}>
                <input className="field" autoComplete="name" value={s.name} aria-invalid={!!errors.name} onChange={(e) => set("name", e.target.value)} data-autofocus="" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Téléphone" error={errors.phone}>
                  <input className="field" type="tel" autoComplete="tel" placeholder="06 12 34 56 78" value={s.phone} aria-invalid={!!errors.phone} onChange={(e) => set("phone", e.target.value)} />
                </Field>
                <Field label="Email (facultatif)" error={errors.email}>
                  <input className="field" type="email" autoComplete="email" value={s.email} aria-invalid={!!errors.email} onChange={(e) => set("email", e.target.value)} />
                </Field>
              </div>
              <Field label="Un détail à nous signaler ? (facultatif)">
                <textarea className="field" rows={3} value={s.message} onChange={(e) => set("message", e.target.value)} placeholder="Accès difficile, fissures, copropriété..." />
              </Field>
              <label className="flex cursor-pointer items-start gap-3 pt-1 text-[0.875rem] leading-[1.5] text-ardoise">
                <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#0e1a26]" checked={s.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={!!errors.consent} />
                <span>
                  J&apos;accepte d&apos;être recontacté au sujet de ma demande. Mes données ne sont ni revendues ni utilisées pour de la publicité.{" "}
                  <a href="/confidentialite" className="link">
                    En savoir plus
                  </a>
                </span>
              </label>
              {errors.consent && <p className="text-sm text-alerte">{errors.consent}</p>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {status === "error" && (
        <p className="mt-6 rounded-2xl bg-[#fdeceb] p-4 text-[0.9375rem] text-[#8a1f1f]" role="alert">
          {serverError}. Réessayez, ou appelez directement le{" "}
          <a className="font-[640] underline" href={`tel:${site.phoneHref}`}>
            {site.phone}
          </a>
          .
        </p>
      )}

      <div className="mt-8 flex items-center gap-3">
        {step > 0 && (
          <button type="button" className="btn btn-soft" onClick={() => setStep((x) => x - 1)}>
            Retour
          </button>
        )}
        <button type="submit" className="btn btn-ink flex-1" disabled={status === "sending"}>
          {step < 2 ? "Continuer" : status === "sending" ? "Envoi en cours..." : "Envoyer ma demande"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="t-label">{label}</span>
      {hint && <span className="ml-2 text-[0.8125rem] font-normal text-ardoise">{hint}</span>}
      <span className="mt-2 block">{children}</span>
      {error && <span className="mt-1.5 block text-sm text-alerte">{error}</span>}
    </label>
  );
}
