import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { QrOutputControls } from './QrOutputControls';
import type { ErrorCorrectionLevel } from '../lib/qr';

const meta: Meta<typeof QrOutputControls> = {
  title: 'Composants/QrOutputControls',
  component: QrOutputControls,
};
export default meta;

type Story = StoryObj<typeof QrOutputControls>;

/** Réglages avancés : correction d'erreur, densité (version) et taille d'export,
 *  chacun avec sa bulle d'aide (Hint). */
export const ParDéfaut: Story = {
  render: () => {
    const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>('M');
    const [density, setDensity] = useState(0);
    const [size, setSize] = useState(512);
    return (
      <QrOutputControls
        ecLevel={ecLevel}
        onEcLevelChange={setEcLevel}
        density={density}
        onDensityChange={setDensity}
        size={size}
        onSizeChange={setSize}
      />
    );
  },
};
