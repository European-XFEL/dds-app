import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
  stories: ['**/*.stories.@(js|ts|svelte)'],
  addons: ['@storybook/addon-svelte-csf'],
  framework: {
    name: '@storybook/sveltekit',
    options: {},
  },
};
export default config;
