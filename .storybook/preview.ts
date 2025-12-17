// @ts-expect-error: CSS module import from relative path
import '../src/app.css';
import type { Preview } from '@storybook/sveltekit';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
