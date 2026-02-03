# EVC Brand Kit

> Design system and UI components for Entire VC brand family

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

Unified design system for all Entire VC products:
- **SaaS applications** (React, Svelte)
- **Marketing sites**
- **Browser extensions**
- **Telegram Mini-Apps**
- **PWAs**

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| [@evc/tokens](./packages/tokens) | Design tokens (colors, typography, spacing) | ✅ Ready |
| [@evc/ui](./packages/ui) | React UI components (shadcn-based) | 🚧 WIP |
| [@evc/themes](./packages/themes) | Pre-configured theme presets | 🚧 WIP |

## Quick Start

### 1. Install dependencies

```bash
# In your project
pnpm add @evc/tokens @evc/ui
```

### 2. Configure Tailwind

```js
// tailwind.config.js
const evcPreset = require('@evc/tokens/tailwind');

module.exports = {
  presets: [evcPreset],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};
```

### 3. Import theme CSS

```css
/* globals.css */
@import '@evc/tokens/css/entire.css'; /* or spark.css, playground.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Use components

```tsx
import { Button } from '@evc/ui';

export function MyPage() {
  return (
    <Button variant="default">
      Get Started
    </Button>
  );
}
```

## Themes

| Theme | Description | Primary Color |
|-------|-------------|---------------|
| `entire` | Base brand - neutral, professional | ![#525769](https://via.placeholder.com/15/525769/000000?text=+) `#525769` |
| `spark` | Creative, energetic | ![#FF6A3D](https://via.placeholder.com/15/FF6A3D/000000?text=+) `#FF6A3D` |
| `playground` | Tech, trustworthy | ![#3D8BFF](https://via.placeholder.com/15/3D8BFF/000000?text=+) `#3D8BFF` |
| `team-relay` | Professional, collaborative | ![#6366F1](https://via.placeholder.com/15/6366F1/000000?text=+) `#6366F1` |

## Development

```bash
# Clone
git clone git@github.com:entire-vc/evc-brandkit.git
cd evc-brandkit

# Install
pnpm install

# Build all packages
pnpm build

# Run docs/storybook
pnpm dev
```

## Project Structure

```
evc-brandkit/
├── packages/
│   ├── tokens/          # Design tokens
│   │   ├── css/         # Ready-to-use theme CSS
│   │   ├── src/         # Token definitions (TS)
│   │   └── tailwind-preset.js
│   ├── ui/              # React components
│   └── themes/          # Theme presets
├── apps/
│   └── docs/            # Documentation site
└── package.json
```

## Contributing

1. Create feature branch from `main`
2. Make changes
3. Run `pnpm build && pnpm lint`
4. Submit PR

## License

MIT © [Entire VC](https://entire.vc)
