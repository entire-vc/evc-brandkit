import type { Meta, StoryObj } from '@storybook/react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Button,
} from '@entire-vc/ui';
import * as React from 'react';

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
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
    className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-[350px] space-y-2"
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">
            @peduarte starred 3 repositories
          </h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronIcon isOpen={isOpen} />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-sm">
          @radix-ui/primitives
        </div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            @radix-ui/colors
          </div>
          <div className="rounded-md border px-4 py-3 font-mono text-sm">
            @stitches/react
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const FAQ: Story = {
  render: () => {
    const [openItems, setOpenItems] = React.useState<string[]>([]);

    const toggleItem = (item: string) => {
      setOpenItems((current) =>
        current.includes(item)
          ? current.filter((i) => i !== item)
          : [...current, item]
      );
    };

    const faqs = [
      {
        id: 'faq-1',
        question: 'What is the EVC Design System?',
        answer:
          'The EVC Design System is a comprehensive collection of reusable components, design tokens, and guidelines that help teams build consistent user interfaces across all EVC products.',
      },
      {
        id: 'faq-2',
        question: 'How do I install it?',
        answer:
          'You can install the design system using pnpm: `pnpm add @entire-vc/ui @entire-vc/tokens`. Make sure to also configure Tailwind CSS with our preset.',
      },
      {
        id: 'faq-3',
        question: 'Is it accessible?',
        answer:
          'Yes! All components are built with accessibility in mind, following WAI-ARIA guidelines. We use Radix UI primitives which provide excellent keyboard navigation and screen reader support.',
      },
    ];

    return (
      <div className="w-[400px] space-y-2">
        {faqs.map((faq) => (
          <Collapsible
            key={faq.id}
            open={openItems.includes(faq.id)}
            onOpenChange={() => toggleItem(faq.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full justify-between p-4 font-medium"
              >
                {faq.question}
                <ChevronIcon isOpen={openItems.includes(faq.id)} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4 text-sm text-muted-foreground">
              {faq.answer}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    );
  },
};

export const Settings: Story = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-[350px] rounded-md border"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex w-full justify-between p-4 font-medium"
          >
            Advanced Settings
            <ChevronIcon isOpen={isOpen} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Debug Mode</span>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Verbose Logging</span>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Experimental Features</span>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  },
};

export const Nested: Story = {
  render: () => {
    const [isOpen1, setIsOpen1] = React.useState(false);
    const [isOpen2, setIsOpen2] = React.useState(false);

    return (
      <div className="w-[350px] rounded-md border">
        <Collapsible open={isOpen1} onOpenChange={setIsOpen1}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex w-full justify-between p-4 font-medium"
            >
              Section 1
              <ChevronIcon isOpen={isOpen1} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t px-4 py-3">
            <p className="text-sm text-muted-foreground mb-2">
              Content for section 1
            </p>
            <Collapsible open={isOpen2} onOpenChange={setIsOpen2}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex w-full justify-between"
                >
                  Nested Section
                  <ChevronIcon isOpen={isOpen2} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 pl-4 border-l-2">
                <p className="text-sm text-muted-foreground">
                  This is nested content inside the first section.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
};
