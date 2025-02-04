import { Navbar } from "@/components/Navbar";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "$9",
      features: ["5 cases per day", "Basic analytics", "24/7 support"],
    },
    {
      name: "Pro",
      price: "$29",
      features: ["Unlimited cases", "Advanced analytics", "Priority support", "Custom templates"],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Everything in Pro", "Custom integration", "Dedicated account manager", "SLA guarantee"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that's right for you</p>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transition-transform duration-300"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h2>
                <p className="text-4xl font-bold text-blue-600">{plan.price}</p>
                <p className="text-gray-500 mt-2">{plan.name === "Enterprise" ? "Contact us" : "per month"}</p>
              </div>
              
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="w-full mt-8 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;