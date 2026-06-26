/**
 * Thème visuel de l'application.
 *
 * Le thème est choisi AU MOMENT DU BUILD (ou du `dev`) via la variable
 * d'environnement `VITE_THEME`, et non par un sélecteur à l'exécution :
 *
 *   VITE_THEME=atelier npm run build
 *   VITE_THEME=aurora  npm run dev
 *
 * Les valeurs des tokens de chaque thème vivent dans `src/index.css`
 * (`[data-theme='…']`). Ici on ne gère que le choix et son application au DOM.
 */
export const THEMES = ['default', 'atelier', 'blueprint', 'aurora'] as const;
export type ThemeName = (typeof THEMES)[number];

export const DEFAULT_THEME: ThemeName = 'default';

/** Le mode clair/sombre n'a de sens que pour le thème `default`. */
export function themeSupportsDarkMode(theme: ThemeName): boolean {
  return theme === 'default';
}

/** Résout le thème demandé (valeur d'env) vers un thème valide. */
export function resolveTheme(value: string | undefined): ThemeName {
  return (THEMES as readonly string[]).includes(value ?? '') ? (value as ThemeName) : DEFAULT_THEME;
}

/** Thème actif, figé au build depuis `import.meta.env.VITE_THEME`. */
export const ACTIVE_THEME: ThemeName = resolveTheme(import.meta.env.VITE_THEME);

/** Applique un thème au document (`data-theme` sur <html>). */
export function applyTheme(theme: ThemeName): void {
  document.documentElement.dataset.theme = theme;
}
