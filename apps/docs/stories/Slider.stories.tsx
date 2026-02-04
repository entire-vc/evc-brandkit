import type { Meta, StoryObj } from '@storybook/react';
import { Slider, Label } from '@evc/ui';
import * as React from 'react';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[300px]">
      <Slider defaultValue={[50]} max={100} step={1} />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = React.useState([33]);
    return (
      <div className="w-[300px] space-y-4">
        <div className="flex justify-between">
          <Label>Volume</Label>
          <span className="text-sm text-muted-foreground">{value}%</span>
        </div>
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
        />
      </div>
    );
  },
};

export const Range: Story = {
  render: () => {
    const [value, setValue] = React.useState([25, 75]);
    return (
      <div className="w-[300px] space-y-4">
        <div className="flex justify-between">
          <Label>Price Range</Label>
          <span className="text-sm text-muted-foreground">
            ${value[0]} - ${value[1]}
          </span>
        </div>
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={1}
        />
      </div>
    );
  },
};

export const Steps: Story = {
  render: () => {
    const [value, setValue] = React.useState([50]);
    return (
      <div className="w-[300px] space-y-4">
        <div className="flex justify-between">
          <Label>Quality</Label>
          <span className="text-sm text-muted-foreground">{value}%</span>
        </div>
        <Slider
          value={value}
          onValueChange={setValue}
          max={100}
          step={25}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
          <span>Ultra</span>
          <span>Max</span>
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-[300px]">
      <Slider defaultValue={[50]} max={100} step={1} disabled />
    </div>
  ),
};
