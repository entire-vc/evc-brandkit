import type { Meta, StoryObj } from '@storybook/react';
import { Input, Label } from '@evc/ui';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Email',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Password',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="hello@entire.vc" />
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input id="username" placeholder="johndoe" />
      <p className="text-sm text-muted-foreground">
        This will be your public display name.
      </p>
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Label htmlFor="email-error">Email</Label>
      <Input 
        id="email-error" 
        type="email" 
        placeholder="Email" 
        className="border-destructive focus-visible:ring-destructive"
      />
      <p className="text-sm text-destructive">
        Please enter a valid email address.
      </p>
    </div>
  ),
};

export const File: Story = {
  args: {
    type: 'file',
  },
};
