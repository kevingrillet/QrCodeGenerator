/**
 * Composant racine : assemble le sélecteur de type, le formulaire dynamique
 * (section « Contenu »), la personnalisation (« Couleur », « Forme ») et l'aperçu
 * du QR (export + téléchargement).
 *
 * Tout l'état vit ici : type actif, valeurs PAR type (changer de type puis revenir
 * conserve la saisie), et le style du QR (couleurs, forme, correction, taille)
 * partagé entre les contrôles de personnalisation et l'aperçu.
 *
 * `App` fournit le contexte i18n (`I18nProvider`) puis délègue à `AppContent`.
 */
import { useMemo, useState } from 'react';
import { TypeSelector } from './components/TypeSelector';
import { QrForm } from './components/QrForm';
import { QrPreview } from './components/QrPreview';
import { Section } from './components/Section';
import { ColorControls, ShapeControls } from './components/QrCustomizer';
import { LogoControls } from './components/LogoControls';
import { QrOutputControls } from './components/QrOutputControls';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeSelector } from './components/ThemeSelector';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useTheme } from './hooks/useTheme';
import { I18nProvider, useI18n } from './i18n/I18nProvider';
import {
  PAYLOAD_TYPES,
  getPayloadType,
  getErrors,
  isReady,
  type FieldValues,
} from './lib/payloads';
import type { ErrorCorrectionLevel, ModuleShape, QrColors } from './lib/qr';

/** Construit l'état initial : les valeurs par défaut de chaque type. */
function buildInitialValues(): Record<string, FieldValues> {
  return Object.fromEntries(PAYLOAD_TYPES.map((type) => [type.id, { ...type.defaults }]));
}

function AppContent() {
  const { t } = useI18n();
  const { mode, toggleMode, themeName, setThemeName } = useTheme();
  const [activeId, setActiveId] = useState<string>(PAYLOAD_TYPES[0].id);
  const [valuesByType, setValuesByType] = useState<Record<string, FieldValues>>(buildInitialValues);

  // Style du QR, partagé entre la personnalisation (gauche) et l'aperçu (droite).
  const [colors, setColors] = useState<QrColors>({ dark: '#000000', light: '#ffffff' });
  const [shape, setShape] = useState<ModuleShape>('square');
  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>('M');
  const [density, setDensity] = useState<number>(0); // 0 = automatique
  const [size, setSize] = useState<number>(512);
  const [logo, setLogo] = useState<string>('');

  // Un logo masque le centre du QR : on passe en correction « H » pour qu'il reste
  // scannable (sauf si l'utilisateur a déjà choisi un niveau élevé).
  const handleLogoChange = (next: string) => {
    setLogo(next);
    if (next && (ecLevel === 'L' || ecLevel === 'M')) setEcLevel('H');
  };

  const activeType = getPayloadType(activeId);
  const values = valuesByType[activeId];

  const handleChange = (name: string, value: string | boolean) => {
    setValuesByType((current) => ({
      ...current,
      [activeId]: { ...current[activeId], [name]: value },
    }));
  };

  // Le payload (chaîne encodée), les erreurs de validation et l'état "prêt" sont
  // dérivés des valeurs. On ne génère le QR que si le formulaire est complet ET valide.
  const payload = useMemo(() => activeType.build(values), [activeType, values]);
  const errors = useMemo(() => getErrors(activeType, values), [activeType, values]);
  const ready = isReady(activeType, values) && Object.keys(errors).length === 0;

  return (
    <div className="min-h-full bg-canvas font-base text-fg">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <a
          href="#main"
          className="sr-only rounded-control bg-accent px-4 py-2 text-accent-fg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
        >
          {t('a11y.skipToContent')}
        </a>
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t('app.title')}</h1>
            <p className="text-sm text-fg-muted">{t(activeType.descriptionKey)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeSelector value={themeName} onChange={setThemeName} />
            <LanguageSwitcher />
            <ThemeToggle theme={mode} onToggle={toggleMode} />
          </div>
        </header>

        <main id="main">
          <TypeSelector types={PAYLOAD_TYPES} activeId={activeId} onChange={setActiveId} />

          <div className="mt-6 grid gap-8 md:grid-cols-[1fr_300px]">
          {/* Colonne gauche : configuration */}
          <div className="space-y-3">
            <Section title={t('sections.content')} badge={1} defaultOpen>
              <QrForm type={activeType} values={values} onChange={handleChange} errors={errors} />
            </Section>

            <h2 className="px-1 pb-1 pt-4 text-xs font-bold uppercase tracking-wider text-fg-muted">
              {t('sections.customization')}
            </h2>

            <Section title={t('sections.color')} badge={2} headingLevel={3} defaultOpen>
              <ColorControls colors={colors} onChange={setColors} />
            </Section>

            <Section title={t('sections.shape')} badge={3} headingLevel={3}>
              <ShapeControls shape={shape} onChange={setShape} />
            </Section>

            <Section title={t('sections.logo')} badge={4} headingLevel={3}>
              <LogoControls logo={logo} onChange={handleLogoChange} />
            </Section>

            <Section title={t('sections.output')} badge={5}>
              <QrOutputControls
                ecLevel={ecLevel}
                onEcLevelChange={setEcLevel}
                density={density}
                onDensityChange={setDensity}
                size={size}
                onSizeChange={setSize}
              />
            </Section>
          </div>

          {/* Colonne droite : aperçu + export */}
          <aside>
            <div className="md:sticky md:top-6">
              <QrPreview
                text={payload}
                ready={ready}
                filenameBase={`qrcode-${activeId}`}
                description={t(activeType.labelKey)}
                colors={colors}
                shape={shape}
                ecLevel={ecLevel}
                density={density}
                size={size}
                image={logo}
              />
            </div>
          </aside>
          </div>
        </main>

        <footer className="mt-12 text-center text-xs text-fg-muted">{t('app.privacy')}</footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
