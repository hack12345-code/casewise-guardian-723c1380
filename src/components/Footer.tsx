
import { Copyright } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const links = {
    company: ["Home", "Cases", "Support", "Pricing", "Blog"],
    legal: []
  };

  const handleCasesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const casesSection = document.querySelector('#cases-section');
    if (casesSection) {
      casesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <Link to="/" className="text-2xl font-bold text-white mb-4 block">Saver</Link>
            <p className="text-gray-400 mt-4">Empowering healthcare professionals with AI-driven insights and risk management.</p>
          </div>
          {Object.entries(links).map(([category, items]) => (
            items.length > 0 && (
              <div key={category}>
                <h3 className="text-white font-semibold uppercase mb-4">{category}</h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item}>
                      <Link 
                        to={
                          item === "Home" ? "/" :
                          item === "Cases" ? "#cases-section" :
                          item === "Support" ? "/support" :
                          item === "Pricing" ? "/pricing" :
                          item.toLowerCase() === "blog" ? "/blog" : "#"
                        } 
                        onClick={item === "Cases" ? handleCasesClick : undefined}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Copyright className="w-4 h-4" />
            <p>Saver 2025. All rights reserved.</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
