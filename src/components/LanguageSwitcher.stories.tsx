import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageSwitcher } from './LanguageSwitcher';
import { I18nProvider } from '../i18n/I18nProvider';

const meta: Meta<typeof LanguageSwitcher> = {
  title: 'Composants/LanguageSwitcher',
  component: LanguageSwitcher,
  // Le composant bascule réellement la langue : on l'enveloppe dans le provider.
  decorators: [
    (Story) => (
      <I18nProvider>
        <Story />
      </I18nProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof LanguageSwitcher>;

export const ParDéfaut: Story = {};
