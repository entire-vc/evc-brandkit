import type { Meta, StoryObj } from '@storybook/react';
import { Logo } from '@entire-vc/ui';

const meta: Meta<typeof Logo> = {
  title: 'Brand/Logo',
  component: Logo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    brand: {
      control: 'select',
      options: ['entire', 'spark'],
    },
    variant: {
      control: 'select',
      options: ['icon', 'full'],
    },
    color: {
      control: 'select',
      options: ['black', 'grey', 'white', 'spark', 'color', 'currentColor'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brand: 'entire',
    variant: 'full',
    color: 'black',
    className: 'h-12',
  },
};

export const EntireFull: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Black</span>
        <Logo brand="entire" variant="full" color="black" className="h-10" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Grey</span>
        <Logo brand="entire" variant="full" color="grey" className="h-10" />
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-zinc-900 p-4">
        <span className="text-sm text-zinc-400">White (on dark)</span>
        <Logo brand="entire" variant="full" color="white" className="h-10" />
      </div>
    </div>
  ),
};

export const EntireIcon: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Logo brand="entire" variant="icon" color="black" className="h-16" />
        <span className="text-xs text-muted-foreground">Black</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Logo brand="entire" variant="icon" color="grey" className="h-16" />
        <span className="text-xs text-muted-foreground">Grey</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Logo brand="entire" variant="icon" color="spark" className="h-16" />
        <span className="text-xs text-muted-foreground">Spark</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-lg bg-zinc-900 p-3">
        <Logo brand="entire" variant="icon" color="white" className="h-16" />
        <span className="text-xs text-zinc-400">White</span>
      </div>
    </div>
  ),
};

export const SparkFull: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Color</span>
        <Logo brand="spark" variant="full" color="color" className="h-10" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Black</span>
        <Logo brand="spark" variant="full" color="black" className="h-10" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Grey</span>
        <Logo brand="spark" variant="full" color="grey" className="h-10" />
      </div>
      <div className="flex flex-col gap-2 rounded-lg bg-zinc-900 p-4">
        <span className="text-sm text-zinc-400">White (on dark)</span>
        <Logo brand="spark" variant="full" color="white" className="h-10" />
      </div>
    </div>
  ),
};

export const AllBrands: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-3 text-sm font-medium">Entire (full)</h3>
        <Logo brand="entire" variant="full" color="black" className="h-8" />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium">Entire (icon)</h3>
        <Logo brand="entire" variant="icon" color="black" className="h-12" />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium">Spark (full)</h3>
        <Logo brand="spark" variant="full" color="color" className="h-8" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-4">
        <Logo brand="entire" variant="full" color="black" className="h-4" />
        <Logo brand="entire" variant="full" color="black" className="h-6" />
        <Logo brand="entire" variant="full" color="black" className="h-8" />
        <Logo brand="entire" variant="full" color="black" className="h-10" />
        <Logo brand="entire" variant="full" color="black" className="h-12" />
      </div>
      <span className="text-xs text-muted-foreground">
        h-4 / h-6 / h-8 / h-10 / h-12
      </span>
    </div>
  ),
};

export const CurrentColor: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Use <code className="rounded bg-muted px-1 py-0.5 text-xs">color="currentColor"</code> to
        inherit color from CSS. The logo fill follows the parent's <code className="rounded bg-muted px-1 py-0.5 text-xs">color</code> property.
      </p>
      <div className="flex items-center gap-6 text-blue-600">
        <Logo brand="entire" variant="icon" color="currentColor" className="h-12" />
        <Logo brand="entire" variant="full" color="currentColor" className="h-8" />
      </div>
      <div className="flex items-center gap-6 text-emerald-600">
        <Logo brand="entire" variant="icon" color="currentColor" className="h-12" />
        <Logo brand="spark" variant="full" color="currentColor" className="h-8" />
      </div>
      <div className="flex items-center gap-6 text-rose-500">
        <Logo brand="entire" variant="icon" color="currentColor" className="h-12" />
        <Logo brand="spark" variant="full" color="currentColor" className="h-8" />
      </div>
      <div className="flex items-center gap-6 rounded-lg bg-zinc-900 p-4 text-amber-400">
        <Logo brand="entire" variant="icon" color="currentColor" className="h-12" />
        <Logo brand="spark" variant="full" color="currentColor" className="h-8" />
      </div>
    </div>
  ),
};

export const OnDarkBackground: Story = {
  render: () => (
    <div className="flex flex-col gap-6 rounded-xl bg-zinc-950 p-8">
      <Logo brand="entire" variant="full" color="white" className="h-8" />
      <Logo brand="entire" variant="icon" color="white" className="h-14" />
      <Logo brand="spark" variant="full" color="white" className="h-8" />
      <Logo brand="spark" variant="full" color="color" className="h-8" />
      <Logo brand="entire" variant="icon" color="spark" className="h-14" />
    </div>
  ),
};
