/**
 * Tests unitaires de `QrPreview` — le composant le plus riche du domaine.
 *
 * On MOCKE `qr-code-styling` (seul point qui touche le canvas et la lib externe)
 * pour piloter de façon déterministe les trois comportements clés, sans rendu
 * graphique réel :
 *  1. rendu OK : un `<canvas>` est ajouté et les exports sont activés ;
 *  2. échec d'encodage (ex. densité trop basse) : message d'erreur affiché ;
 *  3. copie presse-papier : chemin nominal (ClipboardItem + write) ET repli
 *     (API indisponible → indication « clic droit »).
 * Le garde-fou de capacité (`tooLong`) est aussi couvert ici.
 *
 * `data === '__ENCODE_FAIL__'` fait échouer le constructeur du mock : c'est notre
 * levier pour simuler un échec d'encodage à partir de la chaîne à encoder.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { QrPreview, type QrPreviewProps } from './QrPreview';
import { renderA11y } from '../test/a11y';

const { downloadSpy } = vi.hoisted(() => ({
  downloadSpy: vi.fn((args: unknown) => Promise.resolve(args)),
}));

vi.mock('qr-code-styling', () => {
  class MockQRCodeStyling {
    constructor(options: { data?: string }) {
      if (options?.data === '__ENCODE_FAIL__') throw new Error('encode failed');
    }
    append(container: HTMLElement) {
      const canvas = document.createElement('canvas');
      // jsdom n'implémente pas toBlob : on le simule pour tester la copie.
      canvas.toBlob = (cb: BlobCallback) => cb(new Blob(['png'], { type: 'image/png' }));
      container.appendChild(canvas);
    }
    update(options: { data?: string }) {
      if (options?.data === '__ENCODE_FAIL__') throw new Error('encode failed');
    }
    download(args: unknown) {
      return downloadSpy(args);
    }
  }
  return { default: MockQRCodeStyling };
});

const baseProps: QrPreviewProps = {
  text: 'https://exemple.com',
  ready: true,
  colors: { dark: '#000000', light: '#ffffff' },
  shape: 'square',
  ecLevel: 'M',
  density: 0,
  size: 512,
};

function renderPreview(overrides: Partial<QrPreviewProps> = {}) {
  return renderA11y(<QrPreview {...baseProps} {...overrides} />);
}

beforeEach(() => {
  downloadSpy.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('QrPreview — rendu', () => {
  it('ajoute un <canvas> et active les exports quand le formulaire est prêt', async () => {
    renderPreview();
    const container = screen.getByTestId('qr-canvas');
    await waitFor(() => expect(container.querySelector('canvas')).not.toBeNull());
    expect(screen.getByRole('button', { name: 'Télécharger PNG' })).toBeEnabled();
  });

  it('affiche l’invite et n’active rien tant que le formulaire n’est pas prêt', () => {
    renderPreview({ ready: false, text: '' });
    expect(screen.getByText(/Remplissez le formulaire/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Télécharger PNG' })).toBeDisabled();
  });

  it('télécharge un PNG à la taille demandée via l’adaptateur', async () => {
    const { user } = renderPreview();
    await waitFor(() =>
      expect(screen.getByTestId('qr-canvas').querySelector('canvas')).not.toBeNull(),
    );
    await user.click(screen.getByRole('button', { name: 'Télécharger PNG' }));
    expect(downloadSpy).toHaveBeenCalledWith({ name: 'qrcode', extension: 'png' });
  });
});

describe('QrPreview — erreur d’encodage', () => {
  it('affiche un message d’erreur quand l’encodage échoue (et désactive les exports)', async () => {
    renderPreview({ text: '__ENCODE_FAIL__' });
    await waitFor(() => expect(screen.getByText('Erreur de génération')).toBeInTheDocument());
    expect(screen.getByTestId('qr-canvas')).toHaveClass('hidden');
    expect(screen.getByRole('button', { name: 'Télécharger SVG' })).toBeDisabled();
  });
});

describe('QrPreview — garde-fou de capacité', () => {
  it('affiche un message clair quand le contenu dépasse la capacité du QR', () => {
    // 2000 octets > capacité H (1273) : trop long, aucun rendu tenté.
    renderPreview({ text: 'a'.repeat(2000), ecLevel: 'H' });
    expect(screen.getByText(/Contenu trop long/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Copier/ })).toBeDisabled();
  });
});

describe('QrPreview — copie presse-papier', () => {
  it('copie l’image via l’API Clipboard (chemin nominal)', async () => {
    const { user } = renderPreview();
    await waitFor(() =>
      expect(screen.getByTestId('qr-canvas').querySelector('canvas')).not.toBeNull(),
    );

    // `userEvent.setup()` a pu poser son propre `navigator.clipboard` : on force
    // notre espion APRÈS le rendu pour observer l'appel réel du composant.
    const write = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { write } });
    vi.stubGlobal(
      'ClipboardItem',
      class {
        constructor(public items: Record<string, unknown>) {}
      },
    );

    await user.click(screen.getByRole('button', { name: /^Copier/ }));

    expect(write).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Copié !' })).toBeInTheDocument(),
    );
  });

  it('bascule sur l’indication « clic droit » quand l’API Clipboard est absente', async () => {
    // Pas de ClipboardItem → repli (Firefox anciens / navigateurs sans write image).
    vi.stubGlobal('ClipboardItem', undefined);

    const { user } = renderPreview();
    await waitFor(() =>
      expect(screen.getByTestId('qr-canvas').querySelector('canvas')).not.toBeNull(),
    );

    await user.click(screen.getByRole('button', { name: /^Copier/ }));

    expect(await screen.findByText(/Copie non disponible/i)).toBeInTheDocument();
  });
});
