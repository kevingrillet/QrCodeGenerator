import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TypeSelector } from './TypeSelector';
import { PAYLOAD_TYPES } from '../lib/payloads';

describe('TypeSelector', () => {
  it('affiche un bouton radio par type', () => {
    render(<TypeSelector types={PAYLOAD_TYPES} activeId="text" onChange={() => {}} />);
    expect(screen.getAllByRole('radio')).toHaveLength(PAYLOAD_TYPES.length);
  });

  it('marque le type actif comme sélectionné', () => {
    render(<TypeSelector types={PAYLOAD_TYPES} activeId="wifi" onChange={() => {}} />);
    expect(screen.getByRole('radio', { name: 'WiFi' })).toHaveAttribute('aria-checked', 'true');
  });

  it('appelle onChange avec l’identifiant au clic', async () => {
    const onChange = vi.fn();
    render(<TypeSelector types={PAYLOAD_TYPES} activeId="text" onChange={onChange} />);
    await userEvent.click(screen.getByRole('radio', { name: 'Email' }));
    expect(onChange).toHaveBeenCalledWith('email');
  });
});
