
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Navbar } from "@/components/Navbar"
import { MessageSquare, Plus, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { supabase } from "@/integrations/supabase/client"

interface Chat {
  id: string
  case_title: string
  last_message?: string
  created_at: string
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }
    }
    checkAuth()
  }, [navigate])

  useEffect(() => {
    const loadChats = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: chatsData, error } = await supabase
        .from('medical_chats')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Error loading chats:", error)
        toast({
          title: "Error loading chats",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      if (chatsData) {
        setChats(chatsData)
      }
      setIsLoading(false)
    }

    loadChats()
  }, [toast])

  const handleNewChat = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
      return
    }

    const { data: newChat, error } = await supabase
      .from('medical_chats')
      .insert({
        case_title: 'New Case',
        user_id: session.user.id
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating new chat:", error)
      toast({
        title: "Error creating new chat",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    if (newChat) {
      navigate(`/chat/${newChat.id}`)
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    const { error } = await supabase
      .from('medical_chats')
      .delete()
      .eq('id', chatId)

    if (error) {
      console.error("Error deleting chat:", error)
      toast({
        title: "Error deleting chat",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    setChats(chats.filter((chat) => chat.id !== chatId))
    toast({
      title: "Chat deleted",
      description: "The chat has been removed from your history.",
    })
  }

  const handleOpenChat = (chatId: string) => {
    navigate(`/chat/${chatId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)] pt-16">
          <main className="flex-1 p-8">
            <div className="flex items-center justify-center h-full">
              Loading chats...
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)] pt-16">
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
                        {chat.case_title}
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
                    {chat.last_message || "No messages yet"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(chat.created_at).toLocaleDateString()}
                    </span>
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
