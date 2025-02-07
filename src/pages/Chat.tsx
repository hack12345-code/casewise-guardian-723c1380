
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { DashboardSidebar } from "@/components/DashboardSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: string
}

const Chat = () => {
  const { chatId } = useParams()
  const { toast } = useToast()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>(() => {
    // Initialize with existing messages if this is an existing chat
    if (chatId) {
      const savedMessages = localStorage.getItem(`chat-${chatId}`)
      return savedMessages ? JSON.parse(savedMessages) : []
    }
    return []
  })

  const handleSendMessage = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    setInput("")

    // Save messages to localStorage
    if (chatId) {
      localStorage.setItem(`chat-${chatId}`, JSON.stringify(updatedMessages))
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
      if (chatId) {
        localStorage.setItem(`chat-${chatId}`, JSON.stringify(withAiResponse))
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-4rem)] pt-16">
          <DashboardSidebar />
          <main className="flex-1 p-8">
            <Card className="max-w-4xl mx-auto">
              <div className="h-[calc(100vh-16rem)] flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
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
                  <div className="flex gap-2">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Enter your case details here..."
                      className="resize-none"
                      rows={3}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="self-end"
                      size="icon"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </main>
          <SidebarTrigger className="fixed bottom-4 right-4 md:hidden" />
        </div>
      </SidebarProvider>
    </div>
  )
}

export default Chat
