import type { Meta, StoryObj } from '@storybook/react';
import { Toaster, Button } from '@evc/ui';
import * as React from 'react';

// Note: In a real app, you would import { toast } from 'sonner'
// For this demo, we show the Toaster component with manual triggers

const meta: Meta<typeof Toaster> = {
  title: 'Components/Toaster',
  component: Toaster,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Simple demo component that shows the Toaster
const ToasterDemo = () => {
  const [showToast, setShowToast] = React.useState(false);

  React.useEffect(() => {
    if (showToast) {
      // In real usage: toast('Event has been created')
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground max-w-sm">
        <p className="mb-2">
          The Toaster component works with the <code className="bg-muted px-1 rounded">sonner</code> library.
        </p>
        <p>
          Usage: Add <code className="bg-muted px-1 rounded">&lt;Toaster /&gt;</code> to your app root,
          then use <code className="bg-muted px-1 rounded">toast()</code> to show notifications.
        </p>
      </div>
      <div className="border rounded-lg p-4 bg-muted/30">
        <p className="text-sm font-medium mb-2">Example code:</p>
        <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
{`import { Toaster } from '@evc/ui';
import { toast } from 'sonner';

// In your app root:
<Toaster />

// To show a toast:
toast('Event created');
toast.success('Saved!');
toast.error('Error!');
toast.warning('Warning!');`}
        </pre>
      </div>
      <Toaster />
    </div>
  );
};

export const Default: Story = {
  render: () => <ToasterDemo />,
};

export const Usage: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <h3 className="font-semibold">Toast Variants</h3>
      <p className="text-sm text-muted-foreground">
        The Toaster component supports various toast types:
      </p>
      <ul className="text-sm space-y-2 list-disc list-inside">
        <li><code className="bg-muted px-1 rounded">toast('message')</code> - Default toast</li>
        <li><code className="bg-muted px-1 rounded">toast.success('message')</code> - Success toast</li>
        <li><code className="bg-muted px-1 rounded">toast.error('message')</code> - Error toast</li>
        <li><code className="bg-muted px-1 rounded">toast.warning('message')</code> - Warning toast</li>
        <li><code className="bg-muted px-1 rounded">toast.info('message')</code> - Info toast</li>
        <li><code className="bg-muted px-1 rounded">toast.loading('message')</code> - Loading toast</li>
      </ul>
      <h3 className="font-semibold mt-6">With Actions</h3>
      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{`toast('Event created', {
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo'),
  },
});`}
      </pre>
      <h3 className="font-semibold mt-6">Promise Toast</h3>
      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{`toast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Error saving',
});`}
      </pre>
      <Toaster />
    </div>
  ),
};

export const Positioning: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      <h3 className="font-semibold">Toast Positions</h3>
      <p className="text-sm text-muted-foreground">
        Configure toast position via the Toaster component:
      </p>
      <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
{`// Default: bottom-right
<Toaster />

// Other positions:
<Toaster position="top-left" />
<Toaster position="top-center" />
<Toaster position="top-right" />
<Toaster position="bottom-left" />
<Toaster position="bottom-center" />
<Toaster position="bottom-right" />`}
      </pre>
      <Toaster />
    </div>
  ),
};
