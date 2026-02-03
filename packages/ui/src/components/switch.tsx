import * as React from 'react';
import { cn } from '../lib/utils';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, checked, defaultChecked, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked ?? false);
    const controlledChecked = checked !== undefined ? checked : isChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      if (checked === undefined) {
        setIsChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
      props.onChange?.(e);
    };

    return (
      <label
        className={cn(
          'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          controlledChecked ? 'bg-primary' : 'bg-input',
          className
        )}
      >
        <input
          type="checkbox"
          ref={ref}
          checked={controlledChecked}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        <span
          className={cn(
            'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform',
            controlledChecked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </label>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch };
