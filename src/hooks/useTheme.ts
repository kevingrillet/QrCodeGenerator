/**
 * Hook de gestion du thème clair/sombre.
 *
 * Stratégie (identique au petit script inline dans index.html qui évite le flash) :
 *  1. on lit la préférence enregistrée dans localStorage (clé "theme") ;
 *  2. à défaut, on suit la préférence système (prefers-color-scheme) ;
 *  3. le thème est appliqué en ajoutant/retirant la classe `dark` sur <html>,
 *     ce qui active les variantes `dark:` de Tailwind.
 */
import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/** Détermine le thème initial à partir de localStorage puis du système. */
export function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* localStorage indisponible (mode privé, etc.) : on ignore. */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Applique le thème au document et le persiste. */
function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* localStorage indisponible : on ignore la persistance. */
  }
}

export interface UseThemeResult {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export function useTheme(): UseThemeResult {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggleTheme = useCallback(
    () => setThemeState((current) => (current === 'dark' ? 'light' : 'dark')),
    [],
  );

  return { theme, setTheme, toggleTheme };
}
