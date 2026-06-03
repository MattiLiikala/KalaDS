import type { Preview } from '@storybook/web-components';
import '@kalads/tokens/css';
import '@kalads/components';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8fafc' },
        { name: 'dark', value: '#0f172a' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    docs: {
      toc: true,
    },
  },
};

export default preview;
