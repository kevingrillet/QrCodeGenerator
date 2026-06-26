import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hint } from './Hint';

const meta: Meta<typeof Hint> = {
  title: 'Composants/Hint',
  component: Hint,
  args: {
    label: 'Aide',
    children: 'Survolez ou faites le focus sur le « ? » pour afficher cette bulle d’aide.',
  },
  // La bulle apparaît au survol/focus : on laisse de la place autour.
  decorators: [
    (Story) => (
      <div style={{ padding: '4rem 2rem' }}>
        <span className="text-sm text-fg">
          Niveau de correction <Story />
        </span>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Hint>;

export const ParDéfaut: Story = {};
