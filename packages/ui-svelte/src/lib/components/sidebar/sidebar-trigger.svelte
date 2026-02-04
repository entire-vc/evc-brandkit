<script lang="ts">
  import { cn } from '../../utils.js';
  import { getSidebarContext } from './context.svelte.js';
  import { Button } from '../button/index.js';
  import { PanelLeft } from 'lucide-svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = HTMLButtonAttributes & {
    class?: string;
    children?: Snippet;
  };

  let { class: className, onclick, children, ...restProps }: Props = $props();

  const ctx = getSidebarContext();

  function handleClick(event: MouseEvent) {
    if (onclick) {
      // @ts-ignore - Event types mismatch between Svelte and native
      onclick(event);
    }
    ctx.toggleSidebar();
  }
</script>

<Button
  data-sidebar="trigger"
  variant="ghost"
  size="icon"
  class={cn('h-7 w-7', className)}
  onclick={handleClick}
  {...restProps}
>
  {#if children}
    {@render children()}
  {:else}
    <PanelLeft />
    <span class="sr-only">Toggle Sidebar</span>
  {/if}
</Button>
