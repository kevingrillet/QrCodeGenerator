import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QrOutputControls } from './QrOutputControls';

function setup(overrides = {}) {
  const props = {
    ecLevel: 'M' as const,
    onEcLevelChange: vi.fn(),
    density: 0,
    onDensityChange: vi.fn(),
    size: 512,
    onSizeChange: vi.fn(),
    ...overrides,
  };
  render(<QrOutputControls {...props} />);
  return props;
}

describe('QrOutputControls', () => {
  it('propose la densité automatique par défaut', () => {
    setup();
    const density = screen.getByLabelText('Densité (version)') as HTMLSelectElement;
    expect(density.value).toBe('0');
    expect(screen.getByRole('option', { name: 'Auto (recommandé)' })).toBeInTheDocument();
  });

  it('remonte le changement de densité (version forcée)', async () => {
    const { onDensityChange } = setup();
    await userEvent.selectOptions(screen.getByLabelText('Densité (version)'), '5');
    expect(onDensityChange).toHaveBeenCalledWith(5);
  });

  it('remonte le changement de niveau de correction', async () => {
    const { onEcLevelChange } = setup();
    await userEvent.selectOptions(screen.getByLabelText("Niveau de correction d'erreur"), 'H');
    expect(onEcLevelChange).toHaveBeenCalledWith('H');
  });
});
