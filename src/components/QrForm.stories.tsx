import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { QrForm } from './QrForm';
import { getPayloadType, type FieldValues } from '../lib/payloads';

const meta: Meta<typeof QrForm> = {
  title: 'Composants/QrForm',
  component: QrForm,
};
export default meta;

type Story = StoryObj<typeof QrForm>;

/** Fabrique une story interactive pour un type donné. */
function makeStory(typeId: string): Story {
  return {
    render: () => {
      const type = getPayloadType(typeId);
      const [values, setValues] = useState<FieldValues>({ ...type.defaults });
      return (
        <div className="max-w-md">
          <QrForm
            type={type}
            values={values}
            onChange={(name, value) => setValues((v) => ({ ...v, [name]: value }))}
          />
        </div>
      );
    },
  };
}

export const Texte = makeStory('text');
export const Wifi = makeStory('wifi');
export const VCard = makeStory('vcard');
