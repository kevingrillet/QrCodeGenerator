import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

/**
 * Tests d'intégration légers de l'app sous jsdom. Le rendu réel du <canvas> du QR
 * dépend du navigateur (couvert par Playwright) ; ici on vérifie l'assemblage,
 * la navigation entre types et l'état "prêt / pas prêt".
 */
describe('App', () => {
  it('affiche le titre et le type Texte par défaut', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Générateur de QR code' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Texte' })).toHaveAttribute('aria-selected', 'true');
  });

  it("invite à remplir le formulaire tant qu'aucune donnée n'est saisie", () => {
    render(<App />);
    expect(screen.getByText(/Remplissez le formulaire/i)).toBeInTheDocument();
  });

  it('change de type quand on clique sur un autre onglet', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('tab', { name: 'WiFi' }));
    expect(screen.getByLabelText(/Nom du réseau \(SSID\)/)).toBeInTheDocument();
  });

  it('désactive les téléchargements tant que le formulaire est incomplet', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Télécharger PNG' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Télécharger SVG' })).toBeDisabled();
  });
});
