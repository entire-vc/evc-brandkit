# @evc/ui-svelte

> Svelte 5 UI components for EVC Brand Kit - visual parity with @evc/ui

## Features

- **Svelte 5** with runes API ($props, $state, $derived)
- **Bits UI** primitives (Svelte equivalent of Radix UI)
- **CVA** for component variants (same API as React version)
- **Full visual parity** with @evc/ui React components
- **TypeScript** support

## Installation

```bash
pnpm add @evc/ui-svelte @evc/tokens
```

## Setup

### 1. Configure Tailwind

```js
// tailwind.config.js
const evcPreset = require('@evc/tokens/tailwind-preset');

export default {
  presets: [evcPreset],
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/@evc/ui-svelte/dist/**/*.{js,svelte}',
  ],
  darkMode: 'class',
};
```

### 2. Import theme CSS

```css
/* app.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import '@evc/tokens/css/entire.css'; /* or spark.css, playground.css, team-relay.css */

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

### 3. Use components

```svelte
<script>
  import { Button, Card, CardHeader, CardTitle, CardContent } from '@evc/ui-svelte';
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

## Components

### Basic
- Button, Input, Textarea, Label, Badge, Separator, Skeleton

### Feedback & Layout
- Alert, AlertTitle, AlertDescription
- Progress
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Avatar, AvatarImage, AvatarFallback
- AspectRatio
- ScrollArea, ScrollBar

### Overlays
- Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription
- Sheet, SheetTrigger, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription
- Popover, PopoverTrigger, PopoverContent
- Tooltip, TooltipTrigger, TooltipContent, TooltipProvider
- HoverCard, HoverCardTrigger, HoverCardContent
- AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogAction, AlertDialogCancel

### Navigation
- Tabs, TabsList, TabsTrigger, TabsContent
- Accordion, AccordionItem, AccordionTrigger, AccordionContent
- Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator
- Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext

### Forms
- Select, SelectTrigger, SelectValue, SelectContent, SelectItem
- Checkbox
- RadioGroup, RadioGroupItem
- Switch
- Toggle
- Slider

### Menus
- DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator
- ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuSeparator
- Collapsible, CollapsibleTrigger, CollapsibleContent

## Button Variants

```svelte
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

## Dark Mode

Add `dark` class to `<html>` element:

```svelte
<script>
  let isDark = $state(false);

  function toggleDark() {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
  }
</script>

<Button onclick={toggleDark}>Toggle Dark Mode</Button>
```

## Development

```bash
# Build
pnpm --filter @evc/ui-svelte build

# Type check
pnpm --filter @evc/ui-svelte check
```

## License

MIT © [Entire VC](https://entire.vc)
