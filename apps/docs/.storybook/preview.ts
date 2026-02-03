import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
    layout: 'centered',
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Brand theme',
      defaultValue: 'entire',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'entire', title: 'Entire (Base)' },
          { value: 'spark', title: 'Spark 🔥' },
          { value: 'playground', title: 'Playground 🌊' },
          { value: 'team-relay', title: 'Team Relay' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
