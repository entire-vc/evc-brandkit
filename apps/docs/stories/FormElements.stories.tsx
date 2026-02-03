import type { Meta, StoryObj } from '@storybook/react';
import { Switch, Checkbox, RadioGroup, RadioGroupItem, Label } from '@evc/ui';

const meta: Meta = {
  title: 'Components/Form Elements',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

export const SwitchDefault: StoryObj = {
  name: 'Switch',
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const SwitchChecked: StoryObj = {
  name: 'Switch (Checked)',
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="notifications" defaultChecked />
      <Label htmlFor="notifications">Enable Notifications</Label>
    </div>
  ),
};

export const CheckboxDefault: StoryObj = {
  name: 'Checkbox',
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const CheckboxChecked: StoryObj = {
  name: 'Checkbox (Checked)',
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="marketing" defaultChecked />
      <Label htmlFor="marketing">Receive marketing emails</Label>
    </div>
  ),
};

export const CheckboxGroup: StoryObj = {
  name: 'Checkbox Group',
  render: () => (
    <div className="space-y-3">
      <p className="text-sm font-medium">Select your interests:</p>
      {['Technology', 'Design', 'Business', 'Marketing'].map((item) => (
        <div key={item} className="flex items-center space-x-2">
          <Checkbox id={item.toLowerCase()} />
          <Label htmlFor={item.toLowerCase()}>{item}</Label>
        </div>
      ))}
    </div>
  ),
};

export const RadioGroupDefault: StoryObj = {
  name: 'Radio Group',
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
};

export const RadioGroupPlan: StoryObj = {
  name: 'Radio Group (Pricing)',
  render: () => (
    <RadioGroup defaultValue="pro" className="space-y-3">
      <p className="text-sm font-medium mb-2">Select your plan:</p>
      {[
        { value: 'free', label: 'Free', price: '$0/mo' },
        { value: 'pro', label: 'Pro', price: '$19/mo' },
        { value: 'enterprise', label: 'Enterprise', price: '$99/mo' },
      ].map((plan) => (
        <div key={plan.value} className="flex items-center justify-between rounded-md border p-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={plan.value} id={plan.value} />
            <Label htmlFor={plan.value}>{plan.label}</Label>
          </div>
          <span className="text-sm text-muted-foreground">{plan.price}</span>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const AllFormElements: StoryObj = {
  name: 'All Form Elements',
  render: () => (
    <div className="w-[300px] space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium">Switch</p>
        <div className="flex items-center space-x-2">
          <Switch id="switch-demo" />
          <Label htmlFor="switch-demo">Dark Mode</Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium">Checkbox</p>
        <div className="flex items-center space-x-2">
          <Checkbox id="checkbox-demo" />
          <Label htmlFor="checkbox-demo">Remember me</Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium">Radio Group</p>
        <RadioGroup defaultValue="option1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="option1" />
            <Label htmlFor="option1">Option 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="option2" />
            <Label htmlFor="option2">Option 2</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
};
