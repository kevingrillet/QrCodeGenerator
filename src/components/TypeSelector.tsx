/**
 * Sélecteur du type de contenu QR.
 * Se génère à partir du registre des types (`PAYLOAD_TYPES`) : aucun type n'est
 * codé en dur ici.
 */
import type { PayloadType } from '../lib/payloads';
import { useI18n } from '../i18n/I18nProvider';

export interface TypeSelectorProps {
  types: PayloadType[];
  activeId: string;
  onChange: (id: string) => void;
}

export function TypeSelector({ types, activeId, onChange }: TypeSelectorProps) {
  const { t } = useI18n();
  return (
    <div role="tablist" aria-label="Type de contenu" className="flex flex-wrap gap-2">
      {types.map((type) => {
        const isActive = type.id === activeId;
        return (
          <button
            key={type.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(type.id)}
            className={
              // min-w uniforme + texte centré et insécable : les onglets gardent une
              // largeur stable d'une langue à l'autre, tout en tenant sur une seule
              // ligne (la rangée ne déborde pas de la largeur du conteneur).
              'min-w-20 whitespace-nowrap rounded-control border px-3 py-1.5 text-center text-sm font-medium transition ' +
              (isActive
                ? 'border-accent bg-accent text-accent-fg shadow-btn'
                : 'bg-subtle text-fg-muted hover:text-fg')
            }
          >
            {t(type.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
