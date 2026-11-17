type P = { className?: string };

export const Phone = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 3.5h3.2l1.6 4.2-2 1.3a11 11 0 0 0 7.2 7.2l1.3-2 4.2 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16.5 16.5 0 0 1 3.4 5.2 1.6 1.6 0 0 1 5 3.5Z" />
  </svg>
);

export const Star = ({ className }: P) => (
  <svg viewBox="0 0 20 20" className={className} fill="currentColor" aria-hidden>
    <path d="M10 1.6l2.5 5.3 5.8.7-4.3 4 1.1 5.7L10 14.5l-5.1 2.8L6 11.6l-4.3-4 5.8-.7z" />
  </svg>
);

export const Shield = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
    <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.4-7.5 9.5-4.3-1.1-7.5-4.9-7.5-9.5V6z" />
    <path d="M8.5 12l2.4 2.4 4.6-4.8" strokeLinecap="round" />
  </svg>
);

export const Clock = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const Check = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const Plus = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Arrow = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Pin = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

/* Pictos métier pour la grille de prestations */
export const IconRoller = ({ className }: P) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden>
    <rect x="7" y="7" width="28" height="11" rx="3" />
    <path d="M35 12.5h5v10H24v6" strokeLinecap="round" />
    <rect x="21" y="28.5" width="6" height="13" rx="2" />
  </svg>
);
export const IconWater = ({ className }: P) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 15h11a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-4l-2 9H6l1.5-9H5z" />
    <path d="M19 18.5h13" />
    <path d="M36 18.5l8-6M36 18.5h9M36 18.5l8 6" />
    <path d="M38 31v.01M43 33v.01M40 37v.01" strokeWidth="3.2" />
  </svg>
);
export const IconDrop = ({ className }: P) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden>
    <path d="M24 6s11 12.5 11 21a11 11 0 0 1-22 0C13 18.5 24 6 24 6z" />
    <path d="M18.5 28a5.5 5.5 0 0 0 5.5 5.5" strokeLinecap="round" />
  </svg>
);
export const IconCrack = ({ className }: P) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="6" y="6" width="36" height="36" rx="4" />
    <path d="M22 6l4 9-6 6 7 7-4 6 3 8" />
  </svg>
);
export const IconLayers = ({ className }: P) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden>
    <path d="M8 10h10v30H8zM18 10h8v30h-8zM26 10h14v30H26z" />
    <path d="M10 16h6M10 22h6M10 28h6M10 34h6" strokeLinecap="round" />
  </svg>
);
export const IconWall = ({ className }: P) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden>
    <path d="M6 12h36v26H6zM6 21h36M6 30h36M18 12v9M30 12v9M12 21v9M24 21v9M36 21v9M18 30v8M30 30v8" />
  </svg>
);
