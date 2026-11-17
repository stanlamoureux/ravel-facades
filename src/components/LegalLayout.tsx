import { Logo } from "./Nav";

export function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="wrap !max-w-[760px]">
        <a href="/" aria-label="Retour à l'accueil">
          <Logo />
        </a>
        <h1 className="t-h2 mt-14">{title}</h1>
        <div className="mt-8 space-y-5 leading-[1.65] text-ardoise md:text-[1.0625rem] [&_h2]:mt-10 [&_h2]:text-[1.25rem] [&_h2]:font-[640] [&_h2]:tracking-[-0.02em] [&_h2]:text-encre">{children}</div>
        <p className="mt-14">
          <a href="/" className="link">
            Retour à l&apos;accueil
          </a>
        </p>
      </div>
    </div>
  );
}
