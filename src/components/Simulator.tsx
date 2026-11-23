"use client";

import { useEffect, useRef, useState } from "react";
import { SURFACE, conditions, heights, propertyTypes, simulatorWorks, type ConditionId, type HeightId, type PropertyId, type WorkId } from "@/config/offer";
import { site } from "@/config/site";
import { nombre } from "@/lib/format";
import { estimateSchema } from "@/lib/lead";
import { AnimatedNumber } from "./AnimatedNumber";
import { useQuote } from "./QuoteContext";
import { Check, Chevron, Lock, Phone } from "./icons";

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
  // une question à la fois : 0 travaux, 1 surface, 2 bien, 3 état, 4 hauteur, 5 coordonnées
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
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
  // arrivée depuis un bouton "Faire une estimation" : les travaux sont déjà connus, on passe à la suite
  useEffect(() => {
    if (!simWork) return;
    setWork(simWork);
    setStep((s) => (s === 0 ? 1 : s));
    setReached((r) => Math.max(r, 1));
  }, [simWork]);
  // toute modification de la simulation rouvre le formulaire
  useEffect(() => {
    setStatus((s) => (s === "done" ? "idle" : s));
  }, [work, surface, property, condition, height]);

  const idx = <T extends { id: string }>(list: readonly T[], id: string) => list.findIndex((x) => x.id === id);
  const ghost = decor(surface * 3 + idx(simulatorWorks, work) * 17 + idx(propertyTypes, property) * 7 + idx(conditions, condition) * 13 + idx(heights, height) * 5);
  const pct = ((surface - SURFACE.min) / (SURFACE.max - SURFACE.min)) * 100;
  const workLabel = simulatorWorks.find((w) => w.id === work)!.label;

  const go = (n: number) => {
    setStep(n);
    setReached((r) => Math.max(r, n));
    // la carte reste sous l'en-tête quand sa hauteur change
    requestAnimationFrame(() => {
      const el = card.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top < 80) window.scrollTo({ top: window.scrollY + top - 132, behavior: "smooth" });
    });
  };
  // choisir une réponse fait avancer, après un court temps pour voir sa sélection
  const pick = (apply: () => void) => {
    apply();
    window.setTimeout(() => go(step + 1), 240);
  };
  const recap = [
    { k: "Travaux", v: workLabel },
    { k: "Surface", v: `${surface} m²` },
    { k: "Bien", v: propertyTypes.find((x) => x.id === property)!.label },
    { k: "État", v: conditions.find((x) => x.id === condition)!.label },
    { k: "Hauteur", v: heights.find((x) => x.id === height)!.label },
  ];
  const questions = ["Quels travaux envisagez-vous ?", "Quelle surface de façade ?", "Quel type de bien ?", "Dans quel état est la façade ?", "Quelle hauteur ?"];

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
    <section id="simulateur" className="bg-gris py-14 md:py-[min(7rem,11svh)]" aria-labelledby="sim-title">
      <div className="wrap">
        <div className="md:flex md:items-end md:justify-between md:gap-10">
          <h2 id="sim-title" className="t-h2">
            Chiffrer mes travaux
          </h2>
          <p className="mt-3 max-w-[34ch] text-[1.0625rem] leading-[1.45] text-ardoise md:mt-0 md:pb-1.5 md:text-right">5 questions, 30 secondes. L&apos;estimation arrive par email.</p>
        </div>

        <div ref={card} data-form-zone className="mt-6 grid grid-cols-1 overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-28px_rgb(14_26_38/0.28)] md:mt-10 md:rounded-[32px] lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          {/* le montant, masqué, qui bouge à chaque réponse */}
          <div className="min-w-0 bg-encre px-5 py-4 text-white md:px-8 md:py-6 lg:order-last lg:flex lg:flex-col lg:p-9">
            <div className="flex items-center justify-between gap-4 lg:block">
              <p className="flex items-center gap-2 whitespace-nowrap text-[0.9375rem] font-[600] lg:justify-between">
                <Lock className="h-4 w-4 text-white/60 lg:hidden" />
                Votre estimation
                <span className="hidden items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 text-[0.8125rem] font-[540] lg:flex">
                  <Lock className="h-3.5 w-3.5" />
                  Masquée
                </span>
              </p>
              <p className="select-none whitespace-nowrap text-[1.375rem] font-[650] leading-none tracking-[-0.035em] tabular-nums opacity-90 blur-[6px] [text-shadow:0_0_14px_rgb(255_255_255/0.35)] lg:mt-5 lg:text-[clamp(1.9rem,2.9vw,2.5rem)] lg:blur-[7px]" aria-hidden>
                <AnimatedNumber value={ghost.low} /> à <AnimatedNumber value={ghost.high} />
                &nbsp;€
              </p>
            </div>
            <p className="sr-only">Montant masqué : répondez aux questions puis laissez vos coordonnées pour le recevoir par email.</p>
            {/* le récapitulatif : chaque ligne ramène à sa question */}
            <ul className="mt-8 hidden border-t border-white/12 lg:block">
              {recap.map((r, n) => {
                const known = n < reached || step === 5;
                return (
                  <li key={r.k} className="border-b border-white/12">
                    <button type="button" disabled={!known || status === "sending"} onClick={() => go(n)} className="flex w-full items-baseline justify-between gap-4 py-3 text-left text-[0.9375rem] enabled:hover:text-white disabled:cursor-default">
                      <span className="text-white/55">{r.k}</span>
                      <span className={`font-[600] ${known ? "text-white" : "text-white/30"}`}>{known ? r.v : "à préciser"}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-auto hidden pt-6 text-[0.8125rem] leading-[1.45] text-white/50 lg:block">Montant TTC indicatif, à confirmer après une visite gratuite.</p>
          </div>

          <div className="min-h-[24.5rem] min-w-0 p-5 md:p-8 lg:min-h-[470px] lg:p-10">
            {status === "done" && result ? (
              <div role="status">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-volet text-white">
                  <Check className="h-6 w-6" />
                </span>
                {result.emailed ? (
                  <>
                    <h3 className="mt-5 text-[1.75rem] font-[650] leading-[1.1] tracking-[-0.03em]">C&apos;est envoyé.</h3>
                    <p className="mt-3 max-w-[44ch] leading-[1.5] text-ardoise">
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
                    <p className="mt-3 max-w-[44ch] leading-[1.5] text-ardoise">L&apos;email n&apos;a pas pu partir, la voici donc directement. Montant TTC indicatif, à confirmer après visite.</p>
                  </>
                )}
                <p className="mt-5 max-w-[44ch] border-t border-trait pt-5 leading-[1.5] text-ardoise">On vous rappelle sous {site.callbackDelay} pour l&apos;affiner lors d&apos;une visite gratuite.</p>
                <a href={`tel:${site.phoneHref}`} className="btn btn-call mt-6 w-full tabular-nums sm:w-auto">
                  <Phone className="h-5 w-5" />
                  Appeler le {site.phone}
                </a>
              </div>
            ) : (
              <>
                {/* où on en est : cinq traits, et le retour d'un cran */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => go(step - 1)}
                    disabled={step === 0 || status === "sending"}
                    aria-label="Question précédente"
                    className="-ml-1.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-encre transition-[background-color,opacity] enabled:hover:bg-gris disabled:opacity-0"
                  >
                    <Chevron className="h-5 w-5 rotate-180" />
                  </button>
                  <div className="flex flex-1 gap-1.5" aria-hidden>
                    {questions.map((q, n) => (
                      <span key={q} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${n < step ? "bg-encre" : n === step ? "bg-tuile" : "bg-gris-2"}`} />
                    ))}
                  </div>
                  <p className="shrink-0 text-[0.875rem] tabular-nums text-ardoise" aria-live="polite">
                    {step < 5 ? `${step + 1} sur 5` : "Dernière étape"}
                  </p>
                </div>

                {step < 5 && (
                  <fieldset key={step} className="apparait mt-6 min-w-0 md:mt-8">
                    <legend className="text-[1.5rem] font-[650] leading-[1.15] tracking-[-0.03em] md:text-[1.875rem]">{questions[step]}</legend>

                    {step === 0 && (
                      <div className="mt-5 grid gap-2 sm:grid-cols-2 md:mt-7">
                        {simulatorWorks.map((w) => (
                          <Choice key={w.id} on={w.id === work && reached > 0} label={w.label} hint={w.detail} onClick={() => pick(() => setWork(w.id))} />
                        ))}
                      </div>
                    )}

                    {step === 1 && (
                      <div className="mt-5 md:mt-7">
                        <output htmlFor="surface" className="block text-[clamp(2.75rem,13vw,3.75rem)] font-[650] leading-none tracking-[-0.04em] tabular-nums">
                          {surface}
                          <span className="ml-1.5 text-[0.45em] font-[600] tracking-[-0.02em] text-ardoise">m²</span>
                        </output>
                        <label htmlFor="surface" className="sr-only">
                          Surface de façade en mètres carrés
                        </label>
                        <input id="surface" type="range" min={SURFACE.min} max={SURFACE.max} step={SURFACE.step} value={surface} onChange={(e) => setSurface(Number(e.target.value))} className="range mt-3" style={{ ["--p" as string]: `${pct}%` }} />
                        <div className="mt-1 flex flex-wrap gap-2">
                          {[
                            ["Petite maison", 90],
                            ["Maison à étage", 140],
                            ["Grande maison", 220],
                          ].map(([l, v]) => (
                            <button key={l} type="button" onClick={() => setSurface(v as number)} className={`h-9 rounded-full px-3.5 text-[0.875rem] font-[560] transition-colors ${surface === v ? "bg-encre text-white" : "bg-gris text-encre hover:bg-gris-2"}`}>
                              {l}
                            </button>
                          ))}
                        </div>
                        <p className="mt-4 max-w-[46ch] text-[0.875rem] leading-[1.45] text-ardoise">Pas besoin d&apos;être précis&nbsp;: la surface exacte est mesurée lors de la visite.</p>
                        <button type="button" className="btn btn-ink mt-6 w-full sm:w-auto sm:px-9" onClick={() => go(2)}>
                          Continuer
                        </button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="mt-5 grid gap-2 md:mt-7">
                        {propertyTypes.map((o) => (
                          <Choice key={o.id} on={o.id === property && reached > 2} label={o.label} onClick={() => pick(() => setProperty(o.id))} />
                        ))}
                      </div>
                    )}
                    {step === 3 && (
                      <div className="mt-5 grid gap-2 md:mt-7">
                        {conditions.map((o) => (
                          <Choice key={o.id} on={o.id === condition && reached > 3} label={o.label} hint={o.hint} onClick={() => pick(() => setCondition(o.id))} />
                        ))}
                      </div>
                    )}
                    {step === 4 && (
                      <div className="mt-5 grid gap-2 md:mt-7">
                        {heights.map((o) => (
                          <Choice key={o.id} on={o.id === height && reached > 4} label={o.label} onClick={() => pick(() => setHeight(o.id))} />
                        ))}
                      </div>
                    )}
                  </fieldset>
                )}

                {step === 5 && (
                  <form onSubmit={submit} noValidate className="apparait mt-6 md:mt-8">
                    <h3 className="text-[1.5rem] font-[650] leading-[1.15] tracking-[-0.03em] md:text-[1.875rem]">Où faut-il vous l&apos;envoyer&nbsp;?</h3>
                    <p className="mt-2 text-[0.9375rem] leading-[1.45] text-ardoise lg:hidden">
                      {workLabel}, {surface}&nbsp;m², {recap[2].v.toLowerCase()}, {recap[4].v.toLowerCase()}.
                    </p>
                    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
                      <label>
                        Ne pas remplir
                        <input tabIndex={-1} autoComplete="off" value={c.website} onChange={(e) => set("website", e.target.value)} />
                      </label>
                    </div>
                    <div className="mt-5 grid grid-cols-[1.3fr_1fr] gap-3 sm:grid-cols-2 [&>*:nth-child(-n+2)]:col-span-2 sm:[&>*:nth-child(-n+2)]:col-span-1">
                      <Field label="Nom et prénom" error={errors.name}>
                        <input className="field" autoComplete="name" value={c.name} aria-invalid={!!errors.name} onChange={(e) => set("name", e.target.value)} />
                      </Field>
                      <Field label="Email" error={errors.email}>
                        <input className="field" type="email" inputMode="email" autoComplete="email" placeholder="vous@exemple.fr" value={c.email} aria-invalid={!!errors.email} onChange={(e) => set("email", e.target.value)} />
                      </Field>
                      <Field label="Téléphone" error={errors.phone}>
                        <input className="field" type="tel" autoComplete="tel" placeholder="06 12 34 56 78" value={c.phone} aria-invalid={!!errors.phone} onChange={(e) => set("phone", e.target.value)} />
                      </Field>
                      <Field label="Code postal" error={errors.postalCode}>
                        <input className="field" inputMode="numeric" autoComplete="postal-code" maxLength={5} placeholder="41000" value={c.postalCode} aria-invalid={!!errors.postalCode} onChange={(e) => set("postalCode", e.target.value.replace(/\D/g, ""))} />
                      </Field>
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
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                      <button type="submit" className="btn btn-cta w-full sm:w-auto sm:px-8" disabled={status === "sending"}>
                        {status === "sending" ? "Envoi en cours..." : "Recevoir mon estimation"}
                      </button>
                      <p className="text-center text-[0.8125rem] leading-[1.45] text-brume sm:text-left">Gratuit et sans engagement.</p>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Une réponse possible : une ligne entière à toucher, qui se remplit quand elle est choisie. */
function Choice({ on, label, hint, onClick }: { on: boolean; label: string; hint?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`group flex min-h-[3.75rem] w-full items-center justify-between gap-4 rounded-[18px] px-4 py-3 text-left transition-[background-color,box-shadow,color,transform] duration-200 active:scale-[0.985] md:px-5 ${
        on ? "bg-encre text-white" : "bg-gris text-encre hover:bg-gris-2"
      }`}
    >
      <span className="leading-tight">
        <span className="block text-[1.0625rem] font-[620] tracking-[-0.01em]">{label}</span>
        {hint && <span className={`mt-0.5 block text-[0.875rem] ${on ? "text-white/65" : "text-ardoise"}`}>{hint}</span>}
      </span>
      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors ${on ? "bg-white text-encre" : "bg-white text-transparent shadow-[inset_0_0_0_1.5px_var(--color-trait)] group-hover:shadow-[inset_0_0_0_1.5px_var(--color-brume)]"}`}>
        <Check className="h-3.5 w-3.5" />
      </span>
    </button>
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
