
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
  title: string
  last_message: string | null
  created_at: string
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setChats(data || [])
    } catch (error) {
      console.error('Error fetching chats:', error)
      toast({
        title: "Error loading cases",
        description: "There was a problem loading your cases. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = async () => {
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) throw userError
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a new case.",
          variant: "destructive",
        })
        return
      }

      const newChat = {
        title: "New Case",
        last_message: "Start discussing your case...",
        user_id: user.id, // Add the user_id here
      }

      const { data, error } = await supabase
        .from('cases')
        .insert(newChat)
        .select()
        .single()

      if (error) throw error

      if (data) {
        setChats([data, ...chats])
        navigate(`/chat/${data.id}`)
        toast({
          title: "Starting new case",
          description: "Creating a new case for you...",
        })
      }
    } catch (error) {
      console.error('Error creating new chat:', error)
      toast({
        title: "Error creating case",
        description: "There was a problem creating your case. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', chatId)

      if (error) throw error

      setChats(chats.filter((chat) => chat.id !== chatId))
      toast({
        title: "Chat deleted",
        description: "The chat has been removed from your history.",
      })
    } catch (error) {
      console.error('Error deleting chat:', error)
      toast({
        title: "Error deleting case",
        description: "There was a problem deleting your case. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleOpenChat = (chatId: string) => {
    navigate(`/chat/${chatId}`)
    toast({
      title: "Opening case",
      description: "Loading your case...",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex h-[calc(100vh-4rem)]">
          <DashboardSidebar />
          <main className="flex-1 p-8">
            <div className="text-center">Loading your cases...</div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SidebarProvider>
        <div className="flex h-[calc(100vh-4rem)]">
          <DashboardSidebar />
          <main className="flex-1 p-8 overflow-y-auto">
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
                    {chat.last_message}
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
