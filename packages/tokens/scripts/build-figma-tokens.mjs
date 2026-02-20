/**
 * Build Figma-compatible token files in W3C DTCG format.
 *
 * Reads TypeScript token sources and generates JSON files
 * compatible with Tokens Studio for Figma plugin.
 *
 * Output:  packages/tokens/figma-tokens/
 *   core.json         — spacing, border-radius, typography, shadows
 *   entire.json       — Entire brand colors
 *   spark.json        — Spark brand colors
 *   playground.json   — Playground brand colors
 *   team-relay.json   — Team Relay brand colors
 *   $metadata.json    — Tokens Studio metadata
 *   $themes.json      — Tokens Studio theme definitions
 */
import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'figma-tokens');
fs.mkdirSync(outDir, { recursive: true });

// ---------------------------------------------------------------------------
// Helper: convert camelCase key to kebab-case label
// ---------------------------------------------------------------------------
function camelToLabel(key) {
  return key.replace(/([A-Z])/g, ' $1').trim();
}

// ---------------------------------------------------------------------------
// THEMES — color tokens per brand (inline to avoid TS import in ESM scripts)
// ---------------------------------------------------------------------------
const themes = {
  entire: {
    primary: '#525769',
    primaryForeground: '#FFFFFF',
    secondary: '#DDE1E6',
    secondaryForeground: '#1A1A1A',
    background: '#FFFFFF',
    foreground: '#1A1A1A',
    muted: '#F4F4F5',
    mutedForeground: '#71717A',
    card: '#FFFFFF',
    cardForeground: '#1A1A1A',
    popover: '#FFFFFF',
    popoverForeground: '#1A1A1A',
    border: '#E4E4E7',
    input: '#E4E4E7',
    ring: '#525769',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    success: '#22C55E',
    successForeground: '#FFFFFF',
    warning: '#F59E0B',
    warningForeground: '#FFFFFF',
    accent: '#525769',
    accentForeground: '#FFFFFF',
  },
  spark: {
    primary: '#FF6A3D',
    primaryForeground: '#FFFFFF',
    secondary: '#323643',
    secondaryForeground: '#FFFFFF',
    background: '#1A1A1A',
    foreground: '#FAFAFA',
    muted: '#27272A',
    mutedForeground: '#A1A1AA',
    card: '#27272A',
    cardForeground: '#FAFAFA',
    popover: '#27272A',
    popoverForeground: '#FAFAFA',
    border: '#3F3F46',
    input: '#3F3F46',
    ring: '#FF6A3D',
    destructive: '#DC2626',
    destructiveForeground: '#FFFFFF',
    success: '#22C55E',
    successForeground: '#FFFFFF',
    warning: '#FFC947',
    warningForeground: '#1A1A1A',
    accent: '#FFC947',
    accentForeground: '#1A1A1A',
  },
  playground: {
    primary: '#3D8BFF',
    primaryForeground: '#FFFFFF',
    secondary: '#AEB8C2',
    secondaryForeground: '#1A1A1A',
    background: '#FFFFFF',
    foreground: '#1A1A1A',
    muted: '#F1F5F9',
    mutedForeground: '#64748B',
    card: '#FFFFFF',
    cardForeground: '#1A1A1A',
    popover: '#FFFFFF',
    popoverForeground: '#1A1A1A',
    border: '#E2E8F0',
    input: '#E2E8F0',
    ring: '#3D8BFF',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    success: '#22C55E',
    successForeground: '#FFFFFF',
    warning: '#F59E0B',
    warningForeground: '#FFFFFF',
    accent: '#33D6C9',
    accentForeground: '#1A1A1A',
  },
  'team-relay': {
    primary: '#6366F1',
    primaryForeground: '#FFFFFF',
    secondary: '#E0E7FF',
    secondaryForeground: '#3730A3',
    background: '#FFFFFF',
    foreground: '#1E1B4B',
    muted: '#F5F3FF',
    mutedForeground: '#6B7280',
    card: '#FFFFFF',
    cardForeground: '#1E1B4B',
    popover: '#FFFFFF',
    popoverForeground: '#1E1B4B',
    border: '#E5E7EB',
    input: '#E5E7EB',
    ring: '#6366F1',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    success: '#10B981',
    successForeground: '#FFFFFF',
    warning: '#F59E0B',
    warningForeground: '#FFFFFF',
    accent: '#8B5CF6',
    accentForeground: '#FFFFFF',
  },
};

// ---------------------------------------------------------------------------
// CORE TOKENS (shared across all themes)
// ---------------------------------------------------------------------------

function remToPx(rem) {
  const match = rem.match(/^([\d.]+)rem$/);
  return match ? `${parseFloat(match[1]) * 16}px` : rem;
}

const core = {};

// Spacing
core.spacing = {};
const spacingValues = {
  0: '0px',
  '0-5': '2px',
  1: '4px',
  '1-5': '6px',
  2: '8px',
  '2-5': '10px',
  3: '12px',
  '3-5': '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',
};

for (const [key, value] of Object.entries(spacingValues)) {
  core.spacing[key] = { $type: 'dimension', $value: value };
}

// Border radius
core.borderRadius = {
  none: { $type: 'dimension', $value: '0px' },
  sm: { $type: 'dimension', $value: '2px' },
  default: { $type: 'dimension', $value: '6px' },
  md: { $type: 'dimension', $value: '8px' },
  lg: { $type: 'dimension', $value: '12px' },
  xl: { $type: 'dimension', $value: '16px' },
  '2xl': { $type: 'dimension', $value: '24px' },
  '3xl': { $type: 'dimension', $value: '32px' },
  full: { $type: 'dimension', $value: '9999px' },
};

// Font family
core.fontFamily = {
  sans: { $type: 'fontFamily', $value: 'Inter' },
  mono: { $type: 'fontFamily', $value: 'JetBrains Mono' },
};

// Font size
core.fontSize = {
  xs: { $type: 'dimension', $value: '12px' },
  sm: { $type: 'dimension', $value: '14px' },
  base: { $type: 'dimension', $value: '16px' },
  lg: { $type: 'dimension', $value: '18px' },
  xl: { $type: 'dimension', $value: '20px' },
  '2xl': { $type: 'dimension', $value: '24px' },
  '3xl': { $type: 'dimension', $value: '30px' },
  '4xl': { $type: 'dimension', $value: '36px' },
  '5xl': { $type: 'dimension', $value: '48px' },
  '6xl': { $type: 'dimension', $value: '60px' },
};

// Line height (paired with font sizes)
core.lineHeight = {
  xs: { $type: 'dimension', $value: '16px' },
  sm: { $type: 'dimension', $value: '20px' },
  base: { $type: 'dimension', $value: '24px' },
  lg: { $type: 'dimension', $value: '28px' },
  xl: { $type: 'dimension', $value: '28px' },
  '2xl': { $type: 'dimension', $value: '32px' },
  '3xl': { $type: 'dimension', $value: '36px' },
  '4xl': { $type: 'dimension', $value: '40px' },
  '5xl': { $type: 'dimension', $value: '48px' },
  '6xl': { $type: 'dimension', $value: '60px' },
};

// Font weight
core.fontWeight = {
  normal: { $type: 'fontWeight', $value: 400 },
  medium: { $type: 'fontWeight', $value: 500 },
  semibold: { $type: 'fontWeight', $value: 600 },
  bold: { $type: 'fontWeight', $value: 700 },
};

// Letter spacing
core.letterSpacing = {
  tighter: { $type: 'dimension', $value: '-0.8px' },
  tight: { $type: 'dimension', $value: '-0.4px' },
  normal: { $type: 'dimension', $value: '0px' },
  wide: { $type: 'dimension', $value: '0.4px' },
  wider: { $type: 'dimension', $value: '0.8px' },
};

// Box shadow
core.boxShadow = {
  sm: {
    $type: 'boxShadow',
    $value: { x: 0, y: 1, blur: 2, spread: 0, color: 'rgba(0, 0, 0, 0.05)', type: 'dropShadow' },
  },
  default: {
    $type: 'boxShadow',
    $value: [
      { x: 0, y: 1, blur: 3, spread: 0, color: 'rgba(0, 0, 0, 0.1)', type: 'dropShadow' },
      { x: 0, y: 1, blur: 2, spread: -1, color: 'rgba(0, 0, 0, 0.1)', type: 'dropShadow' },
    ],
  },
  md: {
    $type: 'boxShadow',
    $value: [
      { x: 0, y: 4, blur: 6, spread: -1, color: 'rgba(0, 0, 0, 0.1)', type: 'dropShadow' },
      { x: 0, y: 2, blur: 4, spread: -2, color: 'rgba(0, 0, 0, 0.1)', type: 'dropShadow' },
    ],
  },
  lg: {
    $type: 'boxShadow',
    $value: [
      { x: 0, y: 10, blur: 15, spread: -3, color: 'rgba(0, 0, 0, 0.1)', type: 'dropShadow' },
      { x: 0, y: 4, blur: 6, spread: -4, color: 'rgba(0, 0, 0, 0.1)', type: 'dropShadow' },
    ],
  },
  xl: {
    $type: 'boxShadow',
    $value: [
      { x: 0, y: 20, blur: 25, spread: -5, color: 'rgba(0, 0, 0, 0.1)', type: 'dropShadow' },
      { x: 0, y: 8, blur: 10, spread: -6, color: 'rgba(0, 0, 0, 0.1)', type: 'dropShadow' },
    ],
  },
  '2xl': {
    $type: 'boxShadow',
    $value: { x: 0, y: 25, blur: 50, spread: -12, color: 'rgba(0, 0, 0, 0.25)', type: 'dropShadow' },
  },
};

// Border width
core.borderWidth = {
  none: { $type: 'dimension', $value: '0px' },
  default: { $type: 'dimension', $value: '1px' },
  2: { $type: 'dimension', $value: '2px' },
  4: { $type: 'dimension', $value: '4px' },
};

// ---------------------------------------------------------------------------
// Generate theme color files
// ---------------------------------------------------------------------------
function buildColorTokens(colors) {
  const result = { color: {} };
  for (const [key, hex] of Object.entries(colors)) {
    const tokenName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    result.color[tokenName] = {
      $type: 'color',
      $value: hex,
    };
  }
  return result;
}

// ---------------------------------------------------------------------------
// Tokens Studio metadata & theme config
// ---------------------------------------------------------------------------
const themeNames = Object.keys(themes);

const metadata = {
  tokenSetOrder: ['core', ...themeNames],
};

const themeDefs = themeNames.map((name) => ({
  id: name,
  name: name.charAt(0).toUpperCase() + name.slice(1).replace(/-([a-z])/g, (_, c) => ' ' + c.toUpperCase()),
  selectedTokenSets: {
    core: 'enabled',
    ...Object.fromEntries(themeNames.map((t) => [t, t === name ? 'enabled' : 'disabled'])),
  },
}));

// ---------------------------------------------------------------------------
// Write files
// ---------------------------------------------------------------------------
function writeJson(filename, data) {
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`  ✓ ${filename}`);
}

console.log('Building Figma tokens (W3C DTCG)...');

writeJson('core.json', core);

for (const [name, colors] of Object.entries(themes)) {
  writeJson(`${name}.json`, buildColorTokens(colors));
}

writeJson('$metadata.json', metadata);
writeJson('$themes.json', themeDefs);

console.log('✅ Figma tokens build complete!');
