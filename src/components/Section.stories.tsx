import type { Meta, StoryObj } from '@storybook/react-vite';
import { Section } from './Section';

const meta: Meta<typeof Section> = {
  title: 'Composants/Section',
  component: Section,
  args: {
    title: 'Contenu',
    badge: 1,
    children: <p className="text-sm text-fg-muted">Contenu de la section (champ, contrôles…).</p>,
  },
};
export default meta;

type Story = StoryObj<typeof Section>;

export const Ouverte: Story = { args: { defaultOpen: true } };
export const Repliée: Story = { args: { defaultOpen: false } };
export const AvecSousTitre: Story = {
  args: { defaultOpen: true, subtitle: '(optionnel)', badge: 2, title: 'Couleur' },
};
