import type { Meta, StoryObj } from '@storybook/react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuShortcut,
} from '@evc/ui';
import * as React from 'react';

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset>
          Back
          <ContextMenuShortcut>Cmd+[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset disabled>
          Forward
          <ContextMenuShortcut>Cmd+]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset>
          Reload
          <ContextMenuShortcut>Cmd+R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem>
              Save Page As...
              <ContextMenuShortcut>Cmd+S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>
          Show Bookmarks Bar
          <ContextMenuShortcut>Cmd+Shift+B</ContextMenuShortcut>
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup value="pedro">
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const FileExplorer: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[200px] w-[300px] items-center justify-center rounded-md border bg-muted/50 text-sm">
        <div className="text-center">
          <span className="text-4xl">📁</span>
          <p className="mt-2">Documents</p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>
          Open
          <ContextMenuShortcut>Enter</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>Open in New Tab</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Cut</ContextMenuItem>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuItem className="text-destructive">Delete</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Properties</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const TextEditor: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[150px] w-[400px] items-center justify-center rounded-md border p-4 text-sm">
        <p>
          Select this text and right-click to see formatting options. This is an
          example of how context menus can be used in text editing scenarios.
        </p>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem>
          Cut
          <ContextMenuShortcut>Cmd+X</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Copy
          <ContextMenuShortcut>Cmd+C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Paste
          <ContextMenuShortcut>Cmd+V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>Format</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-40">
            <ContextMenuItem>Bold</ContextMenuItem>
            <ContextMenuItem>Italic</ContextMenuItem>
            <ContextMenuItem>Underline</ContextMenuItem>
            <ContextMenuItem>Strikethrough</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Align</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-32">
            <ContextMenuItem>Left</ContextMenuItem>
            <ContextMenuItem>Center</ContextMenuItem>
            <ContextMenuItem>Right</ContextMenuItem>
            <ContextMenuItem>Justify</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem>Add Link...</ContextMenuItem>
        <ContextMenuItem>Add Comment...</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const WithCheckboxes: Story = {
  render: () => {
    const [showGrid, setShowGrid] = React.useState(true);
    const [showRulers, setShowRulers] = React.useState(false);

    return (
      <ContextMenu>
        <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          Right click for view options
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <ContextMenuLabel>View Options</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={showGrid}
            onCheckedChange={setShowGrid}
          >
            Show Grid
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={showRulers}
            onCheckedChange={setShowRulers}
          >
            Show Rulers
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  },
};
