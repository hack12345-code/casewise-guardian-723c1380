import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { AIInput } from "@/components/ui/ai-input"
import { Response } from "@/components/Response"
import { supabase } from "@/integrations/supabase/client"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: string
}

const Chat = () => {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [caseTitle, setCaseTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [latestUserPrompt, setLatestUserPrompt] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }
    }
    checkAuth()

    // Subscribe to chat messages
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'medical_messages',
          filter: `chat_id=eq.${chatId}`
        },
        (payload) => {
          const newMessage = payload.new
          setMessages(prev => [...prev, {
            id: newMessage.id,
            text: newMessage.content,
            sender: newMessage.role === 'user' ? 'user' : 'ai',
            timestamp: newMessage.created_at
          }])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId, navigate])

  useEffect(() => {
    const initializeChat = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }

      setIsLoading(true)

      // Load existing chat
      const { data: chatData, error: chatError } = await supabase
        .from('medical_chats')
        .select('case_title')
        .eq('id', chatId)
        .eq('user_id', session.user.id)  // Make sure user owns this chat
        .maybeSingle()

      if (chatError) {
        console.error("Error fetching chat:", chatError)
        toast({
          title: "Error loading chat",
          description: chatError.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (!chatData) {
        toast({
          title: "Chat not found",
          description: "The requested chat could not be found.",
          variant: "destructive",
        })
        navigate('/dashboard')
        return
      }

      setCaseTitle(chatData.case_title)

      // Get chat messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('medical_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (messagesError) {
        console.error("Error fetching messages:", messagesError)
        toast({
          title: "Error loading messages",
          description: messagesError.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (messagesData) {
        const formattedMessages: Message[] = messagesData.map(msg => ({
          id: msg.id,
          text: msg.content,
          sender: msg.role === 'user' ? 'user' : 'ai',
          timestamp: msg.created_at
        }))
        setMessages(formattedMessages)
        
        // Find the latest user message for the prompt
        const latestUserMessage = [...messagesData]
          .reverse()
          .find(msg => msg.role === 'user')
        if (latestUserMessage) {
          setLatestUserPrompt(latestUserMessage.content)
        }
      }
      
      setIsLoading(false)
    }

    if (chatId) {
      initializeChat()
    }
  }, [chatId, navigate, toast])

  const handleSendMessage = async (input: string) => {
    if (!input.trim() || !chatId) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
      return
    }

    setIsLoading(true)
    try {
      // Save user message
      const { error: messageError } = await supabase
        .from('medical_messages')
        .insert({
          chat_id: chatId,
          content: input,
          role: 'user',
          user_id: session.user.id
        })

      if (messageError) throw messageError

      // Update chat timestamp
      const { error: updateError } = await supabase
        .from('medical_chats')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId)
        .eq('user_id', session.user.id)

      if (updateError) throw updateError

      // Get AI response
      const { data, error } = await supabase.functions.invoke('medical-ai-chat', {
        body: { prompt: input }
      })

      if (error) throw error

      // Save AI response
      const { error: aiError } = await supabase
        .from('medical_messages')
        .insert({
          chat_id: chatId,
          content: data.response,
          role: 'assistant',
          user_id: session.user.id
        })

      if (aiError) throw aiError

    } catch (error: any) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRename = async (newTitle: string) => {
    if (!chatId) return

    const { error } = await supabase
      .from('medical_chats')
      .update({ case_title: newTitle })
      .eq('id', chatId)

    if (error) {
      toast({
        title: "Error renaming case",
        description: error.message,
        variant: "destructive",
      })
      return
    }

    setCaseTitle(newTitle)
    toast({
      title: "Case renamed successfully",
      description: "The case title has been updated.",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)] pt-16">
          <main className="flex-1 p-8">
            <div className="flex items-center justify-center h-full">
              Loading chat history...
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] pt-16">
        <main className="flex-1 p-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-1">
              <Card className="h-[calc(100vh-16rem)] p-6 overflow-y-auto">
                <Response
                  response={
                    messages.length > 0
                      ? messages[messages.length - 1].text
                      : ""
                  }
                  prompt={latestUserPrompt}
                  caseTitle={caseTitle}
                  onRename={handleRename}
                />
              </Card>
            </div>

            <div className="col-span-2">
              <Card className="h-[calc(100vh-16rem)]">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-lg ${
                            message.sender === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <span className="text-xs opacity-70 mt-2 block">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t">
                    <AIInput
                      placeholder="Enter your case details here..."
                      minHeight={100}
                      maxHeight={200}
                      onSubmit={handleSendMessage}
                      isLoading={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-2 italic">
                      * To generate a full report or fix an existing report, type "report:" followed by your appointment summary or existing report
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Chat
