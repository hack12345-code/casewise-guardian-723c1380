
import { Copyright } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const links = {
    company: ["Home", "Cases", "Blog"],
    resources: [],
    legal: []
  };

  const handleCasesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const casesSection = document.querySelector('#cases-section');
    if (casesSection) {
      casesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigationClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link 
              to="/" 
              className="text-xl md:text-2xl font-bold text-white block"
            >
              Saver
            </Link>
            <p className="text-sm md:text-base text-gray-400">
              Empowering Healthcare Professionals with AI-Driven Data<br className="hidden md:block" />
              Against Malpractice & Seamless Report Writing.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <div>
              <h3 className="text-white font-semibold uppercase mb-4 text-sm md:text-base">
                Company
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {links.company.map((item) => (
                  <li key={item}>
                    <Link 
                      to={
                        item === "Home" ? "/" :
                        item === "Cases" ? "#cases-section" :
                        item === "Blog" ? "/blog" : "#"
                      } 
                      onClick={(e) => {
                        if (item === "Cases") {
                          handleCasesClick(e);
                        } else {
                          handleNavigationClick();
                        }
                      }}
                      className="text-sm md:text-base text-gray-400 hover:text-white transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
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
