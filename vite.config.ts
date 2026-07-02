import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Configuration Vite + Vitest.
 *
 * `base: './'` génère des chemins d'assets RELATIFS dans le build. C'est ce qui
 * permet au site de fonctionner sur GitHub Pages sous un sous-chemin de projet
 * (`https://<user>.github.io/<repo>/`) sans avoir à coder en dur le nom du dépôt.
 */
export default defineConfig({
  base: './',
  plugins: [react()],
  // Configuration des tests unitaires/composants (Vitest).
  // Les tests d'intégration end-to-end sont gérés séparément par Playwright.
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // On exclut les tests Playwright (dossier tests/) de Vitest.
    exclude: ['node_modules', 'dist', 'tests/**', '.storybook/**'],
    coverage: {
      provider: 'v8',
      // `text` pour la lecture locale, `text-summary` pour le récap, `json-summary`
      // + `lcov` pour la CI (résumé exploitable dans le job / outils externes).
      reporter: ['text', 'text-summary', 'json-summary', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.stories.tsx', 'src/test/**', 'src/main.tsx'],
      // Seuils volontairement en dessous de la couverture réelle (marge de sécurité) :
      // ils protègent contre une régression sans casser le vert au moindre ajout.
      thresholds: {
        lines: 80,
        functions: 80,
        statements: 80,
        branches: 75,
      },
    },
  },
});
