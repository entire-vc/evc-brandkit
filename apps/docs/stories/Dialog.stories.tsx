import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
  Label,
  buttonVariants,
} from '@evc/ui';
import { cn } from '@evc/ui';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className={cn(buttonVariants({ variant: 'outline' }))}>
        Open Dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className={cn(buttonVariants())}>
        Edit Profile
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Pavel Rogozhin" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@pavel" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className={cn(buttonVariants({ variant: 'destructive' }))}>
        Delete Account
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action is irreversible
            and will permanently remove all your data.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="confirm" className="text-sm text-muted-foreground">
            Type "DELETE" to confirm:
          </Label>
          <Input id="confirm" className="mt-2" placeholder="DELETE" />
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Simple: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger className={cn(buttonVariants({ variant: 'secondary' }))}>
        Show Info
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Information</DialogTitle>
          <DialogDescription>
            This is a simple informational dialog with just a message.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Dialogs are modal windows that appear on top of the main content.
          They can be used to display important information or request user input.
        </p>
        <DialogFooter>
          <Button>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
