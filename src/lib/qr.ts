/**
 * Adaptateur autour de la librairie `qrcode` (pattern Adapter).
 *
 * Tout le reste de l'application passe par ce module pour générer/télécharger un QR.
 * Si l'on voulait un jour changer de moteur d'encodage, seul ce fichier serait à
 * modifier. On expose un rendu canvas (aperçu + export PNG) et un rendu SVG (export
 * vectoriel), plus des utilitaires de téléchargement côté navigateur.
 */
import QRCode from 'qrcode';

/** Niveau de correction d'erreur (plus haut = plus robuste mais plus dense). */
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export interface QrColors {
  /** Couleur des modules (premier plan). */
  dark: string;
  /** Couleur du fond. */
  light: string;
}

export interface QrRenderOptions {
  errorCorrectionLevel?: ErrorCorrectionLevel;
  /** Marge (quiet zone) en nombre de modules. */
  margin?: number;
  /** Largeur du rendu en pixels (canvas/PNG). */
  width?: number;
  colors?: QrColors;
}

/** Valeurs par défaut, fusionnées avec les options fournies. */
function toLibOptions(options: QrRenderOptions = {}): QRCode.QRCodeToDataURLOptions {
  return {
    errorCorrectionLevel: options.errorCorrectionLevel ?? 'M',
    margin: options.margin ?? 2,
    width: options.width ?? 256,
    color: {
      dark: options.colors?.dark ?? '#000000',
      light: options.colors?.light ?? '#ffffff',
    },
  };
}

/** Dessine le QR dans un élément <canvas> existant (utilisé pour l'aperçu). */
export async function renderToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  options?: QrRenderOptions,
): Promise<void> {
  await QRCode.toCanvas(canvas, text, toLibOptions(options));
}

/** Produit le QR sous forme de chaîne SVG (export vectoriel). */
export async function renderToSvgString(text: string, options?: QrRenderOptions): Promise<string> {
  const libOptions = toLibOptions(options);
  return QRCode.toString(text, {
    type: 'svg',
    errorCorrectionLevel: libOptions.errorCorrectionLevel,
    margin: libOptions.margin,
    width: libOptions.width,
    color: libOptions.color,
  });
}

/** Produit le QR sous forme de Data URL PNG. */
export async function toPngDataUrl(text: string, options?: QrRenderOptions): Promise<string> {
  return QRCode.toDataURL(text, toLibOptions(options));
}

/** Déclenche le téléchargement d'un fichier à partir d'une URL (data: ou blob:). */
function triggerDownload(href: string, filename: string): void {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Télécharge le QR au format PNG. */
export async function downloadPng(
  text: string,
  filename = 'qrcode.png',
  options?: QrRenderOptions,
): Promise<void> {
  const dataUrl = await toPngDataUrl(text, options);
  triggerDownload(dataUrl, filename);
}

/** Télécharge le QR au format SVG. */
export async function downloadSvg(
  text: string,
  filename = 'qrcode.svg',
  options?: QrRenderOptions,
): Promise<void> {
  const svg = await renderToSvgString(text, options);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  try {
    triggerDownload(url, filename);
  } finally {
    URL.revokeObjectURL(url);
  }
}
