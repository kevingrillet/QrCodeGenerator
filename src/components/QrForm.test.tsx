import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QrForm } from './QrForm';
import { getPayloadType } from '../lib/payloads';

describe('QrForm', () => {
  it('rend les champs du type WiFi', () => {
    const wifi = getPayloadType('wifi');
    render(<QrForm type={wifi} values={wifi.defaults} onChange={() => {}} />);
    expect(screen.getByLabelText(/Nom du réseau \(SSID\)/)).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByLabelText('Chiffrement')).toBeInTheDocument();
    expect(screen.getByLabelText('Réseau masqué')).toBeInTheDocument();
  });

  it('remonte les changements de texte via onChange', async () => {
    const text = getPayloadType('text');
    const onChange = vi.fn();
    render(<QrForm type={text} values={text.defaults} onChange={onChange} />);
    await userEvent.type(screen.getByLabelText(/Texte/), 'A');
    expect(onChange).toHaveBeenCalledWith('text', 'A');
  });

  it('remonte le booléen pour une case à cocher', async () => {
    const wifi = getPayloadType('wifi');
    const onChange = vi.fn();
    render(<QrForm type={wifi} values={wifi.defaults} onChange={onChange} />);
    await userEvent.click(screen.getByLabelText('Réseau masqué'));
    expect(onChange).toHaveBeenCalledWith('hidden', true);
  });

  it('affiche le message d’erreur et marque le champ invalide', () => {
    const url = getPayloadType('url');
    render(
      <QrForm
        type={url}
        values={{ url: 'pas une url' }}
        onChange={() => {}}
        errors={{ url: 'validation.url' }}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Adresse web invalide.');
    expect(screen.getByLabelText(/Adresse/)).toHaveAttribute('aria-invalid', 'true');
  });
});
