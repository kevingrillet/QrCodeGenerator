import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemeSelector } from './ThemeSelector';
import { applyThemeName, type ThemeName } from '../theme';

const meta: Meta<typeof ThemeSelector> = {
  title: 'Composants/ThemeSelector',
  component: ThemeSelector,
};
export default meta;

type Story = StoryObj<typeof ThemeSelector>;

/**
 * Sélecteur interactif : choisir une identité l'applique réellement à la page
 * (data-theme), ce qui met à jour le fond du décorateur. Combinez avec le
 * sélecteur « Mode » de la barre d'outils pour voir clair/sombre.
 */
export const Interactif: Story = {
  render: () => {
    const [theme, setTheme] = useState<ThemeName>('default');
    return (
      <ThemeSelector
        value={theme}
        onChange={(next) => {
          setTheme(next);
          applyThemeName(next);
        }}
      />
    );
  },
};

export const Aurora: Story = { args: { value: 'aurora', onChange: () => {} } };
