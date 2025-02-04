import { User, LogIn, Home, FileText, DollarSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { NavBar } from "@/components/ui/tubelight-navbar";

export const Navbar = () => {
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", url: "/", icon: Home },
    { name: "Cases", url: "/cases", icon: FileText },
    { name: "Pricing", url: "/pricing", icon: DollarSign },
  ];

  const handleHomeNavigation = () => {
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/50 backdrop-blur-lg border-b border-gray-100 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Now clickable */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
            onClick={handleHomeNavigation}
          >
            Save
          </Link>

          {/* Tubelight Navigation - Centered */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <NavBar items={navItems} className="relative !fixed:none !bottom-auto !top-auto !mb-0 !pt-0" />
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
              <LogIn className="w-4 h-4" />
              <span>Log in</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              <User className="w-4 h-4" />
              <span>Sign up</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};