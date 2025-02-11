
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    paypal: any;
  }
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (paymentMethod === 'paypal') {
      // Load PayPal SDK
      const script = document.createElement('script');
      script.src = "https://www.paypal.com/sdk/js?client-id=AfODos5CByth04yQ_sWMpPBKnTKLIugSJNwQaxbAETDMqyPsonBHwnn2tvdEOyczw5r_v4vqkSsYBS90&vault=true&intent=subscription";
      script.setAttribute('data-sdk-integration-source', 'button-factory');
      script.async = true;
      script.onload = initializePayPalButton;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [paymentMethod]);

  const initializePayPalButton = () => {
    if (window.paypal) {
      window.paypal.Buttons({
        style: {
          shape: 'pill',
          color: 'gold',
          layout: 'vertical',
          label: 'subscribe'
        },
        createSubscription: function(data: any, actions: any) {
          return actions.subscription.create({
            plan_id: 'P-4M915387D65813437M6VU7FY'
          });
        },
        onApprove: async function(data: any) {
          try {
            setIsLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
              toast({
                title: "Error",
                description: "You must be logged in to subscribe",
                variant: "destructive",
              });
              navigate('/login');
              return;
            }

            // Store subscription in database
            const { error } = await supabase
              .from('paypal_subscriptions')
              .insert({
                user_id: session.user.id,
                subscription_id: data.subscriptionID,
              });

            if (error) throw error;

            toast({
              title: "Success!",
              description: "Your subscription has been activated successfully!",
            });
            
            navigate('/dashboard');
          } catch (error: any) {
            console.error('Subscription error:', error);
            toast({
              title: "Error",
              description: error.message || "Failed to activate subscription",
              variant: "destructive",
            });
          } finally {
            setIsLoading(false);
          }
        },
        onError: function(err: any) {
          console.error('PayPal error:', err);
          toast({
            title: "Error",
            description: "There was an error processing your payment",
            variant: "destructive",
          });
        }
      }).render('#paypal-button-container');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Processing payment",
      description: "Your payment is being processed...",
    });
    // Credit card implementation would go here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
              {plan && (
                <p className="text-xl text-blue-600 mt-2">
                  {plan.name} Plan - {plan.price}/month
                </p>
              )}
            </div>

            <div className="flex gap-4 justify-center mb-8">
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="w-40"
              >
                <Icons.creditCard className="mr-2 h-4 w-4" />
                Credit Card
              </Button>
              <Button
                variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('paypal')}
                className="w-40"
              >
                <Icons.paypal className="mr-2 h-4 w-4" />
                PayPal
              </Button>
            </div>

            {paymentMethod === 'paypal' ? (
              <div className="space-y-4">
                <div id="paypal-button-container" className="min-h-[150px]" />
                {isLoading && (
                  <div className="text-center text-gray-600">
                    Processing your subscription...
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <Input placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <Input placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Pay Now
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
