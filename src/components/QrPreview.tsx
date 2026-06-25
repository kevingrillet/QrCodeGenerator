/**
 * Aperçu du QR code + boutons de téléchargement (PNG / SVG).
 *
 * Le QR est dessiné dans un <canvas> via l'adaptateur `lib/qr`. Tant que le
 * formulaire n'est pas exploitable (`ready === false`), on affiche un message
 * d'invite plutôt qu'un QR vide. Par défaut le QR est rendu en noir sur blanc
 * (meilleur contraste, lisibilité optimale par les scanners) mais l'utilisateur
 * peut personnaliser la couleur des modules et celle du fond via deux color pickers.
 */
import { useEffect, useRef, useState } from 'react';
import { downloadPng, downloadSvg, renderToCanvas } from '../lib/qr';
import { useI18n } from '../i18n/I18nProvider';

export interface QrPreviewProps {
  /** Chaîne à encoder. */
  text: string;
  /** Le formulaire contient-il les informations minimales requises ? */
  ready: boolean;
  /** Préfixe du nom de fichier au téléchargement. */
  filenameBase?: string;
}

const QR_WIDTH = 256;
const DEFAULT_DARK = '#000000';
const DEFAULT_LIGHT = '#ffffff';

export function QrPreview({ text, ready, filenameBase = 'qrcode' }: QrPreviewProps) {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dark, setDark] = useState(DEFAULT_DARK);
  const [light, setLight] = useState(DEFAULT_LIGHT);

  const colors = { dark, light };

  useEffect(() => {
    if (!ready || !canvasRef.current) return;
    let cancelled = false;
    renderToCanvas(canvasRef.current, text, { width: QR_WIDTH, colors })
      .then(() => {
        if (!cancelled) setError(null);
      })
      .catch(() => {
        if (!cancelled) setError(t('preview.error'));
      });
    return () => {
      cancelled = true;
    };
  }, [text, ready, t, dark, light]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex h-[256px] w-[256px] items-center justify-center rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-700">
        {ready ? (
          <canvas
            ref={canvasRef}
            width={QR_WIDTH}
            height={QR_WIDTH}
            role="img"
            aria-label={t('preview.alt')}
            data-testid="qr-canvas"
          />
        ) : (
          <p className="px-4 text-center text-sm text-gray-400">{t('preview.prompt')}</p>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input
            type="color"
            value={dark}
            onChange={(e) => setDark(e.target.value)}
            aria-label={t('preview.foregroundColor')}
            className="h-8 w-8 cursor-pointer rounded border border-gray-300 bg-transparent dark:border-gray-600"
          />
          {t('preview.foregroundColor')}
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <input
            type="color"
            value={light}
            onChange={(e) => setLight(e.target.value)}
            aria-label={t('preview.backgroundColor')}
            className="h-8 w-8 cursor-pointer rounded border border-gray-300 bg-transparent dark:border-gray-600"
          />
          {t('preview.backgroundColor')}
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={!ready}
          onClick={() => downloadPng(text, `${filenameBase}.png`, { width: 1024, colors })}
          className="min-w-[9rem] rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t('preview.downloadPng')}
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={() => downloadSvg(text, `${filenameBase}.svg`, { colors })}
          className="min-w-[9rem] rounded-lg border border-indigo-600 px-4 py-2 text-center text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-gray-800"
        >
          {t('preview.downloadSvg')}
        </button>
      </div>
    </div>
  );
}
