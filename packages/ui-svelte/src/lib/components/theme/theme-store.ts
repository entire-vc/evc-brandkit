import { writable, derived, get } from 'svelte/store';
import type { ThemeMode } from '@entire-vc/tokens';
import {
  THEME_STORAGE_KEY,
  getEffectiveTheme,
  applyTheme,
  loadTheme,
  saveTheme,
  cycleThemeMode,
} from '@entire-vc/tokens';

export function createThemeStore(storageKey: string = THEME_STORAGE_KEY) {
  const mode = writable<ThemeMode>(loadTheme(storageKey));

  const effectiveTheme = derived(mode, ($mode) => getEffectiveTheme($mode));

  function set(newMode: ThemeMode) {
    mode.set(newMode);
    saveTheme(newMode, storageKey);
    applyTheme(newMode);
  }

  function cycle() {
    const current = get(mode);
    set(cycleThemeMode(current));
  }

  function init() {
    const current = get(mode);
    applyTheme(current);

    // Listen for system preference changes
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      mql.addEventListener('change', () => {
        if (get(mode) === 'system') {
          applyTheme('system');
        }
      });
    }
  }

  return {
    subscribe: mode.subscribe,
    effectiveTheme,
    set,
    cycle,
    init,
  };
}
