import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { cn } from '../lib/utils';
import { buttonVariants } from './button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'relative flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        month_caption: 'flex justify-center pt-1 items-center',
        caption_label: 'text-sm font-medium',
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex',
        weekday: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day: 'h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal'
        ),
        range_start: '[&_button]:rounded-l-md',
        range_end: '[&_button]:rounded-r-md',
        selected:
          '[&_button]:bg-primary [&_button]:text-primary-foreground [&_button:hover]:bg-primary [&_button:hover]:text-primary-foreground [&_button:focus]:bg-primary [&_button:focus]:text-primary-foreground',
        today: '[&_button]:bg-accent [&_button]:text-accent-foreground',
        outside: 'text-muted-foreground [&_button]:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        range_middle: '[&_button]:!bg-accent [&_button]:!text-accent-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
