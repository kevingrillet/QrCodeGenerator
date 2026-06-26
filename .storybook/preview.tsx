import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName, withThemeByDataAttribute } from '@storybook/addon-themes';
import '../src/index.css';

/**
 * Preview Storybook : applique les styles globaux (Tailwind) et expose DEUX
 * sélecteurs dans la barre d'outils :
 *  - « Thème » (data-theme) : les 4 identités visibles en production
 *    (default / atelier / blueprint / aurora) — même mécanisme que l'app ;
 *  - « Mode » (classe dark) : clair/sombre, qui n'agit que sur le thème default.
 *
 * Un décorateur enveloppe chaque story dans un fond `bg-canvas` pour rendre le
 * thème actif visible (Storybook n'applique pas le fond de page autrement).
 */
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-canvas font-base text-fg" style={{ padding: '1.5rem' }}>
        <Story />
      </div>
    ),
    withThemeByDataAttribute({
      themes: {
        Default: 'default',
        Atelier: 'atelier',
        Blueprint: 'blueprint',
        Aurora: 'aurora',
      },
      defaultTheme: 'Default',
      attributeName: 'data-theme',
    }),
    withThemeByClassName({
      themes: {
        clair: '',
        sombre: 'dark',
      },
      defaultTheme: 'clair',
    }),
  ],
};

export default preview;
