import type { StorybookConfig } from '@storybook/react-vite';

/**
 * Configuration Storybook (builder Vite).
 * Les stories vivent à côté des composants (`src/**\/*.stories.tsx`).
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
