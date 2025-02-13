
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/ui/icons"
import { supabase } from "@/integrations/supabase/client"
import { format, addMonths, addYears } from "date-fns"

const DashboardBilling = () => {
  const navigate = useNavigate();
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'free' | 'pro' | 'enterprise'>('free');
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [subscriptionStartDate, setSubscriptionStartDate] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_status, subscription_period, subscription_start_date')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setSubscriptionStatus(profile.subscription_status || 'free');
          setSubscriptionPeriod(profile.subscription_period || 'monthly');
          setSubscriptionStartDate(profile.subscription_start_date ? new Date(profile.subscription_start_date) : null);
        }
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const getNextBillingDate = () => {
    if (!subscriptionStartDate) return null;
    return subscriptionPeriod === 'monthly' 
      ? addMonths(subscriptionStartDate, 1)
      : addYears(subscriptionStartDate, 1);
  };

  const getBillingHistory = () => {
    if (!subscriptionStartDate) return [];
    
    const history = [];
    const currentDate = new Date();
    let date = new Date(subscriptionStartDate);
    
    while (date <= currentDate) {
      history.push({
        date: new Date(date),
        amount: subscriptionPeriod === 'yearly' ? 299.99 : 29.99
      });
      
      date = subscriptionPeriod === 'monthly' 
        ? addMonths(date, 1)
        : addYears(date, 1);
    }
    
    return history.reverse();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)] pt-16">
          <DashboardSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Billing</h1>
              
              <div className="space-y-6">
                <Card className="p-6 border-2 border-blue-100 hover:border-blue-200 transition-all duration-300">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Current Plan</h2>
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                      {subscriptionStatus === 'pro' ? 'Pro Plan' : subscriptionStatus === 'enterprise' ? 'Enterprise Plan' : 'Free Plan'}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          {subscriptionStatus === 'pro' ? 'Pro Plan' : subscriptionStatus === 'enterprise' ? 'Enterprise Plan' : 'Free Plan'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {subscriptionStatus === 'free' ? 'Limited features and functionality' : 'Full access to all features'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        {subscriptionStatus === 'free' && (
                          <Button 
                            variant="default"
                            onClick={() => navigate('/payment')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                          >
                            Upgrade to Pro
                          </Button>
                        )}
                        <p className="text-sm text-gray-500">
                          <span className="font-medium text-blue-600">
                            ${subscriptionPeriod === 'yearly' ? '299.99' : '29.99'}
                          </span>
                          /{subscriptionPeriod === 'yearly' ? 'year' : 'month'}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 border-blue-100">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icons.paypal className="h-5 w-5 text-gray-600" />
                      <p className="text-gray-700">PayPal</p>
                    </div>
                    {subscriptionStartDate && (
                      <p className="text-sm text-gray-500">
                        Next billing on {format(getNextBillingDate() || new Date(), 'MMMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </Card>

                <Card className="p-6 border-2 border-blue-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Billing History</h2>
                  {subscriptionStatus !== 'free' ? (
                    <div className="space-y-4">
                      {getBillingHistory().map((bill, index) => (
                        <div key={index} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div>
                            <p className="font-medium text-gray-700">{format(bill.date, 'MMM d, yyyy')}</p>
                            <p className="text-sm text-gray-500">Pro Plan - {subscriptionPeriod === 'yearly' ? 'Yearly' : 'Monthly'}</p>
                          </div>
                          <p className="font-medium text-gray-700">${bill.amount}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No billing history available</p>
                  )}
                </Card>
              </div>
            </div>
          </main>
          <SidebarTrigger className="fixed bottom-4 right-4 md:hidden" />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardBilling;
