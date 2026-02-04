import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '@evc/ui';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const BoldIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
  </svg>
);

const ItalicIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <line x1="19" x2="10" y1="4" y2="4" />
    <line x1="14" x2="5" y1="20" y2="20" />
    <line x1="15" x2="9" y1="4" y2="20" />
  </svg>
);

const UnderlineIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
  >
    <path d="M6 4v6a6 6 0 0 0 12 0V4" />
    <line x1="4" x2="20" y1="20" y2="20" />
  </svg>
);

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  ),
};

export const WithText: Story = {
  render: () => <Toggle aria-label="Toggle italic">Italic</Toggle>,
};

export const Outline: Story = {
  render: () => (
    <Toggle variant="outline" aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  ),
};

export const Small: Story = {
  render: () => (
    <Toggle size="sm" aria-label="Toggle italic">
      <ItalicIcon />
    </Toggle>
  ),
};

export const Large: Story = {
  render: () => (
    <Toggle size="lg" aria-label="Toggle underline">
      <UnderlineIcon />
    </Toggle>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Toggle disabled aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  ),
};

export const Pressed: Story = {
  render: () => (
    <Toggle defaultPressed aria-label="Toggle bold">
      <BoldIcon />
    </Toggle>
  ),
};

export const TextFormatting: Story = {
  render: () => (
    <div className="flex gap-1">
      <Toggle aria-label="Toggle bold">
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <ItalicIcon />
      </Toggle>
      <Toggle aria-label="Toggle underline">
        <UnderlineIcon />
      </Toggle>
    </div>
  ),
};
