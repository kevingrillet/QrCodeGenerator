import { describe, it, expect } from 'vitest';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nProvider, useI18n } from './I18nProvider';
import App from '../App';

describe('i18n - fonction de traduction', () => {
  it('résout une clé existante en français par défaut', () => {
    const { result } = renderHook(() => useI18n(), { wrapper: I18nProvider });
    expect(result.current.t('types.wifi.label')).toBe('WiFi');
    expect(result.current.t('preview.downloadPng')).toBe('Télécharger PNG');
  });

  it('renvoie la clé telle quelle si elle est inconnue', () => {
    const { result } = renderHook(() => useI18n(), { wrapper: I18nProvider });
    expect(result.current.t('clef.inexistante')).toBe('clef.inexistante');
  });
});

describe('i18n - intégration dans App', () => {
  it('affiche le français par défaut', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Générateur de QR code' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Télécharger PNG' })).toBeInTheDocument();
  });

  it("bascule toute l'interface en anglais", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Passer en anglais' }));

    expect(screen.getByRole('heading', { name: 'QR code generator' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download PNG' })).toBeInTheDocument();
    // Les boutons de type sont aussi traduits (Texte → Text).
    expect(screen.getByRole('radio', { name: 'Text' })).toBeInTheDocument();
    expect(screen.getByText(/Fill in the form/i)).toBeInTheDocument();
  });
});
