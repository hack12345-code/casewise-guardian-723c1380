
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
  }, [navigate])

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!chatId) return
      console.log("Loading chat history for chatId:", chatId)

      // Get chat details
      const { data: chatData, error: chatError } = await supabase
        .from('medical_chats')
        .select('case_title')
        .eq('id', chatId)
        .single()

      if (chatError) {
        console.error("Error fetching chat:", chatError)
        return
      }

      console.log("Chat data:", chatData)
      if (chatData) {
        setCaseTitle(chatData.case_title)

        // Get chat messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('medical_messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true })

        if (messagesError) {
          console.error("Error fetching messages:", messagesError)
          return
        }

        console.log("Messages data:", messagesData)
        if (messagesData) {
          const formattedMessages: Message[] = messagesData.map(msg => ({
            id: msg.id,
            text: msg.content,
            sender: msg.role === 'user' ? 'user' : 'ai',
            timestamp: msg.created_at
          }))
          console.log("Formatted messages:", formattedMessages)
          setMessages(formattedMessages)
          
          // Find the latest user message for the prompt
          const latestUserMessage = [...messagesData]
            .reverse()
            .find(msg => msg.role === 'user')
          if (latestUserMessage) {
            setLatestUserPrompt(latestUserMessage.content)
          }
        }
      }
      setIsLoading(false)
    }

    loadChatHistory()
  }, [chatId])

  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
      return
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, newMessage])
    setLatestUserPrompt(input) // Update the latest user prompt

    // Save message to database
    if (chatId) {
      const { error: messageError } = await supabase
        .from('medical_messages')
        .insert({
          chat_id: chatId,
          content: input,
          role: 'user',
          user_id: session.user.id
        })

      if (messageError) {
        console.error("Error saving message:", messageError)
        return
      }

      // Update chat timestamp
      const { error: updateError } = await supabase
        .from('medical_chats')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId)

      if (updateError) {
        console.error("Error updating chat timestamp:", updateError)
      }
    }

    // Simulate AI response
    setTimeout(async () => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for sharing your case. I'm analyzing the details and will provide professional guidance shortly.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, aiResponse])

      if (chatId && session) {
        const { error } = await supabase
          .from('medical_messages')
          .insert({
            chat_id: chatId,
            content: aiResponse.text,
            role: 'assistant',
            user_id: session.user.id
          })

        if (error) {
          console.error("Error saving AI response:", error)
        }
      }
    }, 1000)
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
            {/* Response Section (1/3) */}
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

            {/* Chat Messages Section (2/3) */}
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
                    />
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
