import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea, ScrollBar, Separator } from '@evc/ui';

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const tags = Array.from({ length: 50 }).map((_, i) => `Tag ${i + 1}`);

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-[150px] shrink-0 rounded-md border p-4"
          >
            <div className="text-sm font-medium">Item {i + 1}</div>
            <div className="text-xs text-muted-foreground">
              Description for item {i + 1}
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

export const LongContent: Story = {
  render: () => (
    <ScrollArea className="h-[400px] w-[350px] rounded-md border p-4">
      <h4 className="text-lg font-semibold mb-4">Terms of Service</h4>
      <div className="text-sm text-muted-foreground space-y-4">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse
          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
          cupidatat non proident, sunt in culpa qui officia deserunt.
        </p>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
          quae ab illo inventore veritatis et quasi architecto beatae vitae.
        </p>
        <p>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
          aut fugit, sed quia consequuntur magni dolores eos qui ratione
          voluptatem sequi nesciunt.
        </p>
        <p>
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit, sed quia non numquam eius modi tempora
          incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
        </p>
        <p>
          Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis
          suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
        </p>
        <p>
          Quis autem vel eum iure reprehenderit qui in ea voluptate velit
          esse quam nihil molestiae consequatur, vel illum qui dolorem eum
          fugiat quo voluptas nulla pariatur?
        </p>
      </div>
    </ScrollArea>
  ),
};

export const WithCards: Story = {
  render: () => (
    <ScrollArea className="h-[300px] w-[400px] rounded-md border">
      <div className="p-4 space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <h5 className="font-semibold">Card {i + 1}</h5>
            <p className="text-sm text-muted-foreground mt-1">
              This is the description for card {i + 1}. It contains some
              useful information.
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
