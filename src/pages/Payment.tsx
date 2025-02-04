import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";

const Payment = () => {
  const location = useLocation();
  const plan = location.state?.plan;
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Processing payment",
      description: "Your payment is being processed...",
    });
    // Here you would integrate with your payment processor
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {paymentMethod === 'card' ? (
                <>
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
                </>
              ) : (
                <div className="text-center text-gray-600">
                  You will be redirected to PayPal to complete your purchase.
                </div>
              )}

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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;