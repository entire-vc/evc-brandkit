import * as React from 'react';
import {
  logoData,
  type LogoBrand,
  type LogoVariant,
  type LogoVariantData,
} from '@entire-vc/tokens';
import { cn } from '../lib/utils';

export interface LogoProps extends React.SVGAttributes<SVGSVGElement> {
  /** Brand name */
  brand: LogoBrand;
  /** Logo variant: 'icon' (mark only) or 'full' (mark + wordmark) */
  variant?: LogoVariant;
  /**
   * Color variant. Available colors depend on brand/variant combination.
   * Use 'currentColor' to inherit color from the parent CSS `color` property.
   */
  color?: string;
}

function getVariantData(
  brand: LogoBrand,
  variant: LogoVariant,
  color: string
): LogoVariantData | undefined {
  const brandData = logoData[brand];
  if (!brandData) return undefined;
  const variantData = (brandData as Record<string, Record<string, LogoVariantData>>)[variant];
  if (!variantData) return undefined;
  return variantData[color];
}

const Logo = React.forwardRef<SVGSVGElement, LogoProps>(
  ({ brand, variant = 'full', color = 'black', className, ...props }, ref) => {
    const useCurrentColor = color === 'currentColor';
    const resolvedColor = useCurrentColor ? 'black' : color;
    const data = getVariantData(brand, variant, resolvedColor);
    if (!data) return null;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={data.viewBox}
        fill={useCurrentColor ? 'currentColor' : undefined}
        className={cn('h-auto w-full', className)}
        role="img"
        aria-label={`${brand} logo`}
        {...props}
      >
        {data.paths.map((path, i) => (
          <path key={i} d={path.d} fill={useCurrentColor ? undefined : path.fill} />
        ))}
      </svg>
    );
  }
);

Logo.displayName = 'Logo';

export { Logo };
