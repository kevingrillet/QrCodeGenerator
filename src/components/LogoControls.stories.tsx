import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { LogoControls } from './LogoControls';

const meta: Meta<typeof LogoControls> = {
  title: 'Composants/LogoControls',
  component: LogoControls,
};
export default meta;

type Story = StoryObj<typeof LogoControls>;

/** État vide : bouton d'import en pointillés. */
export const Vide: Story = {
  render: () => {
    const [logo, setLogo] = useState('');
    return <LogoControls logo={logo} onChange={setLogo} />;
  },
};

/** Logo importé : aperçu + boutons remplacer / retirer. */
export const AvecLogo: Story = {
  render: () => {
    // Petit SVG inline (data URL) en guise de logo de démonstration.
    const sample =
      'data:image/svg+xml,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%234f46e5"/></svg>',
      );
    const [logo, setLogo] = useState(sample);
    return <LogoControls logo={logo} onChange={setLogo} />;
  },
};
