
import { Copyright } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const handleNavigationClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm md:text-base">
            <Copyright className="w-4 h-4" />
            <p>Saver 2025. All rights reserved.</p>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-sm md:text-base">
            <Link 
              to="/privacy-policy" 
              onClick={handleNavigationClick}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms-of-service" 
              onClick={handleNavigationClick}
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
