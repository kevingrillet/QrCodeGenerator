import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/index.css';

/**
 * Preview Storybook : applique les styles globaux (Tailwind) et branche un sélecteur
 * de thème clair/sombre via la classe `dark` sur l'élément racine — exactement la
 * même stratégie que l'application (hook useTheme).
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
