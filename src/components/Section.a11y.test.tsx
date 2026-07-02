/**
 * Tests d'accessibilité de `Section` (carte dépliable / accordéon).
 *
 * On vérifie le motif ARIA « disclosure » : un vrai <button> d'en-tête portant
 * `aria-expanded` + `aria-controls`, enveloppé dans un titre du niveau demandé
 * (hiérarchie RGAA 9.1). Le contenu n'est présent dans le DOM que lorsque la
 * section est ouverte. Le composant n'utilise pas d'i18n (titre en prop) mais on
 * le rend via `renderA11y` pour disposer d'un `user` clavier déterministe.
 */
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { Section } from './Section';
import { renderA11y } from '../test/a11y';

describe('Section (a11y)', () => {
  it('rend un en-tête bouton dans un titre du niveau demandé, replié par défaut', () => {
    renderA11y(
      <Section title="Contenu" headingLevel={3}>
        <p>Corps de section</p>
      </Section>,
    );
    const heading = screen.getByRole('heading', { level: 3, name: 'Contenu' });
    const btn = screen.getByRole('button', { name: 'Contenu' });
    expect(heading).toContainElement(btn);
    // Replié : aria-expanded=false et contenu absent du DOM.
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Corps de section')).not.toBeInTheDocument();
  });

  it('ouvre/ferme au clic et relie le panneau via aria-controls', async () => {
    const { user } = renderA11y(
      <Section title="Contenu">
        <p>Corps de section</p>
      </Section>,
    );
    const btn = screen.getByRole('button', { name: 'Contenu' });

    await user.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    const panelId = btn.getAttribute('aria-controls');
    const panel = screen.getByText('Corps de section').closest(`#${panelId}`);
    expect(panel).not.toBeNull();

    await user.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Corps de section')).not.toBeInTheDocument();
  });

  it('est activable au clavier (Tab puis Entrée)', async () => {
    const { user } = renderA11y(
      <Section title="Contenu">
        <p>Corps de section</p>
      </Section>,
    );
    await user.tab();
    const btn = screen.getByRole('button', { name: 'Contenu' });
    expect(btn).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });
});
