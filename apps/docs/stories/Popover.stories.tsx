import type { Meta, StoryObj } from '@storybook/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Input,
  Label,
} from '@evc/ui';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Simple: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Click me</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <p className="text-sm">
          This is a simple popover with some text content. Popovers are great
          for displaying additional information without cluttering the UI.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">Update Settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Settings</h4>
            <p className="text-sm text-muted-foreground">
              Configure your preferences.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" placeholder="Enter name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter email" />
          </div>
          <Button size="sm">Save</Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
