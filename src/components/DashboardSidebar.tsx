import {
  Settings,
  Home,
  CreditCard,
  History,
  MessageSquare,
  User,
  HelpCircle,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Overview",
    icon: Home,
    url: "/dashboard",
  },
  {
    title: "My Cases",
    icon: MessageSquare,
    url: "/dashboard/cases",
  },
  {
    title: "History",
    icon: History,
    url: "/dashboard/history",
  },
]

const settingsItems = [
  {
    title: "Profile",
    icon: User,
    url: "/dashboard/profile",
  },
  {
    title: "Billing",
    icon: CreditCard,
    url: "/dashboard/billing",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/dashboard/settings",
  },
  {
    title: "Help & Support",
    icon: HelpCircle,
    url: "/support",
  },
]

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}