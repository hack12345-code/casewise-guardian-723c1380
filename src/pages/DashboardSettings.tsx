
import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const DashboardSettings = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [email] = useState("user@example.com")
  const [notifications, setNotifications] = useState(true)
  const { toast } = useToast()

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    })
  }

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)] pt-16">
          <DashboardSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Settings
              </h1>
              
              <div className="space-y-6">
                <Card className="p-6 border-2 border-blue-100 dark:border-blue-900">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Account Settings
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={email}
                        readOnly
                        className="max-w-md bg-gray-50 cursor-not-allowed"
                      />
                      <p className="mt-1 text-sm text-gray-500">Contact support to change your email address</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 border-blue-100 dark:border-blue-900">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Appearance
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">Dark Mode</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Toggle dark mode on or off
                      </p>
                    </div>
                    <Switch
                      checked={darkMode}
                      onCheckedChange={handleDarkModeToggle}
                    />
                  </div>
                </Card>

                <Card className="p-6 border-2 border-blue-100 dark:border-blue-900">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Notifications
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        Email Notifications
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive email updates about your account
                      </p>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveSettings}
                    className="px-6"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </main>
          <SidebarTrigger className="fixed bottom-4 right-4 md:hidden" />
        </div>
      </SidebarProvider>
    </div>
  )
}

export default DashboardSettings