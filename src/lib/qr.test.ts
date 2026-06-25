import { describe, it, expect } from 'vitest';
import { renderToSvgString } from './qr';

/**
 * Le rendu SVG est une transformation pure (pas de <canvas>), donc testable sous
 * jsdom. Le rendu canvas/PNG dépend du moteur graphique du navigateur et est
 * couvert par les tests Playwright (tests/qr.spec.ts).
 */
describe('renderToSvgString', () => {
  it('produit un SVG non vide', async () => {
    const svg = await renderToSvgString('https://exemple.com');
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('applique les couleurs fournies', async () => {
    const svg = await renderToSvgString('test', {
      colors: { dark: '#123456', light: '#ffffff' },
    });
    expect(svg.toLowerCase()).toContain('#123456');
  });

  it('génère un rendu différent pour des contenus différents', async () => {
    const a = await renderToSvgString('AAAA');
    const b = await renderToSvgString('BBBB');
    expect(a).not.toBe(b);
  });
});
