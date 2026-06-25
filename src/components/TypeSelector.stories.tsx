import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TypeSelector } from './TypeSelector';
import { PAYLOAD_TYPES } from '../lib/payloads';

const meta: Meta<typeof TypeSelector> = {
  title: 'Composants/TypeSelector',
  component: TypeSelector,
};
export default meta;

type Story = StoryObj<typeof TypeSelector>;

/** Sélecteur interactif piloté par un état local. */
export const Interactif: Story = {
  render: () => {
    const [activeId, setActiveId] = useState(PAYLOAD_TYPES[0].id);
    return <TypeSelector types={PAYLOAD_TYPES} activeId={activeId} onChange={setActiveId} />;
  },
};
