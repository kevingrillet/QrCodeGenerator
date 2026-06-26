import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColorControls, ShapeControls } from './QrCustomizer';

describe('ColorControls', () => {
  it('applique une palette au clic (modules + fond)', async () => {
    const onChange = vi.fn();
    render(<ColorControls colors={{ dark: '#000000', light: '#ffffff' }} onChange={onChange} />);
    // « Encre » = #111827 sur #ffffff (voir presets.ts).
    await userEvent.click(screen.getByRole('button', { name: 'Encre' }));
    expect(onChange).toHaveBeenCalledWith({ dark: '#111827', light: '#ffffff' });
  });

  it('marque la palette active', () => {
    render(<ColorControls colors={{ dark: '#000000', light: '#ffffff' }} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Classique' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});

describe('ShapeControls', () => {
  it('remonte la forme choisie', async () => {
    const onChange = vi.fn();
    render(<ShapeControls shape="square" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Points' }));
    expect(onChange).toHaveBeenCalledWith('dots');
  });

  it('marque la forme active', () => {
    render(<ShapeControls shape="rounded" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Arrondi' })).toHaveAttribute('aria-pressed', 'true');
  });
});
