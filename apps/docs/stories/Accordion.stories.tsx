import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@entire-vc/ui';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other components'
          aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is EVC?</AccordionTrigger>
        <AccordionContent>
          EVC (Entire VC) is a venture capital firm focused on early-stage
          technology investments.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>What technologies do you use?</AccordionTrigger>
        <AccordionContent>
          We use React, TypeScript, Tailwind CSS, and Radix UI primitives
          to build our design system.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>How can I contribute?</AccordionTrigger>
        <AccordionContent>
          You can contribute by submitting pull requests to our GitHub repository
          or by reporting issues you encounter.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const FAQ: Story = {
  render: () => (
    <div className="w-[500px]">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible>
        <AccordionItem value="faq-1">
          <AccordionTrigger>How do I install the package?</AccordionTrigger>
          <AccordionContent>
            <code className="bg-muted px-2 py-1 rounded text-sm">
              pnpm add @entire-vc/ui @entire-vc/tokens
            </code>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger>Do I need Tailwind CSS?</AccordionTrigger>
          <AccordionContent>
            Yes, our components are built with Tailwind CSS. You'll need to
            configure Tailwind with our preset for the best experience.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-3">
          <AccordionTrigger>Can I customize the theme?</AccordionTrigger>
          <AccordionContent>
            Absolutely! We provide multiple brand themes (Entire, Spark, Playground,
            Team Relay) and you can also create custom themes using CSS variables.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-4">
          <AccordionTrigger>Is it production ready?</AccordionTrigger>
          <AccordionContent>
            Yes, our components are used in production across multiple EVC products.
            They are fully tested and accessible.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
