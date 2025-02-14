
import { User, LogIn, Home, FileText, DollarSign, Building2, BarChart3, MessageSquare, Settings, Grid, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setUserName(session.user.email || "");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setUserName(session.user.email || "");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActiveTab("Home");
    else if (path === "/pricing") setActiveTab("Pricing");
    else if (path === "/support") setActiveTab("Support");
    else if (path.includes("cases")) setActiveTab("Cases");
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserName("");
    toast({
      title: "Logged out successfully",
      description: "Come back soon!",
    });
    navigate('/');
  };

  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Cases", url: "#cases-section", icon: FileText },
    { name: "Pricing", url: "/pricing", icon: DollarSign },
    { name: "Support", url: "/support", icon: MessageSquare },
  ].map(item => ({
    ...item,
    active: activeTab === item.name
  }));

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/50 backdrop-blur-lg border-b border-gray-100 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/"
            className="text-2xl md:text-3xl font-bold cursor-pointer bg-gradient-to-r from-[#1877F2] to-[#9b87f5] bg-clip-text text-transparent"
          >
            Saver
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
            <NavBar items={navItems} className="relative !fixed:none !bottom-auto !top-auto !mb-0 !pt-0" />
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={() => navigate('/dashboard')}
                >
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">{userName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <Grid className="w-4 h-4 mr-2" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard/cases')}>
                      <FileText className="w-4 h-4 mr-2" />
                      <span>My Cases</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/dashboard/billing')}>
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogIn className="w-4 h-4 mr-2" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log in</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Sign up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.url}
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                        item.active
                          ? "bg-blue-100 text-blue-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  <div className="border-t my-4" />
                  {isAuthenticated ? (
                    <>
                      <Button
                        variant="ghost"
                        className="flex items-center justify-start gap-2 w-full"
                        onClick={() => navigate('/dashboard')}
                      >
                        <Grid className="w-5 h-5" />
                        <span>Dashboard</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex items-center justify-start gap-2 w-full"
                        onClick={() => navigate('/dashboard/cases')}
                      >
                        <FileText className="w-5 h-5" />
                        <span>My Cases</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex items-center justify-start gap-2 w-full"
                        onClick={() => navigate('/dashboard/settings')}
                      >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex items-center justify-start gap-2 w-full"
                        onClick={() => navigate('/dashboard/billing')}
                      >
                        <DollarSign className="w-5 h-5" />
                        <span>Billing</span>
                      </Button>
                      <Button
                        variant="ghost"
                        className="flex items-center justify-start gap-2 w-full"
                        onClick={handleLogout}
                      >
                        <LogIn className="w-5 h-5" />
                        <span>Log out</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login"
                        className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <LogIn className="w-5 h-5" />
                        <span>Log in</span>
                      </Link>
                      <Link
                        to="/signup"
                        className="flex items-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <User className="w-5 h-5" />
                        <span>Sign up</span>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
