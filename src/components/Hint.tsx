/**
 * Petite bulle d'aide (« ? ») affichée au survol/focus.
 * Le texte d'aide est passé en enfant ; `label` sert d'étiquette accessible.
 */
import type { ReactNode } from 'react';

export interface HintProps {
  label: string;
  children: ReactNode;
}

export function Hint({ label, children }: HintProps) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label={label}
        className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border text-[10px] font-bold leading-none text-fg-muted"
      >
        ?
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-64 -translate-x-1/2 rounded-lg bg-gray-900 p-3 text-left text-xs font-normal leading-relaxed text-gray-100 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {children}
      </span>
    </span>
  );
}
