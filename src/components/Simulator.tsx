"use client";

import { useEffect, useRef, useState } from "react";
import { SURFACE, conditions, heights, propertyTypes, simulatorWorks, type ConditionId, type HeightId, type PropertyId, type WorkId } from "@/config/offer";
import { site } from "@/config/site";
import { nombre } from "@/lib/format";
import { estimateSchema } from "@/lib/lead";
import { AnimatedNumber } from "./AnimatedNumber";
import { useQuote } from "./QuoteContext";
import { Check, Lock, Mail } from "./icons";

function Segmented<T extends string>({ label, options, value, onChange }: { label: string; options: readonly { id: T; label: string; hint?: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="t-label">{label}</legend>
      <div className="mt-3 grid gap-1 rounded-[18px] bg-gris-2 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => {
          const on = o.id === value;
          return (
            <label
              key={o.id}
              className={`flex min-h-12 cursor-pointer flex-col items-center justify-center rounded-[14px] px-1.5 py-2 text-center text-[0.875rem] leading-tight transition-[background-color,box-shadow,color] duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ciel ${
                on ? "bg-white text-encre shadow-[0_1px_4px_rgb(14_26_38/0.12)]" : "text-ardoise hover:text-encre"
              }`}
            >
              <input type="radio" className="sr-only" name={label} checked={on} onChange={() => onChange(o.id)} />
              <span className="font-[580]">{o.label}</span>
              {o.hint && <span className="mt-0.5 text-[0.75rem] font-normal text-brume">{o.hint}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

type Contact = { name: string; email: string; phone: string; postalCode: string; consent: boolean; website: string };
type Result = { emailed: boolean; estimate?: { low: number; high: number } };

/**
 * Le montant affiché sous le flou n'est PAS l'estimation : ce sont des chiffres de décor,
 * qui bougent avec les réponses. Le vrai calcul se fait sur le serveur à l'envoi du
 * formulaire (src/config/pricing.ts), et part par email.
 */
function decor(seed: number) {
  const a = 2400 + ((seed * 37) % 90) * 100;
  return { low: a, high: a + 1800 + ((seed * 53) % 60) * 100 };
}

export function Simulator() {
  const [work, setWork] = useState<WorkId>("peinture");
  const [surface, setSurface] = useState(SURFACE.initial);
  const [property, setProperty] = useState<PropertyId>("maison");
  const [condition, setCondition] = useState<ConditionId>("moyen");
  const [height, setHeight] = useState<HeightId>("r1");
  const [c, setC] = useState<Contact>({ name: "", email: "", phone: "", postalCode: "", consent: false, website: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Contact, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const startedAt = useRef(0);
  const { simWork } = useQuote();

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (simWork) setWork(simWork);
  }, [simWork]);
  // toute modification de la simulation rouvre le formulaire
  useEffect(() => {
    setStatus((s) => (s === "done" ? "idle" : s));
  }, [work, surface, property, condition, height]);

  const idx = <T extends { id: string }>(list: readonly T[], id: string) => list.findIndex((x) => x.id === id);
  const ghost = decor(surface * 3 + idx(simulatorWorks, work) * 17 + idx(propertyTypes, property) * 7 + idx(conditions, condition) * 13 + idx(heights, height) * 5);
  const pct = ((surface - SURFACE.min) / (SURFACE.max - SURFACE.min)) * 100;
  const workLabel = simulatorWorks.find((w) => w.id === work)!.label;

  const set = <K extends keyof Contact>(k: K, v: Contact[K]) => {
    setC((prev) => ({ ...prev, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      work,
      property,
      condition,
      height,
      surface,
      ...c,
      consent: c.consent as true,
      page: window.location.href,
      utm: Object.fromEntries([...new URLSearchParams(window.location.search)].filter(([k]) => k.startsWith("utm_"))),
      startedAt: startedAt.current,
    };
    const check = estimateSchema.safeParse(payload);
    if (!check.success) {
      const errs: Partial<Record<keyof Contact, string>> = {};
      for (const issue of check.error.issues) {
        const k = issue.path[0] as keyof Contact;
        if (k in c && !errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      requestAnimationFrame(() => (card.current?.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus());
      return;
    }
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/estimation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Envoi impossible");
      setResult({ emailed: data.emailed !== false, estimate: data.estimate });
      setStatus("done");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Envoi impossible");
      setStatus("error");
    }
  };

  return (
    <section id="simulateur" className="bg-gris py-20 md:py-32" aria-labelledby="sim-title">
      <div className="wrap">
        <h2 id="sim-title" className="t-h2 max-w-[13ch]">
          Combien pour votre façade&nbsp;?
        </h2>
        <p className="t-lede mt-4 max-w-[42ch] md:mt-6">Cinq réponses, et le calcul est fait. Votre estimation chiffrée arrive par email dans la minute.</p>

        <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
          <div className="space-y-8">
            <fieldset>
              <legend className="t-label">Travaux envisagés</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {simulatorWorks.map((w) => {
                  const on = w.id === work;
                  return (
                    <label
                      key={w.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-[18px] px-4 py-3.5 transition-[background-color,box-shadow,color] duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ciel ${
                        on ? "bg-encre text-white" : "bg-white text-encre shadow-[inset_0_0_0_1px_var(--color-trait)] hover:shadow-[inset_0_0_0_1px_var(--color-brume)]"
                      }`}
                    >
                      <input type="radio" name="work" className="sr-only" checked={on} onChange={() => setWork(w.id)} />
                      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${on ? "bg-white text-encre" : "shadow-[inset_0_0_0_1.5px_var(--color-brume)]"}`}>{on && <Check className="h-3.5 w-3.5" />}</span>
                      <span className="leading-tight">
                        <span className="block font-[600]">{w.label}</span>
                        <span className={`mt-0.5 block text-[0.8125rem] ${on ? "text-white/65" : "text-ardoise"}`}>{w.detail}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="surface" className="t-label">
                  Surface de façade
                </label>
                <output htmlFor="surface" className="text-[1.5rem] font-[640] tabular-nums tracking-[-0.02em]">
                  {surface}&nbsp;m²
                </output>
              </div>
              <input id="surface" type="range" min={SURFACE.min} max={SURFACE.max} step={SURFACE.step} value={surface} onChange={(e) => setSurface(Number(e.target.value))} className="range mt-1" style={{ ["--p" as string]: `${pct}%` }} />
              <p className="text-[0.875rem] leading-[1.45] text-ardoise">Un repère&nbsp;: une maison de 100&nbsp;m² habitables sur deux niveaux, c&apos;est 130 à 160&nbsp;m² de façade.</p>
            </div>

            <Segmented label="Type de bien" options={propertyTypes} value={property} onChange={setProperty} />
            <Segmented label="État de la façade" options={conditions} value={condition} onChange={setCondition} />
            <Segmented label="Hauteur" options={heights} value={height} onChange={setHeight} />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <div ref={card} data-form-zone className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-28px_rgb(14_26_38/0.28)] md:rounded-[32px]">
              {status === "done" && result ? (
                <div className="p-6 md:p-9" role="status">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-volet text-white">
                    <Check className="h-6 w-6" />
                  </span>
                  {result.emailed ? (
                    <>
                      <h3 className="mt-5 text-[1.75rem] font-[650] leading-[1.1] tracking-[-0.03em]">C&apos;est envoyé.</h3>
                      <p className="mt-3 leading-[1.5] text-ardoise">
                        Votre estimation vient de partir à <span className="font-[600] text-encre">{c.email}</span>. Si elle n&apos;arrive pas d&apos;ici une minute, regardez dans les indésirables.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="mt-5 text-[1.75rem] font-[650] leading-[1.1] tracking-[-0.03em]">Votre estimation</h3>
                      {result.estimate && (
                        <p className="mt-2 text-[clamp(1.9rem,8.6vw,2.6rem)] font-[650] leading-none tracking-[-0.035em] tabular-nums">
                          {nombre(result.estimate.low)} à {nombre(result.estimate.high)}&nbsp;€
                        </p>
                      )}
                      <p className="mt-3 leading-[1.5] text-ardoise">L&apos;email n&apos;a pas pu partir, la voici donc directement. Montant TTC indicatif, à confirmer après visite.</p>
                    </>
                  )}
                  <p className="mt-5 border-t border-trait pt-5 leading-[1.5] text-ardoise">
                    Un technicien vous rappelle sous {site.callbackDelay} pour l&apos;affiner lors d&apos;une visite gratuite.
                  </p>
                </div>
              ) : (
                <>
                  <div className="relative bg-encre px-6 pb-6 pt-5 text-white md:px-9 md:pb-7 md:pt-7">
                    <p className="flex items-center justify-between text-[0.9375rem] font-[600]">
                      Votre estimation
                      <span className="flex items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 text-[0.8125rem] font-[540]">
                        <Lock className="h-3.5 w-3.5" />
                        Masquée
                      </span>
                    </p>
                    <p className="mt-3 select-none whitespace-nowrap text-[clamp(1.9rem,8.6vw,2.6rem)] font-[650] leading-none tracking-[-0.035em] tabular-nums blur-[9px]" aria-hidden>
                      <AnimatedNumber value={ghost.low} /> à <AnimatedNumber value={ghost.high} />
                      &nbsp;€
                    </p>
                    <p className="sr-only">Montant masqué : laissez vos coordonnées pour le recevoir par email.</p>
                    <p className="mt-3 text-[0.9375rem] text-white/65">
                      {workLabel}, {surface}&nbsp;m² de façade
                    </p>
                  </div>

                  <form onSubmit={submit} noValidate className="p-6 md:p-9">
                    <p className="flex items-center gap-2 text-[1.0625rem] font-[640] tracking-[-0.01em]">
                      <Mail className="h-5 w-5" />
                      Où faut-il vous l&apos;envoyer&nbsp;?
                    </p>
                    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                      <label>
                        Ne pas remplir
                        <input tabIndex={-1} autoComplete="off" value={c.website} onChange={(e) => set("website", e.target.value)} />
                      </label>
                    </div>
                    <div className="mt-4 grid gap-3">
                      <Field label="Nom et prénom" error={errors.name}>
                        <input className="field" autoComplete="name" value={c.name} aria-invalid={!!errors.name} onChange={(e) => set("name", e.target.value)} />
                      </Field>
                      <Field label="Email" error={errors.email}>
                        <input className="field" type="email" inputMode="email" autoComplete="email" placeholder="vous@exemple.fr" value={c.email} aria-invalid={!!errors.email} onChange={(e) => set("email", e.target.value)} />
                      </Field>
                      <div className="grid grid-cols-[1.35fr_1fr] gap-3">
                        <Field label="Téléphone" error={errors.phone}>
                          <input className="field" type="tel" autoComplete="tel" placeholder="06 12 34 56 78" value={c.phone} aria-invalid={!!errors.phone} onChange={(e) => set("phone", e.target.value)} />
                        </Field>
                        <Field label="Code postal" error={errors.postalCode}>
                          <input className="field" inputMode="numeric" autoComplete="postal-code" maxLength={5} placeholder="91000" value={c.postalCode} aria-invalid={!!errors.postalCode} onChange={(e) => set("postalCode", e.target.value.replace(/\D/g, ""))} />
                        </Field>
                      </div>
                    </div>
                    <label className="mt-4 flex cursor-pointer items-start gap-3 text-[0.8125rem] leading-[1.5] text-ardoise">
                      <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-[#0e1a26]" checked={c.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={!!errors.consent} />
                      <span>
                        J&apos;accepte d&apos;être recontacté au sujet de mon projet. Mes données ne sont ni revendues ni utilisées pour de la publicité.{" "}
                        <a href="/confidentialite" className="link">
                          En savoir plus
                        </a>
                      </span>
                    </label>
                    {errors.consent && <p className="mt-1.5 text-[0.875rem] text-alerte">{errors.consent}</p>}
                    {status === "error" && (
                      <p className="mt-4 rounded-2xl bg-[#fdeceb] p-4 text-[0.9375rem] text-[#8a1f1f]" role="alert">
                        {serverError}. Réessayez, ou appelez le{" "}
                        <a className="font-[640] underline" href={`tel:${site.phoneHref}`}>
                          {site.phone}
                        </a>
                        .
                      </p>
                    )}
                    <button type="submit" className="btn btn-ink mt-5 w-full" disabled={status === "sending"}>
                      {status === "sending" ? "Envoi en cours..." : "Recevoir mon estimation"}
                    </button>
                    <p className="mt-3 text-center text-[0.8125rem] leading-[1.45] text-brume">Gratuit et sans engagement.</p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[0.875rem] font-[600]">{label}</span>
      <span className="mt-1.5 block">{children}</span>
      {error && <span className="mt-1 block text-[0.8125rem] leading-[1.35] text-alerte">{error}</span>}
    </label>
  );
}
