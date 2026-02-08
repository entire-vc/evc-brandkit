import type { Meta, StoryObj } from '@storybook/react';
import {
  // Common actions
  Search,
  Plus,
  Minus,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  // UI elements
  Menu,
  MoreHorizontal,
  MoreVertical,
  Settings,
  User,
  Users,
  Bell,
  Mail,
  // Files & data
  File,
  FileText,
  Folder,
  Download,
  Upload,
  Trash2,
  Edit,
  Copy,
  // Status
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  // Social & media
  Heart,
  Star,
  Share,
  MessageCircle,
  // Misc
  Home,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Link,
  ExternalLink,
  Loader2,
} from '@entire-vc/ui';
import { Button } from '@entire-vc/ui';

const meta: Meta = {
  title: 'Foundation/Icons',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj;

const IconGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-6 gap-4">{children}</div>
);

const IconBox = ({
  icon: Icon,
  name,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
}) => (
  <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
    <Icon className="h-6 w-6" />
    <span className="text-xs text-muted-foreground">{name}</span>
  </div>
);

export const Overview: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Actions</h3>
        <IconGrid>
          <IconBox icon={Search} name="Search" />
          <IconBox icon={Plus} name="Plus" />
          <IconBox icon={Minus} name="Minus" />
          <IconBox icon={X} name="X" />
          <IconBox icon={Check} name="Check" />
          <IconBox icon={Edit} name="Edit" />
          <IconBox icon={Copy} name="Copy" />
          <IconBox icon={Trash2} name="Trash2" />
          <IconBox icon={Download} name="Download" />
          <IconBox icon={Upload} name="Upload" />
        </IconGrid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Navigation</h3>
        <IconGrid>
          <IconBox icon={ChevronDown} name="ChevronDown" />
          <IconBox icon={ChevronUp} name="ChevronUp" />
          <IconBox icon={ChevronLeft} name="ChevronLeft" />
          <IconBox icon={ChevronRight} name="ChevronRight" />
          <IconBox icon={ArrowRight} name="ArrowRight" />
          <IconBox icon={ArrowLeft} name="ArrowLeft" />
          <IconBox icon={Menu} name="Menu" />
          <IconBox icon={Home} name="Home" />
          <IconBox icon={ExternalLink} name="ExternalLink" />
          <IconBox icon={Link} name="Link" />
        </IconGrid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">UI Elements</h3>
        <IconGrid>
          <IconBox icon={MoreHorizontal} name="MoreHorizontal" />
          <IconBox icon={MoreVertical} name="MoreVertical" />
          <IconBox icon={Settings} name="Settings" />
          <IconBox icon={User} name="User" />
          <IconBox icon={Users} name="Users" />
          <IconBox icon={Bell} name="Bell" />
          <IconBox icon={Mail} name="Mail" />
          <IconBox icon={Calendar} name="Calendar" />
          <IconBox icon={Clock} name="Clock" />
          <IconBox icon={Eye} name="Eye" />
          <IconBox icon={EyeOff} name="EyeOff" />
          <IconBox icon={Lock} name="Lock" />
        </IconGrid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Files</h3>
        <IconGrid>
          <IconBox icon={File} name="File" />
          <IconBox icon={FileText} name="FileText" />
          <IconBox icon={Folder} name="Folder" />
        </IconGrid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Status</h3>
        <IconGrid>
          <IconBox icon={Info} name="Info" />
          <IconBox icon={CheckCircle} name="CheckCircle" />
          <IconBox icon={AlertCircle} name="AlertCircle" />
          <IconBox icon={AlertTriangle} name="AlertTriangle" />
          <IconBox icon={XCircle} name="XCircle" />
        </IconGrid>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Social</h3>
        <IconGrid>
          <IconBox icon={Heart} name="Heart" />
          <IconBox icon={Star} name="Star" />
          <IconBox icon={Share} name="Share" />
          <IconBox icon={MessageCircle} name="MessageCircle" />
        </IconGrid>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      <div className="flex flex-col items-center gap-2">
        <Search className="h-4 w-4" />
        <span className="text-xs text-muted-foreground">16px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Search className="h-5 w-5" />
        <span className="text-xs text-muted-foreground">20px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Search className="h-6 w-6" />
        <span className="text-xs text-muted-foreground">24px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Search className="h-8 w-8" />
        <span className="text-xs text-muted-foreground">32px</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Search className="h-12 w-12" />
        <span className="text-xs text-muted-foreground">48px</span>
      </div>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex gap-6">
      <Heart className="h-8 w-8 text-foreground" />
      <Heart className="h-8 w-8 text-primary" />
      <Heart className="h-8 w-8 text-secondary" />
      <Heart className="h-8 w-8 text-muted-foreground" />
      <Heart className="h-8 w-8 text-destructive" />
      <Heart className="h-8 w-8 text-success" />
      <Heart className="h-8 w-8 text-warning" />
    </div>
  ),
};

export const StrokeWidth: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Star className="h-8 w-8" strokeWidth={1} />
        <span className="text-xs text-muted-foreground">strokeWidth=1</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Star className="h-8 w-8" strokeWidth={1.5} />
        <span className="text-xs text-muted-foreground">strokeWidth=1.5</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Star className="h-8 w-8" strokeWidth={2} />
        <span className="text-xs text-muted-foreground">strokeWidth=2 (default)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Star className="h-8 w-8" strokeWidth={2.5} />
        <span className="text-xs text-muted-foreground">strokeWidth=2.5</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Star className="h-8 w-8" strokeWidth={3} />
        <span className="text-xs text-muted-foreground">strokeWidth=3</span>
      </div>
    </div>
  ),
};

export const WithButtons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
      <Button variant="secondary">
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button variant="outline">
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
      <Button variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
      <Button variant="ghost">
        <Share className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button size="icon" variant="outline">
        <Search className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <Bell className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  ),
};

export const AnimatedSpinner: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
};
