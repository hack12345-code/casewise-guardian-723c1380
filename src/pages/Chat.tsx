
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
  const [messages, setMessages] = useState<Message[]>(() => {
    if (chatId) {
      const savedMessages = localStorage.getItem(`chat-${chatId}`)
      return savedMessages ? JSON.parse(savedMessages) : []
    }
    return []
  })
  const [caseTitle, setCaseTitle] = useState("New Case")

  useEffect(() => {
    if (chatId) {
      fetchCase()
    }
  }, [chatId])

  const fetchCase = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', chatId)
        .single()

      if (error) throw error
      if (data) {
        setCaseTitle(data.title)
      }
    } catch (error) {
      console.error('Error fetching case:', error)
      toast({
        title: "Error loading case",
        description: "There was a problem loading your case. Please try again.",
        variant: "destructive",
      })
      navigate('/dashboard')
    }
  }

  const handleSendMessage = async (input: string) => {
    if (!input.trim() || !chatId) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)

    // Save messages to localStorage
    localStorage.setItem(`chat-${chatId}`, JSON.stringify(updatedMessages))

    // Update last message in Supabase
    try {
      const { error } = await supabase
        .from('cases')
        .update({ last_message: input.slice(0, 100) + (input.length > 100 ? "..." : "") })
        .eq('id', chatId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating case:', error)
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for sharing your case. I'm analyzing the details and will provide professional guidance shortly.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      }
      const withAiResponse = [...updatedMessages, aiResponse]
      setMessages(withAiResponse)
      localStorage.setItem(`chat-${chatId}`, JSON.stringify(withAiResponse))
    }, 1000)
  }

  const handleRename = async (newTitle: string) => {
    if (!chatId) return

    try {
      const { error } = await supabase
        .from('cases')
        .update({ title: newTitle })
        .eq('id', chatId)

      if (error) throw error
      
      setCaseTitle(newTitle)
      toast({
        title: "Case renamed",
        description: "Your case has been renamed successfully.",
      })
    } catch (error) {
      console.error('Error renaming case:', error)
      toast({
        title: "Error renaming case",
        description: "There was a problem renaming your case. Please try again.",
        variant: "destructive",
      })
    }
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
                  prompt={messages.length > 0 ? messages[0].text : ""}
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
