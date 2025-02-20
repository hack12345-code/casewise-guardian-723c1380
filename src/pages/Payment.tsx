
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";

declare global {
  interface Window {
    paypal: any;
  }
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;
  const billingCycle = location.state?.billingCycle;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=AfODos5CByth04yQ_sWMpPBKnTKLIugSJNwQaxbAETDMqyPsonBHwnn2tvdEOyczw5r_v4vqkSsYBS90&vault=true&intent=subscription";
    script.setAttribute('data-sdk-integration-source', 'button-factory');
    script.async = true;
    script.onload = initializePayPalButton;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializePayPalButton = () => {
    if (window.paypal) {
      const planId = billingCycle === 'yearly' 
        ? 'P-8EW82746KH3443422M6VVLQY'  // Yearly plan ID
        : 'P-4M915387D65813437M6VU7FY';  // Monthly plan ID

      window.paypal.Buttons({
        style: {
          shape: 'pill',
          color: 'gold',
          layout: 'vertical',
          label: 'subscribe'
        },
        createSubscription: function(data: any, actions: any) {
          return actions.subscription.create({
            plan_id: planId
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
            const { error: subscriptionError } = await supabase
              .from('paypal_subscriptions')
              .insert({
                user_id: session.user.id,
                subscription_id: data.subscriptionID,
              });

            if (subscriptionError) throw subscriptionError;

            // Update user's subscription status
            const { error: profileError } = await supabase
              .from('profiles')
              .update({ subscription_status: 'pro' })
              .eq('id', session.user.id);

            if (profileError) throw profileError;

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Navbar />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)] w-full pt-16">
          <DashboardSidebar />
          <main className="flex-1 p-4 md:p-8 relative z-0">
            <div className="max-w-3xl mx-auto">
              <Card className="p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
                  {plan && (
                    <p className="text-xl text-blue-600 mt-2">
                      {plan.name} Plan - {billingCycle === 'yearly' ? '$25/month (billed yearly)' : '$29.99/month'}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div id="paypal-button-container" className="min-h-[150px] relative z-0" />
                  {isLoading && (
                    <div className="text-center text-gray-600">
                      Processing your subscription...
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </main>
          <SidebarTrigger className="fixed bottom-4 right-4 md:hidden z-50" />
        </div>
      </SidebarProvider>
      <Footer />
    </div>
  );
};

export default Payment;
