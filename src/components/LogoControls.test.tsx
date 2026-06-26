import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogoControls } from './LogoControls';

describe('LogoControls', () => {
  it('lit le fichier importé en data URL et le remonte', async () => {
    const onChange = vi.fn();
    render(<LogoControls logo="" onChange={onChange} />);
    const input = screen.getByLabelText('Importer une image');
    const file = new File(['hello'], 'logo.png', { type: 'image/png' });
    await userEvent.upload(input, file);
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0][0]).toMatch(/^data:/);
  });

  it('affiche un aperçu et permet de retirer le logo', async () => {
    const onChange = vi.fn();
    render(<LogoControls logo="data:image/png;base64,AAAA" onChange={onChange} />);
    expect(screen.getByAltText('Logo du QR code')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Retirer le logo' }));
    expect(onChange).toHaveBeenCalledWith('');
  });
});
