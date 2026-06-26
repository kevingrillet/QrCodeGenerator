import type { Meta, StoryObj } from '@storybook/react-vite';
import { QrPreview } from './QrPreview';
import { getPayloadType } from '../lib/payloads';
import type { ModuleShape, QrColors } from '../lib/qr';
import { useI18n } from '../i18n/I18nProvider';

const meta: Meta<typeof QrPreview> = {
  title: 'Composants/QrPreview',
  component: QrPreview,
};
export default meta;

type Story = StoryObj<typeof QrPreview>;

/** Wrapper appliquant des réglages d'export fixes (les contrôles vivent ailleurs). */
function PreviewHarness({
  text,
  ready,
  colors = { dark: '#000000', light: '#ffffff' },
  shape = 'square',
}: {
  text: string;
  ready: boolean;
  colors?: QrColors;
  shape?: ModuleShape;
}) {
  return (
    <QrPreview
      text={text}
      ready={ready}
      colors={colors}
      shape={shape}
      ecLevel="M"
      density={0}
      size={512}
    />
  );
}

export const Url: Story = {
  render: () => <PreviewHarness text="https://exemple.com" ready />,
};

export const PointsColores: Story = {
  render: () => (
    <PreviewHarness
      text="https://exemple.com"
      ready
      colors={{ dark: '#1d4ed8', light: '#ffffff' }}
      shape="dots"
    />
  ),
};

export const PasPret: Story = {
  render: () => <PreviewHarness text="" ready={false} />,
};

/**
 * Démo : un QR par type de contenu, avec des exemples pré-remplis.
 * Documente visuellement « comment ça marche » pour chaque format.
 */
export const TousLesTypes: StoryObj = {
  render: () => {
    const { t } = useI18n();
    const samples: Array<{ id: string; values: Record<string, string | boolean> }> = [
      { id: 'text', values: { text: 'Bonjour le monde' } },
      { id: 'url', values: { url: 'exemple.com' } },
      {
        id: 'wifi',
        values: { ssid: 'MonWifi', password: 'secret', encryption: 'WPA', hidden: false },
      },
      { id: 'email', values: { to: 'contact@exemple.com', subject: 'Bonjour', body: 'Coucou' } },
      { id: 'sms', values: { number: '+33612345678', message: 'Salut' } },
      { id: 'tel', values: { number: '+33612345678' } },
      {
        id: 'vcard',
        values: {
          firstName: 'Jean',
          lastName: 'Dupont',
          organization: 'ACME',
          title: '',
          phone: '0612',
          email: 'jean@acme.fr',
          url: '',
        },
      },
      { id: 'geo', values: { latitude: '48.8584', longitude: '2.2945' } },
    ];
    return (
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {samples.map(({ id, values }) => {
          const type = getPayloadType(id);
          return (
            <div key={id} className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium">{t(type.labelKey)}</span>
              <PreviewHarness text={type.build(values)} ready />
            </div>
          );
        })}
      </div>
    );
  },
};
