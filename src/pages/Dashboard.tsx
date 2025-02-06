import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/Navbar"
import { MessageSquare, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface Chat {
  id: string
  title: string
  lastMessage: string
  date: string
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "Cardiac Case Discussion",
      lastMessage: "Patient presents with chest pain...",
      date: "2024-02-20",
    },
    {
      id: "2",
      title: "Orthopedic Consultation",
      lastMessage: "Post-operative care for knee replacement...",
      date: "2024-02-19",
    },
  ])

  const handleNewChat = () => {
    navigate("/")
    toast({
      title: "Starting new chat",
      description: "Redirecting to chat interface...",
    })
  }

  const handleDeleteChat = (chatId: string) => {
    setChats(chats.filter((chat) => chat.id !== chatId))
    toast({
      title: "Chat deleted",
      description: "The chat has been removed from your history.",
    })
  }

  const handleOpenChat = (chatId: string) => {
    navigate("/")
    toast({
      title: "Opening chat",
      description: "Loading your conversation...",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)]">
          <DashboardSidebar />
          <main className="flex-1 p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Cases</h1>
              <Button
                onClick={handleNewChat}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
              >
                <Plus className="mr-2 h-5 w-5" />
                New Case
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {chats.map((chat) => (
                <Card
                  key={chat.id}
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-semibold text-lg text-gray-900">
                        {chat.title}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteChat(chat.id)
                      }}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {chat.lastMessage}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{chat.date}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenChat(chat.id)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      Open Chat
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </main>
          <SidebarTrigger className="fixed bottom-4 right-4 md:hidden" />
        </div>
      </SidebarProvider>
    </div>
  )
}

export default Dashboard