import type { StorybookConfig } from '@storybook/react-vite';

/**
 * Configuration Storybook (builder Vite).
 * Les stories vivent à côté des composants (`src/**\/*.stories.tsx`).
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-themes', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
