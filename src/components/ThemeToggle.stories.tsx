import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../hooks/useTheme';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Composants/ThemeToggle',
  component: ThemeToggle,
};
export default meta;

type Story = StoryObj<typeof ThemeToggle>;

/** Bouton interactif : cliquer bascule l'icône (sans toucher au thème global ici). */
export const Interactif: Story = {
  render: () => {
    const [theme, setTheme] = useState<Theme>('light');
    return (
      <ThemeToggle
        theme={theme}
        onToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />
    );
  },
};

export const Clair: Story = { args: { theme: 'light', onToggle: () => {} } };
export const Sombre: Story = { args: { theme: 'dark', onToggle: () => {} } };
