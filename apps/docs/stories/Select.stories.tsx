import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Label } from '@entire-vc/ui';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="grape">Grape</SelectItem>
        <SelectItem value="mango">Mango</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Country</Label>
      <Select defaultValue="us">
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
          <SelectItem value="fr">France</SelectItem>
          <SelectItem value="jp">Japan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Timezone: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Timezone</Label>
      <Select defaultValue="utc">
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
          <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
          <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
          <SelectItem value="cet">CET (Central European Time)</SelectItem>
          <SelectItem value="jst">JST (Japan Standard Time)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Status: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Status</Label>
      <Select defaultValue="active">
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
