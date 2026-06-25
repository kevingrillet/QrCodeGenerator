/**
 * Bouton de bascule entre thème clair et sombre.
 * Contrôlé : reçoit le thème courant et un callback de bascule (voir useTheme).
 */
import type { Theme } from '../hooks/useTheme';
import { useI18n } from '../i18n/I18nProvider';

export interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const { t } = useI18n();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? t('theme.toLight') : t('theme.toDark')}
      title={isDark ? t('theme.light') : t('theme.dark')}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-xl text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    >
      <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
    </button>
  );
}
