import type { Meta, StoryObj } from '@storybook/react';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  Button,
  Home,
  Settings,
  User,
  FileText,
  Folder,
  FolderOpen,
  File,
  ChevronDown,
  ChevronRight,
  Search,
  Bell,
  Plus,
  Inbox,
  Calendar,
  HelpCircle,
  LogOut,
} from '@entire-vc/ui';
import * as React from 'react';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic sidebar with simple navigation
export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              E
            </div>
            <span className="font-semibold">Entire VC</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Inbox className="h-4 w-4" />
                    <span>Inbox</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Calendar className="h-4 w-4" />
                    <span>Calendar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4">
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            Main content area. Click the trigger to toggle the sidebar.
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
};

// File tree navigation example
function FileTreeSidebar() {
  const [openFolders, setOpenFolders] = React.useState<Record<string, boolean>>({
    src: true,
    components: false,
  });

  const toggleFolder = (name: string) => {
    setOpenFolders((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <FileText className="h-5 w-5" />
            <span className="font-semibold">Project Explorer</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Files</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* src folder */}
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => toggleFolder('src')}>
                    {openFolders.src ? (
                      <FolderOpen className="h-4 w-4" />
                    ) : (
                      <Folder className="h-4 w-4" />
                    )}
                    <span>src</span>
                    {openFolders.src ? (
                      <ChevronDown className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                  {openFolders.src && (
                    <SidebarMenuSub>
                      {/* components subfolder */}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleFolder('components');
                          }}
                        >
                          {openFolders.components ? (
                            <FolderOpen className="h-4 w-4" />
                          ) : (
                            <Folder className="h-4 w-4" />
                          )}
                          <span>components</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      {openFolders.components && (
                        <>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="#" className="pl-6">
                              <File className="h-4 w-4" />
                              <span>Button.tsx</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="#" className="pl-6">
                              <File className="h-4 w-4" />
                              <span>Card.tsx</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="#" isActive className="pl-6">
                              <File className="h-4 w-4" />
                              <span>Sidebar.tsx</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </>
                      )}
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#">
                          <File className="h-4 w-4" />
                          <span>index.ts</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#">
                          <File className="h-4 w-4" />
                          <span>App.tsx</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
                {/* Root files */}
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <File className="h-4 w-4" />
                    <span>package.json</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <File className="h-4 w-4" />
                    <span>tsconfig.json</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <File className="h-4 w-4" />
                    <span>README.md</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Sidebar.tsx</h1>
        </header>
        <main className="flex-1 p-4">
          <div className="rounded-lg border p-4 font-mono text-sm">
            <pre className="text-muted-foreground">
{`// Sidebar component
export function Sidebar() {
  return (
    <aside className="sidebar">
      {/* ... */}
    </aside>
  );
}`}
            </pre>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const FileTree: Story = {
  render: () => <FileTreeSidebar />,
};

// Collapsible groups example
function CollapsibleGroupsSidebar() {
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    platform: true,
    projects: false,
    settings: false,
  });

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              P
            </div>
            <span className="font-semibold">Platform</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {/* Platform group */}
          <SidebarGroup>
            <SidebarGroupLabel
              className="cursor-pointer"
              onClick={() => toggleGroup('platform')}
            >
              {openGroups.platform ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              Platform
            </SidebarGroupLabel>
            {openGroups.platform && (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Inbox className="h-4 w-4" />
                      <span>Notifications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>

          <SidebarSeparator />

          {/* Projects group */}
          <SidebarGroup>
            <SidebarGroupLabel
              className="cursor-pointer"
              onClick={() => toggleGroup('projects')}
            >
              {openGroups.projects ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              Projects
            </SidebarGroupLabel>
            {openGroups.projects && (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Folder className="h-4 w-4" />
                      <span>Project Alpha</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Folder className="h-4 w-4" />
                      <span>Project Beta</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Plus className="h-4 w-4" />
                      <span>New Project</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>

          <SidebarSeparator />

          {/* Settings group */}
          <SidebarGroup>
            <SidebarGroupLabel
              className="cursor-pointer"
              onClick={() => toggleGroup('settings')}
            >
              {openGroups.settings ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              Settings
            </SidebarGroupLabel>
            {openGroups.settings && (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings className="h-4 w-4" />
                      <span>General</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <User className="h-4 w-4" />
                      <span>Account</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Home</h1>
        </header>
        <main className="flex-1 p-4">
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            Click on group labels to expand/collapse sections
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const CollapsibleGroups: Story = {
  render: () => <CollapsibleGroupsSidebar />,
};

// Floating variant
export const FloatingVariant: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar variant="floating">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              F
            </div>
            <span className="font-semibold">Floating</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Floating Sidebar</h1>
        </header>
        <main className="flex-1 p-4">
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            This sidebar uses the "floating" variant with rounded corners and shadow
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
};

// Icon collapsed mode
export const IconCollapsible: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              I
            </div>
            <span className="font-semibold">Icon Mode</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Dashboard">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Inbox">
                    <Inbox className="h-4 w-4" />
                    <span>Inbox</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Calendar">
                    <Calendar className="h-4 w-4" />
                    <span>Calendar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Icon Collapsible Mode</h1>
        </header>
        <main className="flex-1 p-4">
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            This sidebar collapses to icons only. Hover over icons to see tooltips.
            <br />
            Use Cmd+B (Mac) or Ctrl+B (Windows) to toggle.
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
};

// Right side
export const RightSide: Story = {
  render: () => (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-4">
          <h1 className="text-lg font-semibold">Right-side Sidebar</h1>
          <SidebarTrigger className="ml-auto" />
        </header>
        <main className="flex-1 p-4">
          <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
            The sidebar is on the right side of the screen
          </div>
        </main>
      </SidebarInset>
      <Sidebar side="right">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              R
            </div>
            <span className="font-semibold">Right Side</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Details</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <FileText className="h-4 w-4" />
                    <span>Properties</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Bell className="h-4 w-4" />
                    <span>Activity</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  ),
};
