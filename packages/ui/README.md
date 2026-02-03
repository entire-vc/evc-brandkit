# @evc/ui

React UI components for Entire VC, based on shadcn/ui.

## Installation

```bash
pnpm add @evc/ui @evc/tokens
```

## Usage

### 1. Setup Tailwind

```js
// tailwind.config.js
const evcPreset = require('@evc/tokens/tailwind');

module.exports = {
  presets: [evcPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@evc/ui/dist/**/*.{js,mjs}',
  ],
};
```

### 2. Import theme CSS

```css
/* globals.css */
@import '@evc/tokens/css/entire.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Use components

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@evc/ui';

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to EVC</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Get Started</Button>
        <Button variant="secondary">Learn More</Button>
      </CardContent>
    </Card>
  );
}
```

## Components

### Button

```tsx
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
<Button size="icon"><Icon /></Button>
```

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

## Adding More Components

This package is designed to grow. To add components from shadcn/ui:

1. Copy component from https://ui.shadcn.com
2. Place in `src/components/`
3. Update imports to use `../lib/utils`
4. Export from `src/index.ts`
5. Run `pnpm build`

## Customization

Components use CSS variables from `@evc/tokens`. To customize:

1. Override CSS variables in your theme
2. Or extend components with `cn()` utility:

```tsx
import { Button, cn } from '@evc/ui';

function CustomButton({ className, ...props }) {
  return (
    <Button 
      className={cn('rounded-full', className)} 
      {...props} 
    />
  );
}
```
