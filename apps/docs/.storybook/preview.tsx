import type { Preview, Decorator } from '@storybook/react';
import React, { useEffect } from 'react';
import '../src/globals.css';

// Custom theme decorator that applies data-theme attribute
const withBrandTheme: Decorator = (Story, context) => {
  const theme = context.globals.brandTheme || 'entire';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // For spark theme, also add dark class since it's a dark theme
    if (theme === 'spark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <Story />;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
  globalTypes: {
    brandTheme: {
      name: 'Brand Theme',
      description: 'Switch brand theme',
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
  decorators: [withBrandTheme],
};

export default preview;
