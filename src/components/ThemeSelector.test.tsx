import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeSelector } from './ThemeSelector';
import { THEMES } from '../theme';

describe('ThemeSelector', () => {
  it('expose les quatre identités visuelles', () => {
    render(<ThemeSelector value="default" onChange={() => {}} />);
    const select = screen.getByRole('combobox', { name: /thème/i });
    expect(select).toHaveValue('default');
    expect(screen.getAllByRole('option')).toHaveLength(THEMES.length);
  });

  it('remonte le thème choisi', async () => {
    const onChange = vi.fn();
    render(<ThemeSelector value="default" onChange={onChange} />);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /thème/i }), 'aurora');
    expect(onChange).toHaveBeenCalledWith('aurora');
  });
});
