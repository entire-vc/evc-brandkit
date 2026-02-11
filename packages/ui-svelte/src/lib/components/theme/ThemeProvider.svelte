<script lang="ts">
  import { setContext, onMount } from 'svelte';
  import { createThemeStore } from './theme-store.js';

  interface Props {
    storageKey?: string;
    children: import('svelte').Snippet;
  }

  let { storageKey = 'evc_theme', children }: Props = $props();

  const theme = createThemeStore(storageKey);
  setContext('theme', theme);

  onMount(() => {
    theme.init();
  });
</script>

{@render children()}
