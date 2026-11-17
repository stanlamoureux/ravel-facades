type P = { className?: string };

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const Phone = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M5 3.5h3.2l1.6 4.2-2 1.3a11 11 0 0 0 7.2 7.2l1.3-2 4.2 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16.5 16.5 0 0 1 3.4 5.2 1.6 1.6 0 0 1 5 3.5Z" />
  </svg>
);

export const Star = ({ className }: P) => (
  <svg viewBox="0 0 20 20" className={className} fill="currentColor" aria-hidden>
    <path d="M10 1.6l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.5l-5.1 2.8L6 11.6l-4.3-4 5.8-.7z" />
  </svg>
);

export const Shield = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.4-7.5 9.5-4.3-1.1-7.5-4.9-7.5-9.5V6z" />
    <path d="M8.5 12l2.4 2.4 4.6-4.8" />
  </svg>
);

export const Clock = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const Check = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2.2} aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const Arrow = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Chevron = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2} aria-hidden>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const Plus = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2} aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Menu = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2} aria-hidden>
    <path d="M4 8.5h16M4 15.5h16" />
  </svg>
);

export const Close = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2} aria-hidden>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Pin = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

/** Poignée du comparateur avant / après. */
export const Grip = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} strokeWidth={2} aria-hidden>
    <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
  </svg>
);

export const Lock = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </svg>
);

export const Mail = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
    <path d="M4.5 7.5l7.5 6 7.5-6" />
  </svg>
);
