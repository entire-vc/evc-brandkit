# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm install          # Install all dependencies
pnpm build            # Build all packages (runs build in each package)
pnpm dev              # Start Storybook dev server (port 6006)
pnpm storybook        # Same as dev
pnpm lint             # Lint all .ts/.tsx files
pnpm format           # Format with Prettier
```

### Package-specific commands

```bash
# Tokens package
pnpm --filter @evc/tokens build        # Build tokens (tsup + CSS generation)
pnpm --filter @evc/tokens build:css    # Rebuild theme CSS files only

# UI package
pnpm --filter @evc/ui build            # Build React components
pnpm --filter @evc/ui typecheck        # TypeScript check only

# Docs/Storybook
pnpm --filter @evc/docs build          # Build Storybook for production
```

## Architecture

This is a **pnpm monorepo** with a design system for multiple Entire VC brands.

### Packages

- **@evc/tokens** (`packages/tokens/`) - Design tokens exported as:
  - TypeScript constants (colors, typography, spacing, effects)
  - CSS theme files (`css/*.css`) with CSS variables
  - Tailwind preset (`tailwind-preset.js`)

- **@evc/ui** (`packages/ui/`) - React components based on shadcn/ui
  - Uses Radix UI primitives
  - Styled with Tailwind + class-variance-authority (CVA)
  - Utility: `cn()` for className merging (clsx + tailwind-merge)

- **@evc/docs** (`apps/docs/`) - Storybook documentation
  - Stories in `stories/*.stories.tsx`

### Theme System

Four brand themes defined in `packages/tokens/src/colors.ts`:
- `entire` - Base brand (neutral gray)
- `spark` - Dark theme with orange/yellow
- `playground` - Light theme with blue/cyan
- `team-relay` - Light theme with indigo/purple

Themes work via CSS variables. Import one theme CSS file, then Tailwind classes like `bg-primary` automatically use the correct colors.

### Adding UI Components

1. Copy component from shadcn/ui to `packages/ui/src/components/`
2. Update imports to use `../lib/utils`
3. Export from `packages/ui/src/index.ts`
4. Add story in `apps/docs/stories/`
5. Run `pnpm build`

### Consumer Setup

Projects using this design system:
1. `pnpm add @evc/tokens @evc/ui`
2. Add `presets: [require('@evc/tokens/tailwind-preset')]` to tailwind.config
3. Import theme CSS: `@import '@evc/tokens/css/entire.css'`
4. Add `node_modules/@evc/ui/dist/**/*.{js,mjs}` to Tailwind content paths
