<script lang="ts">
  import { cn } from '../../utils.js';
  import {
    logoData,
    type LogoBrand,
    type LogoVariant,
    type LogoVariantData,
  } from '@entire-vc/tokens';
  import type { SVGAttributes } from 'svelte/elements';

  type Props = Omit<SVGAttributes<SVGSVGElement>, 'viewBox' | 'xmlns'> & {
    /** Brand name */
    brand: LogoBrand;
    /** Logo variant: 'icon' (mark only) or 'full' (mark + wordmark) */
    variant?: LogoVariant;
    /**
     * Color variant. Available colors depend on brand/variant combination.
     * Use 'currentColor' to inherit color from the parent CSS `color` property.
     */
    color?: string;
    class?: string;
  };

  let {
    brand,
    variant = 'full',
    color = 'black',
    class: className,
    ...restProps
  }: Props = $props();

  function getVariantData(
    b: LogoBrand,
    v: LogoVariant,
    c: string
  ): LogoVariantData | undefined {
    const brandData = logoData[b];
    if (!brandData) return undefined;
    const variantData = (brandData as Record<string, Record<string, LogoVariantData>>)[v];
    if (!variantData) return undefined;
    return variantData[c];
  }

  let useCurrentColor = $derived(color === 'currentColor');
  let resolvedColor = $derived(useCurrentColor ? 'black' : color);
  let data = $derived(getVariantData(brand, variant, resolvedColor));
</script>

{#if data}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={data.viewBox}
    fill={useCurrentColor ? 'currentColor' : undefined}
    class={cn('h-auto w-full', className)}
    role="img"
    aria-label={`${brand} logo`}
    {...restProps}
  >
    {#each data.paths as path}
      <path d={path.d} fill={useCurrentColor ? undefined : path.fill} />
    {/each}
  </svg>
{/if}
