import * as React from 'react';
import { cn } from '../lib/utils';

interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
  name: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

function useRadioGroup() {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error('RadioGroupItem must be used within a RadioGroup');
  }
  return context;
}

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value: controlledValue, defaultValue, onValueChange, name = 'radio-group', children, ...props }, ref) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? '');
    const value = controlledValue ?? uncontrolledValue;

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (controlledValue === undefined) {
          setUncontrolledValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [controlledValue, onValueChange]
    );

    return (
      <RadioGroupContext.Provider value={{ value, onValueChange: handleValueChange, name }}>
        <div ref={ref} role="radiogroup" className={cn('grid gap-2', className)} {...props}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = 'RadioGroup';

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'name'> {
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange, name } = useRadioGroup();
    const isChecked = selectedValue === value;

    return (
      <label className="relative inline-flex items-center">
        <input
          type="radio"
          ref={ref}
          name={name}
          value={value}
          checked={isChecked}
          onChange={() => onValueChange(value)}
          className="sr-only peer"
          {...props}
        />
        <div
          className={cn(
            'aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center',
            className
          )}
        >
          {isChecked && <div className="h-2 w-2 rounded-full bg-primary" />}
        </div>
      </label>
    );
  }
);
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
