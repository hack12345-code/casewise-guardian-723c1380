
import {
  Settings,
  Home,
  CreditCard,
  HelpCircle,
  FileText,
  LayoutDashboard,
  LogIn,
  UserPlus,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
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
    icon: FileText,
    url: "/dashboard/cases",
  },
]

const settingsItems = [
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsAdmin(session?.user?.email === "savesuppo@gmail.com");
      setUserEmail(session?.user?.email || null);
    };
    
    checkAuthStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setIsAdmin(session?.user?.email === "savesuppo@gmail.com");
      setUserEmail(session?.user?.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const adminItems = [
    {
      title: "Admin Dashboard",
      icon: LayoutDashboard,
      url: "/admin",
    },
  ];

  const authItems = [
    {
      title: "Log In",
      icon: LogIn,
      url: "/login",
    },
    {
      title: "Sign Up",
      icon: UserPlus,
      url: "/signup",
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        {/* User Status Section for Mobile */}
        <div className="md:hidden p-4 border-b">
          {isAuthenticated ? (
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-gray-600">Logged in as:</span>
              <span className="font-medium truncate">{userEmail}</span>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-gray-600">Not logged in</span>
              <div className="flex gap-2">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <LogIn className="w-4 h-4 mr-2" />
                    Log In
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button variant="default" className="w-full">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
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
