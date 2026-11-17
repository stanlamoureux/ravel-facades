"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/config/site";
import { SLOTS, callbackSchema } from "@/lib/callback";
import { Check } from "./icons";

type Errors = Partial<Record<"name" | "phone" | "consent", string>>;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="t-label">{label}</span>
      <span className="mt-1.5 block">{children}</span>
      {error && <span className="mt-1.5 block text-[0.875rem] text-alerte">{error}</span>}
    </label>
  );
}

/** Demande de rappel : un nom, un numéro, un créneau. C'est l'entreprise qui appelle. */
export function Callback({ service, source }: { service: string; source: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [slot, setSlot] = useState<(typeof SLOTS)[number]>(SLOTS[0]);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { service, name, phone, slot, consent, source, page: window.location.pathname, website, startedAt: startedAt.current };
    const check = callbackSchema.safeParse(payload);
    if (!check.success) {
      const errs: Errors = {};
      for (const issue of check.error.issues) {
        const k = issue.path[0];
        if ((k === "name" || k === "phone" || k === "consent") && !errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      requestAnimationFrame(() => (form.current?.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus());
      if (Object.keys(errs).length) return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/rappel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
      <div data-form-zone className="rounded-[28px] bg-white p-6 text-encre md:rounded-[32px] md:p-9" role="status">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-volet text-white">
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-5 text-[1.75rem] font-[650] leading-[1.1] tracking-[-0.03em]">C&apos;est noté, {name.trim().split(" ")[0]}.</h3>
        <p className="mt-3 leading-[1.5] text-ardoise">
          Un technicien vous appelle au <span className="font-[600] tabular-nums text-encre">{phone}</span>
          {slot === SLOTS[0] ? "" : `, ${slot.toLowerCase()}`}, sous {site.callbackDelay}. L&apos;appel viendra du {site.phone}.
        </p>
      </div>
    );
  }

  return (
    <form ref={form} onSubmit={submit} noValidate data-form-zone className="rounded-[28px] bg-white p-6 text-encre md:rounded-[32px] md:p-9">
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Ne pas remplir
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>
      <div className="grid gap-3">
        <Field label="Nom et prénom" error={errors.name}>
          <input
            className="field"
            autoComplete="name"
            value={name}
            aria-invalid={!!errors.name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((x) => ({ ...x, name: undefined }));
            }}
          />
        </Field>
        <Field label="Téléphone" error={errors.phone}>
          <input
            className="field"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="06 12 34 56 78"
            value={phone}
            aria-invalid={!!errors.phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setErrors((x) => ({ ...x, phone: undefined }));
            }}
          />
        </Field>
      </div>

      <fieldset className="mt-5">
        <legend className="t-label">Quand vous appeler&nbsp;?</legend>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {SLOTS.map((s) => (
            <button key={s} type="button" className="chip" data-on={slot === s} aria-pressed={slot === s} onClick={() => setSlot(s)}>
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-[0.8125rem] leading-[1.5] text-ardoise">
        <input
          type="checkbox"
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#0e1a26]"
          checked={consent}
          aria-invalid={!!errors.consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            setErrors((x) => ({ ...x, consent: undefined }));
          }}
        />
        <span>
          J&apos;accepte d&apos;être rappelé au sujet de mon projet. Mes données ne sont ni revendues ni utilisées pour de la publicité.{" "}
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
      <button type="submit" className="btn btn-cta mt-5 w-full" disabled={status === "sending"}>
        {status === "sending" ? "Envoi en cours..." : "Être rappelé"}
      </button>
      <p className="mt-3 text-center text-[0.8125rem] leading-[1.45] text-brume">Gratuit et sans engagement.</p>
    </form>
  );
}
