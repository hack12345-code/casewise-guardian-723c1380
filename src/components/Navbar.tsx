
import { User, LogIn, Home, FileText, DollarSign, LogOut, MessageSquare, Settings, Grid } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    const storedUserName = localStorage.getItem("userName");
    setIsAuthenticated(authStatus === "true");
    setUserName(storedUserName || "");
  }, []);

  const handleCasesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const casesSection = document.querySelector('#cases-section');
    if (casesSection) {
      casesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { 
      name: "Cases", 
      url: "#cases-section", 
      icon: FileText,
      onClick: handleCasesClick 
    },
    { name: "Pricing", url: "/pricing", icon: DollarSign },
    { name: "Support", url: "/support", icon: MessageSquare },
  ].map(item => ({
    ...item,
    active: location.pathname === item.url || 
            (item.url === "#cases-section" && location.pathname === "/") ||
            (item.url === "/" && location.pathname === "") ||
            (location.pathname === item.url.toLowerCase())
  }));

  const handleHomeNavigation = () => {
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setUserName("");
    toast({
      title: "Logged out successfully",
      description: "Come back soon!",
    });
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/50 backdrop-blur-lg border-b border-gray-100 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="text-3xl font-bold cursor-pointer bg-gradient-to-r from-[#1877F2] to-[#9b87f5] bg-clip-text text-transparent"
            onClick={handleHomeNavigation}
          >
            Saver
          </Link>

          <div className="absolute left-1/2 -translate-x-1/2">
            <NavBar items={navItems} className="relative !fixed:none !bottom-auto !top-auto !mb-0 !pt-0" />
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={() => navigate('/dashboard')}
                >
                  <Grid className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{userName}</span>
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
                      <LogOut className="w-4 h-4 mr-2" />
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
        </div>
      </div>
    </nav>
  );
};
