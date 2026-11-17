import { Logo } from "./Nav";

export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white px-5 py-10">
      <div className="mx-auto max-w-[720px]">
        <a href="/" className="text-ardoise" aria-label="Retour à l'accueil">
          <Logo />
        </a>
        <h1 className="headline mt-14 text-[clamp(2.2rem,5vw,3.4rem)]">{title}</h1>
        <div className="mt-8 space-y-5 text-[1.02rem] leading-relaxed text-ardoise/85 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-[620] [&_h2]:text-ardoise">{children}</div>
        <p className="mt-14">
          <a href="/" className="link">
            Retour à l&apos;accueil
          </a>
        </p>
      </div>
    </div>
  );
}
