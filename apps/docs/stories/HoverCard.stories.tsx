import type { Meta, StoryObj } from '@storybook/react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Button,
} from '@entire-vc/ui';

const meta: Meta<typeof HoverCard> = {
  title: 'Components/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const CalendarIcon = () => (
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
    className="mr-2 h-4 w-4 opacity-70"
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <CalendarIcon />
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a href="#" className="text-primary underline">
          Pavel Rogozhin
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>PR</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-semibold">Pavel Rogozhin</h4>
            <p className="text-sm text-muted-foreground">@pavel</p>
            <p className="text-sm">
              Software engineer working on design systems and developer tools.
            </p>
            <div className="flex gap-4 pt-2 text-xs text-muted-foreground">
              <span><strong>128</strong> following</span>
              <span><strong>1.2k</strong> followers</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const ProductPreview: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline">View Product</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <div className="h-32 w-full rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-4xl">📦</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold">EVC Design System</h4>
            <p className="text-sm text-muted-foreground">
              A complete design system with 50+ components built with React,
              TypeScript, and Tailwind CSS.
            </p>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold">$99</span>
            <Button size="sm">Add to Cart</Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const LinkPreview: Story = {
  render: () => (
    <p className="text-sm">
      Check out the documentation at{' '}
      <HoverCard>
        <HoverCardTrigger asChild>
          <a href="#" className="text-primary underline">
            docs.evc.design
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">EVC Documentation</h4>
            <p className="text-sm text-muted-foreground">
              Comprehensive documentation for all components, including examples,
              API references, and best practices.
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-green-500 mr-1">●</span>
              docs.evc.design
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>{' '}
      for more information.
    </p>
  ),
};
