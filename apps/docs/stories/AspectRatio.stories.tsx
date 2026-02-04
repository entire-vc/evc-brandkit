import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from '@evc/ui';

const meta: Meta<typeof AspectRatio> = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo by Drew Beamer"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  render: () => (
    <div className="w-[300px]">
      <AspectRatio ratio={1} className="bg-muted">
        <img
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const Portrait: Story = {
  render: () => (
    <div className="w-[200px]">
      <AspectRatio ratio={3 / 4} className="bg-muted">
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&dpr=2&q=80"
          alt="Dog"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const Cinematic: Story = {
  render: () => (
    <div className="w-[500px]">
      <AspectRatio ratio={21 / 9} className="bg-muted">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&dpr=2&q=80"
          alt="Mountains"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const WithPlaceholder: Story = {
  render: () => (
    <div className="w-[450px]">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-md">
        <div className="flex h-full w-full items-center justify-center">
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
            className="h-10 w-10 text-muted-foreground"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const VideoEmbed: Story = {
  render: () => (
    <div className="w-[560px]">
      <AspectRatio ratio={16 / 9}>
        <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-primary/5">
          <div className="text-center">
            <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Video Player</p>
          </div>
        </div>
      </AspectRatio>
    </div>
  ),
};

export const AllRatios: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[600px]">
      <div>
        <p className="text-sm text-muted-foreground mb-2">1:1</p>
        <AspectRatio ratio={1} className="bg-muted rounded-md">
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Square
          </div>
        </AspectRatio>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">4:3</p>
        <AspectRatio ratio={4 / 3} className="bg-muted rounded-md">
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Standard
          </div>
        </AspectRatio>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">16:9</p>
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-md">
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Widescreen
          </div>
        </AspectRatio>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">3:4</p>
        <AspectRatio ratio={3 / 4} className="bg-muted rounded-md">
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Portrait
          </div>
        </AspectRatio>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">9:16</p>
        <AspectRatio ratio={9 / 16} className="bg-muted rounded-md">
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Story
          </div>
        </AspectRatio>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">21:9</p>
        <AspectRatio ratio={21 / 9} className="bg-muted rounded-md">
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Cinematic
          </div>
        </AspectRatio>
      </div>
    </div>
  ),
};
