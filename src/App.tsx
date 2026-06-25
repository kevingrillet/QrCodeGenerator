/**
 * Composant racine : assemble le sélecteur de type, le formulaire dynamique et
 * l'aperçu du QR. Tout l'état vit ici (type actif + valeurs par type).
 *
 * `App` fournit le contexte i18n (`I18nProvider`) puis délègue le rendu à
 * `AppContent`, qui consomme les hooks de thème et de langue. Les valeurs du
 * formulaire sont mémorisées PAR type : changer de type puis revenir conserve
 * ce qui avait été saisi.
 */
import { useMemo, useState } from 'react';
import { TypeSelector } from './components/TypeSelector';
import { QrForm } from './components/QrForm';
import { QrPreview } from './components/QrPreview';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useTheme } from './hooks/useTheme';
import { I18nProvider, useI18n } from './i18n/I18nProvider';
import { PAYLOAD_TYPES, getPayloadType, isReady, type FieldValues } from './lib/payloads';

/** Construit l'état initial : les valeurs par défaut de chaque type. */
function buildInitialValues(): Record<string, FieldValues> {
  return Object.fromEntries(PAYLOAD_TYPES.map((type) => [type.id, { ...type.defaults }]));
}

function AppContent() {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [activeId, setActiveId] = useState<string>(PAYLOAD_TYPES[0].id);
  const [valuesByType, setValuesByType] = useState<Record<string, FieldValues>>(buildInitialValues);

  const activeType = getPayloadType(activeId);
  const values = valuesByType[activeId];

  const handleChange = (name: string, value: string | boolean) => {
    setValuesByType((current) => ({
      ...current,
      [activeId]: { ...current[activeId], [name]: value },
    }));
  };

  // Le payload (chaîne encodée) et l'état "prêt" sont dérivés des valeurs.
  const payload = useMemo(() => activeType.build(values), [activeType, values]);
  const ready = isReady(activeType, values);

  return (
    <div className="min-h-full bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t('app.title')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t(activeType.descriptionKey)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </header>

        <TypeSelector types={PAYLOAD_TYPES} activeId={activeId} onChange={setActiveId} />

        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <section>
            <QrForm type={activeType} values={values} onChange={handleChange} />
          </section>
          <section className="flex items-start justify-center md:justify-end">
            <QrPreview text={payload} ready={ready} filenameBase={`qrcode-${activeId}`} />
          </section>
        </div>

        <footer className="mt-12 text-center text-xs text-gray-400">{t('app.privacy')}</footer>
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
