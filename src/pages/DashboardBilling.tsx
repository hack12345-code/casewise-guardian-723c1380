
import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Icons } from "@/components/ui/icons"

const DashboardBilling = () => {
  const [isEditingPayment, setIsEditingPayment] = useState(false)
  const [hasExistingPayment, setHasExistingPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card')
  const { toast } = useToast()

  const handleUpdatePayment = () => {
    toast({
      title: "Payment method updated",
      description: "Your payment method has been successfully updated.",
    })
    setIsEditingPayment(false)
    setHasExistingPayment(true)
  }

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
                <Card className="p-6 border-2 border-blue-100">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Current Plan</h2>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">Free Plan</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-700">Free Plan</p>
                    <p className="text-sm text-gray-500">Limited features</p>
                    <div className="flex items-center gap-2 mt-4">
                      <Button variant="default">
                        Upgrade to Pro
                      </Button>
                      <p className="text-sm text-gray-500">starting at $29.99/month</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 border-blue-100">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
                    {!isEditingPayment && (
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditingPayment(true)}
                      >
                        {hasExistingPayment ? 'Update Payment' : 'Add Payment Method'}
                      </Button>
                    )}
                  </div>
                  
                  {isEditingPayment ? (
                    <div className="space-y-4">
                      <div className="flex gap-4 justify-start mb-4">
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

                      {paymentMethod === 'card' ? (
                        <div className="space-y-4">
                          <Input placeholder="Card Number" />
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="MM/YY" />
                            <Input placeholder="CVC" />
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          You will be redirected to PayPal to complete your payment setup.
                        </p>
                      )}

                      <div className="flex gap-4 mt-6">
                        <Button onClick={handleUpdatePayment}>
                          Save Payment Method
                        </Button>
                        {hasExistingPayment && (
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditingPayment(false)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {hasExistingPayment ? (
                        <>
                          <div className="flex items-center gap-2">
                            <Icons.creditCard className="h-5 w-5 text-gray-600" />
                            <p className="text-gray-700">•••• •••• •••• 4242</p>
                          </div>
                          <p className="text-sm text-gray-500">Expires 12/25</p>
                        </>
                      ) : (
                        <p className="text-gray-600">No payment method added</p>
                      )}
                    </div>
                  )}
                </Card>

                <Card className="p-6 border-2 border-blue-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Billing History</h2>
                  {hasExistingPayment ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-medium text-gray-700">Feb 1, 2024</p>
                          <p className="text-sm text-gray-500">Pro Plan - Monthly</p>
                        </div>
                        <p className="font-medium text-gray-700">$29.99</p>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-medium text-gray-700">Jan 1, 2024</p>
                          <p className="text-sm text-gray-500">Pro Plan - Monthly</p>
                        </div>
                        <p className="font-medium text-gray-700">$29.99</p>
                      </div>
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
  )
}

export default DashboardBilling
