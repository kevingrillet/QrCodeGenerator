/**
 * Setup global des tests Vitest.
 * Ajoute les matchers DOM de @testing-library/jest-dom (toBeInTheDocument, etc.)
 * et nettoie le DOM rendu après chaque test.
 */
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom n'implémente pas matchMedia : on fournit un polyfill minimal (utilisé par useTheme).
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// Langue déterministe pour les tests : on force le français (sinon la langue du
// navigateur jsdom, "en-US", ferait basculer l'app en anglais).
Object.defineProperty(window.navigator, 'language', { value: 'fr-FR', configurable: true });

afterEach(() => {
  cleanup();
  // Évite toute fuite d'état (thème/langue) d'un test à l'autre.
  window.localStorage.clear();
});
