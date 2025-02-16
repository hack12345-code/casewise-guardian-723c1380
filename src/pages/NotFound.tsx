
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-6">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="px-2 text-gray-500 bg-white">404 Error</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Frown className="h-24 w-24 text-gray-400 animate-bounce" />
              <h1 className="text-4xl font-bold text-gray-900">Page Not Found</h1>
              <p className="text-lg text-gray-600 max-w-md">
                Oops! The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                variant="default"
                className="text-white bg-primary hover:bg-primary/90"
              >
                <Link to="/">Return Home</Link>
              </Button>
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
