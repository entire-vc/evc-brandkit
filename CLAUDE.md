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
pnpm release          # Build + publish all packages to GitHub Packages
```

### Package-specific commands

```bash
# Tokens package
pnpm --filter @evc/tokens build        # Build tokens (tsup + CSS generation)
pnpm --filter @evc/tokens build:css    # Rebuild theme CSS files only

# UI package (React)
pnpm --filter @evc/ui build            # Build React components
pnpm --filter @evc/ui typecheck        # TypeScript check only

# UI Svelte package
pnpm --filter @evc/ui-svelte build     # Build Svelte components
pnpm --filter @evc/ui-svelte check     # Svelte + TypeScript check

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

- **@evc/ui-svelte** (`packages/ui-svelte/`) - Svelte 5 components (same API as @evc/ui)
  - Uses Bits UI primitives (Svelte equivalent of Radix)
  - Styled with Tailwind + class-variance-authority (CVA)
  - Svelte 5 runes API ($props, $state)
  - Full visual parity with React version

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

### Publishing

Packages are published to **GitHub Packages** (npm registry at `npm.pkg.github.com`).

```bash
# Manual publish (all packages)
pnpm release

# Automated: push a git tag
git tag v0.1.0 && git push origin v0.1.0
# GitHub Actions will build and publish automatically
```

### Consumer Setup

**Step 0: Configure GitHub Packages registry**

Create `.npmrc` in the consumer project root:
```
@evc:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Generate a [Personal Access Token](https://github.com/settings/tokens) with `read:packages` scope.

**React projects:**
1. `pnpm add @evc/tokens @evc/ui`
2. Add `presets: [require('@evc/tokens/tailwind-preset')]` to tailwind.config
3. Import theme CSS: `@import '@evc/tokens/css/entire.css'`
4. Add `node_modules/@evc/ui/dist/**/*.{js,mjs}` to Tailwind content paths

**Svelte projects:**
1. `pnpm add @evc/tokens @evc/ui-svelte`
2. Add `presets: [require('@evc/tokens/tailwind-preset')]` to tailwind.config
3. Import theme CSS: `@import '@evc/tokens/css/entire.css'`
4. Add `node_modules/@evc/ui-svelte/dist/**/*.{js,svelte}` to Tailwind content paths
