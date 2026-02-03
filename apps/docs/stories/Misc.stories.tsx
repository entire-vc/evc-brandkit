import type { Meta, StoryObj } from '@storybook/react';
import { Progress, Skeleton, Separator, Avatar, AvatarImage, AvatarFallback } from '@evc/ui';

const meta: Meta = {
  title: 'Components/Misc',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const ProgressDefault: StoryObj = {
  name: 'Progress',
  render: () => <Progress value={60} className="w-[300px]" />,
};

export const ProgressVariants: StoryObj = {
  name: 'Progress (Variants)',
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">0%</p>
        <Progress value={0} />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">25%</p>
        <Progress value={25} />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">50%</p>
        <Progress value={50} />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">75%</p>
        <Progress value={75} />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">100%</p>
        <Progress value={100} />
      </div>
    </div>
  ),
};

export const SkeletonDefault: StoryObj = {
  name: 'Skeleton',
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

export const SkeletonCard: StoryObj = {
  name: 'Skeleton (Card)',
  render: () => (
    <div className="w-[300px] rounded-lg border p-4 space-y-4">
      <Skeleton className="h-32 w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  ),
};

export const SeparatorHorizontal: StoryObj = {
  name: 'Separator (Horizontal)',
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">EVC Brand Kit</h4>
        <p className="text-sm text-muted-foreground">
          Design system for Entire VC products.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Components</div>
        <Separator orientation="vertical" />
        <div>Themes</div>
      </div>
    </div>
  ),
};

export const AvatarDefault: StoryObj = {
  name: 'Avatar',
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
};

export const AvatarFallbackOnly: StoryObj = {
  name: 'Avatar (Fallback)',
  render: () => (
    <Avatar>
      <AvatarFallback>PR</AvatarFallback>
    </Avatar>
  ),
};

export const AvatarGroup: StoryObj = {
  name: 'Avatar (Group)',
  render: () => (
    <div className="flex -space-x-4">
      <Avatar className="border-2 border-background">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>EF</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-background">
        <AvatarFallback>+3</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const AvatarSizes: StoryObj = {
  name: 'Avatar (Sizes)',
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-6 w-6">
        <AvatarFallback className="text-xs">XS</AvatarFallback>
      </Avatar>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className="h-14 w-14">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar className="h-20 w-20">
        <AvatarFallback className="text-lg">XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};
