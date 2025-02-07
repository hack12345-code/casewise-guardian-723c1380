
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const DashboardBilling = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)] pt-16">
          <DashboardSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Billing</h1>
              
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
                  <div className="space-y-2">
                    <p className="text-gray-600">Pro Plan</p>
                    <p className="text-sm text-gray-500">Next billing date: March 1, 2024</p>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-2">
                    <p className="text-gray-600">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-500">Expires 12/25</p>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Billing History</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-600">Feb 1, 2024</p>
                        <p className="text-sm text-gray-500">Pro Plan - Monthly</p>
                      </div>
                      <p className="text-gray-600">$29.99</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-600">Jan 1, 2024</p>
                        <p className="text-sm text-gray-500">Pro Plan - Monthly</p>
                      </div>
                      <p className="text-gray-600">$29.99</p>
                    </div>
                  </div>
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
