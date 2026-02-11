/**
 * Framework-agnostic theme mode utilities
 *
 * Handles light/dark/system theme switching with localStorage persistence
 * and system preference detection. Works in any JS environment (SSR-safe).
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'evc_theme';

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getEffectiveTheme(mode: ThemeMode): 'light' | 'dark' {
  return mode === 'system' ? getSystemTheme() : mode;
}

export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const effective = getEffectiveTheme(mode);
  const html = document.documentElement;
  html.classList.remove('light', 'dark');
  html.classList.add(effective);
}

export function loadTheme(storageKey: string = THEME_STORAGE_KEY): ThemeMode {
  if (typeof localStorage === 'undefined') return 'system';
  const stored = localStorage.getItem(storageKey);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

export function saveTheme(mode: ThemeMode, storageKey: string = THEME_STORAGE_KEY): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(storageKey, mode);
}

export function cycleThemeMode(current: ThemeMode): ThemeMode {
  const order: ThemeMode[] = ['light', 'dark', 'system'];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
}
