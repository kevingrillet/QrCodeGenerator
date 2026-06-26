import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ColorControls, ShapeControls } from './QrCustomizer';
import type { ModuleShape, QrColors } from '../lib/qr';

const meta: Meta = {
  title: 'Composants/QrCustomizer',
};
export default meta;

type Story = StoryObj;

/** Palettes prêtes à l'emploi + sélecteurs de couleur (modules / fond). */
export const Couleurs: Story = {
  render: () => {
    const [colors, setColors] = useState<QrColors>({ dark: '#000000', light: '#ffffff' });
    return <ColorControls colors={colors} onChange={setColors} />;
  },
};

/** Forme des modules : carré, points, arrondi. */
export const Formes: Story = {
  render: () => {
    const [shape, setShape] = useState<ModuleShape>('square');
    return <ShapeControls shape={shape} onChange={setShape} />;
  },
};
