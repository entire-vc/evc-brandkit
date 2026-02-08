import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '@entire-vc/ui';
import * as React from 'react';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    );
  },
};

export const Range: Story = {
  render: () => {
    const [range, setRange] = React.useState<{
      from: Date | undefined;
      to: Date | undefined;
    }>({
      from: undefined,
      to: undefined,
    });

    return (
      <div className="space-y-4">
        <Calendar
          mode="range"
          selected={range}
          onSelect={(range) => setRange(range as { from: Date | undefined; to: Date | undefined })}
          className="rounded-md border"
          numberOfMonths={2}
        />
        {range?.from && (
          <p className="text-sm text-muted-foreground">
            Selected: {range.from.toLocaleDateString()}
            {range.to && ` - ${range.to.toLocaleDateString()}`}
          </p>
        )}
      </div>
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const [dates, setDates] = React.useState<Date[] | undefined>([]);
    return (
      <div className="space-y-4">
        <Calendar
          mode="multiple"
          selected={dates}
          onSelect={setDates}
          className="rounded-md border"
        />
        {dates && dates.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Selected {dates.length} date(s)
          </p>
        )}
      </div>
    );
  },
};

export const WithDisabledDates: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={(date) =>
          date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
        className="rounded-md border"
      />
    );
  },
};

export const TwoMonths: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        numberOfMonths={2}
        className="rounded-md border"
      />
    );
  },
};

export const WithFooter: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    return (
      <div className="space-y-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <p className="text-sm text-center text-muted-foreground">
          {date ? date.toLocaleDateString() : 'Pick a date'}
        </p>
      </div>
    );
  },
};
