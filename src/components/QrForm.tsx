/**
 * Formulaire dynamique : rend les champs décrits par le type de contenu actif.
 *
 * Le composant ne connaît AUCUN type de QR en particulier — il se contente
 * d'afficher la liste `type.fields` et de remonter les changements via `onChange`.
 * Ajouter un nouveau type dans le registre suffit à le rendre éditable ici.
 */
import type { FieldDef, FieldValues, PayloadType } from '../lib/payloads';
import { useI18n } from '../i18n/I18nProvider';

export interface QrFormProps {
  type: PayloadType;
  values: FieldValues;
  onChange: (name: string, value: string | boolean) => void;
}

/** Classes communes aux champs texte/select pour rester cohérent. */
const INPUT_CLASS =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100';

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
}) {
  const { t } = useI18n();
  const id = `field-${field.name}`;
  const placeholder = field.placeholderKey ? t(field.placeholderKey) : undefined;

  if (field.type === 'textarea') {
    return (
      <textarea
        id={id}
        rows={3}
        className={INPUT_CLASS}
        placeholder={placeholder}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select
        id={id}
        className={INPUT_CLASS}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => onChange(event.target.value)}
      >
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {t(option.labelKey)}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <input
        id={id}
        type="checkbox"
        className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800"
        checked={value === true}
        onChange={(event) => onChange(event.target.checked)}
      />
    );
  }

  // Champs texte simples : text, password, tel, email, url, number.
  return (
    <input
      id={id}
      type={field.type}
      className={INPUT_CLASS}
      placeholder={placeholder}
      value={typeof value === 'string' ? value : ''}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function QrForm({ type, values, onChange }: QrFormProps) {
  const { t } = useI18n();
  return (
    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
      {type.fields.map((field) => {
        const id = `field-${field.name}`;
        const value = values[field.name] ?? (field.type === 'checkbox' ? false : '');

        // Les cases à cocher s'affichent en ligne (case + libellé à droite).
        if (field.type === 'checkbox') {
          return (
            <div key={field.name} className="flex items-center gap-2">
              <FieldControl field={field} value={value} onChange={(v) => onChange(field.name, v)} />
              <label htmlFor={id} className="text-sm text-gray-700 dark:text-gray-200">
                {t(field.labelKey)}
              </label>
            </div>
          );
        }

        return (
          <div key={field.name} className="space-y-1">
            <label
              htmlFor={id}
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {t(field.labelKey)}
              {field.required && (
                <span aria-hidden="true" className="ml-0.5 text-red-500">
                  *
                </span>
              )}
            </label>
            <FieldControl field={field} value={value} onChange={(v) => onChange(field.name, v)} />
          </div>
        );
      })}
    </form>
  );
}
