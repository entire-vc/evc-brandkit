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
| [@entire-vc/tokens](./packages/tokens) | Design tokens, theme CSS, Tailwind preset | ✅ Ready |
| [@entire-vc/ui](./packages/ui) | React UI components (shadcn-based) | ✅ Ready |
| [@entire-vc/ui-svelte](./packages/ui-svelte) | Svelte 5 UI components (Bits UI-based) | ✅ Ready |

## Quick Start

### 1. Install dependencies

```bash
pnpm add @entire-vc/tokens @entire-vc/ui
```

### 2. Configure Tailwind

```js
// tailwind.config.js
const evcPreset = require('@entire-vc/tokens/tailwind-preset');

module.exports = {
  presets: [evcPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@entire-vc/ui/dist/**/*.{js,mjs}',
  ],
  darkMode: 'class',
};
```

### 3. Import theme CSS and fonts

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import '@entire-vc/tokens/css/entire.css'; /* or spark.css, playground.css, team-relay.css */

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

body {
  font-family: var(--font-sans);
}
```

### 4. Use components

**React:**
```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@entire-vc/ui';

export function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Get Started</Button>
        <Button variant="secondary">Learn More</Button>
      </CardContent>
    </Card>
  );
}
```

**Svelte 5:**
```svelte
<script>
  import { Button, Card, CardHeader, CardTitle, CardContent } from '@entire-vc/ui-svelte';
</script>

<Card>
  <CardHeader>
    <CardTitle>Welcome</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="default">Get Started</Button>
    <Button variant="secondary">Learn More</Button>
  </CardContent>
</Card>
```

## Themes

| Theme | Description | Primary Color |
|-------|-------------|---------------|
| `entire` | Base brand - neutral, professional | ![#525769](https://via.placeholder.com/15/525769/000000?text=+) `#525769` |
| `spark` | Creative, energetic (dark theme) | ![#FF6A3D](https://via.placeholder.com/15/FF6A3D/000000?text=+) `#FF6A3D` |
| `playground` | Tech, trustworthy | ![#3D8BFF](https://via.placeholder.com/15/3D8BFF/000000?text=+) `#3D8BFF` |
| `team-relay` | Professional, collaborative | ![#6366F1](https://via.placeholder.com/15/6366F1/000000?text=+) `#6366F1` |

### Dark Mode

Add `dark` class to `<html>` element:

```tsx
// Toggle dark mode
document.documentElement.classList.toggle('dark');
```

## Development

```bash
# Clone
git clone git@github.com:entire-vc/evc-brandkit.git
cd evc-brandkit

# Install
pnpm install

# Build all packages
pnpm build

# Run Storybook
pnpm dev
```

## Project Structure

```
evc-brandkit/
├── packages/
│   ├── tokens/          # Design tokens
│   │   ├── css/         # Theme CSS files (entire, spark, playground, team-relay)
│   │   ├── src/         # Token definitions (TS)
│   │   └── tailwind-preset.js
│   ├── ui/              # React components (Button, Card, Input, Dialog, etc.)
│   └── ui-svelte/       # Svelte 5 components (same API as @entire-vc/ui)
├── apps/
│   └── docs/            # Storybook documentation
└── package.json
```

## License

MIT © [Entire VC](https://entire.vc)
