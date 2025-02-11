
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tab } from "@/components/ui/pricing-tab";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selected, setSelected] = useState("monthly");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getPrice = (basePrice: string | number, billingCycle: string) => {
    if (typeof basePrice === "string") return basePrice;
    return billingCycle === "yearly" ? `$25` : `$${basePrice}`;
  };

  const plans = [
    {
      name: "Pro",
      price: 29,
      features: [
        "Everything in Free",
        "Unlimited cases",
        "Unlimited chat prompts",
        "Priority support",
        "1 monthly class to master the platform"
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Everything in Pro",
        "Custom integration",
        "Dedicated account manager",
        "Dashboard to manage all enterprise users",
        "Monthly reports"
      ],
    },
  ];

  const handleGetStarted = (plan: typeof plans[0]) => {
    if (plan.name === "Enterprise") {
      navigate('/contact-sales');
      return;
    }
    
    if (isAuthenticated) {
      // If user is already logged in, redirect directly to payment
      navigate('/payment', { state: { plan, billingCycle: selected } });
    } else {
      // If not logged in, show toast and redirect to signup
      toast({
        title: "Authentication required",
        description: "Please sign up to continue with the Pro plan",
      });
      navigate('/signup');
    }
  };

  const FREQUENCIES = ["monthly", "yearly"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that's right for you</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex w-fit rounded-full bg-muted p-1">
            {FREQUENCIES.map((frequency) => (
              <Tab
                key={frequency}
                text={frequency}
                selected={selected === frequency}
                setSelected={setSelected}
                discount={frequency === "yearly"}
              />
            ))}
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h2>
                <p className="text-4xl font-bold text-blue-600">
                  {getPrice(plan.price, selected)}
                </p>
                <p className="text-gray-500 mt-2">
                  {plan.name === "Enterprise" ? "Contact us" : `per ${selected === "yearly" ? "month, billed yearly" : "month"}`}
                </p>
              </div>
              
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button 
                className="w-full mt-8 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => handleGetStarted(plan)}
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
