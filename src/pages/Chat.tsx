import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { AIInput } from "@/components/ui/ai-input"
import { Response } from "@/components/Response"
import { supabase } from "@/integrations/supabase/client"
import { Loader2, Paperclip, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: string
  attachments?: Array<{
    fileName: string
    fileUrl: string
    contentType: string
  }>
}

interface ChatFile {
  id: string
  file_name: string
  file_path: string
  content_type: string
}

interface UserProfile {
  is_blocked: boolean
  case_blocked: boolean
}

const Chat = () => {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [caseTitle, setCaseTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [latestUserPrompt, setLatestUserPrompt] = useState("")
  const [isBlocked, setIsBlocked] = useState(false)
  const [isCaseBlocked, setIsCaseBlocked] = useState(false)
  const [chatFiles, setChatFiles] = useState<ChatFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast({
          title: "Session expired",
          description: "Please login again to continue.",
          variant: "destructive",
        })
        navigate('/login')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_blocked, case_blocked')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        return
      }

      if (profile) {
        setIsBlocked(profile.is_blocked || false)
        setIsCaseBlocked(profile.case_blocked || false)
      }
    }
    checkAuth()

    let channel = supabase
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
          setMessages(prev => {
            const messageExists = prev.some(msg => msg.id === newMessage.id)
            if (messageExists) return prev
            return [...prev, {
              id: newMessage.id,
              text: newMessage.content,
              sender: newMessage.role === 'user' ? 'user' : 'ai',
              timestamp: newMessage.created_at
            }]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId, navigate, toast])

  useEffect(() => {
    const initializeChat = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/login')
        return
      }

      setIsLoading(true)

      try {
        const { data: chatData, error: chatError } = await supabase
          .from('medical_chats')
          .select('case_title')
          .eq('id', chatId)
          .eq('user_id', session.user.id)
          .maybeSingle()

        if (chatError) throw chatError

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

        const { data: messagesData, error: messagesError } = await supabase
          .from('medical_messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true })

        if (messagesError) throw messagesError

        if (messagesData) {
          const formattedMessages: Message[] = messagesData.map(msg => ({
            id: msg.id,
            text: msg.content,
            sender: msg.role === 'user' ? 'user' : 'ai',
            timestamp: msg.created_at
          }))
          setMessages(formattedMessages)

          const latestUserMessage = [...messagesData]
            .reverse()
            .find(msg => msg.role === 'user')
          if (latestUserMessage) {
            setLatestUserPrompt(latestUserMessage.content)

            if (messagesData.length === 1) {
              const { data: aiResponse, error } = await supabase.functions.invoke('medical-ai-chat', {
                body: { prompt: latestUserMessage.content }
              })

              if (!error && aiResponse?.response) {
                const { error: messageError } = await supabase
                  .from('medical_messages')
                  .insert({
                    chat_id: chatId,
                    content: aiResponse.response,
                    role: 'assistant',
                    user_id: session.user.id
                  })

                if (messageError) {
                  console.error('Error storing AI response:', messageError)
                }
              }
            }
          }
        }
      } catch (error: any) {
        console.error("Error:", error)
        toast({
          title: "Error loading chat",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (chatId) {
      initializeChat()
    }
  }, [chatId, navigate, toast])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !chatId) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      toast({
        title: "Session expired",
        description: "Please login again to continue.",
        variant: "destructive",
      })
      navigate('/login')
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('chatId', chatId)
      formData.append('userId', session.user.id)

      const { data, error } = await supabase.functions.invoke('upload-chat-file', {
        body: formData,
      })

      if (error) throw error

      const fileMessage: Message = {
        id: crypto.randomUUID(),
        text: `Uploaded file: ${file.name}`,
        sender: 'user',
        timestamp: new Date().toISOString(),
        attachments: [{
          fileName: file.name,
          fileUrl: data.publicUrl,
          contentType: file.type
        }]
      }

      setMessages(prev => [...prev, fileMessage])

      toast({
        title: "File uploaded successfully",
        description: "The file has been added to the chat.",
      })
    } catch (error: any) {
      console.error("Upload error:", error)
      toast({
        title: "Error uploading file",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSendMessage = async (input: string) => {
    if (!input.trim() || !chatId) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      toast({
        title: "Session expired",
        description: "Please login again to continue.",
        variant: "destructive",
      })
      navigate('/login')
      return
    }

    if (isBlocked) {
      toast({
        title: "Account Blocked",
        description: "Your account has been blocked from sending prompts. Please contact support for assistance.",
        variant: "destructive",
      })
      return
    }

    if (isCaseBlocked) {
      toast({
        title: "Case Creation Blocked",
        description: "Your account has been blocked from creating new cases. Please contact support for assistance.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setLatestUserPrompt(input)

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', session.user.id)
        .single()

      if (profile?.subscription_status === 'free') {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { count } = await supabase
          .from('medical_messages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .eq('role', 'user')
          .gte('created_at', last24Hours);

        if (count && count >= 1) {
          const { error: blockError } = await supabase
            .from('profiles')
            .update({ case_blocked: true })
            .eq('id', session.user.id);

          if (blockError) {
            console.error("Error blocking user:", blockError);
          }

          toast({
            title: "Daily Limit Reached",
            description: "Free users can only create one case every 24 hours. Please upgrade to create more cases!",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      const tempUserMessageId = `temp-${Date.now()}`
      const userMessage = {
        id: tempUserMessageId,
        text: input,
        sender: 'user' as const,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, userMessage])

      const { data: messageData, error: messageError } = await supabase
        .from('medical_messages')
        .insert({
          chat_id: chatId,
          content: input,
          role: 'user',
          user_id: session.user.id
        })
        .select()
        .single()

      if (messageError) throw messageError

      const { error: updateError } = await supabase
        .from('medical_chats')
        .update({
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId)
        .eq('user_id', session.user.id)

      if (updateError) throw updateError

      const tempAiMessageId = `temp-ai-${Date.now()}`
      const loadingMessage = {
        id: tempAiMessageId,
        text: "Analyzing your input...",
        sender: 'ai' as const,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, loadingMessage])

      const { data, error } = await supabase.functions.invoke('medical-ai-chat', {
        body: { prompt: input }
      })

      if (error) {
        console.error("Edge function error:", error)
        throw new Error("Failed to get AI response. Please try again.")
      }

      if (!data || !data.response) {
        throw new Error("Invalid response from AI service")
      }

      setMessages(prev => prev.map(msg => 
        msg.id === tempAiMessageId 
          ? { ...msg, text: data.response }
          : msg
      ))

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
        description: error.message || "Failed to process your request",
        variant: "destructive",
      })
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-ai-')))
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
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full max-w-md">
                  <p className="text-sm text-blue-600 animate-pulse text-center">
                    {latestUserPrompt || "Starting chat..."}
                  </p>
                </div>
              </div>
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
        <main className="w-full p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 md:min-w-[800px]">
            <div className="w-full col-span-1 md:col-span-2 md:order-1">
              <Card className="h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)]">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
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
                          className={`max-w-[90%] md:max-w-[80%] p-3 md:p-4 rounded-lg ${
                            message.sender === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {message.text.split('\n').map((paragraph, index) => (
                            <p 
                              key={index} 
                              className={`${
                                index > 0 ? 'mt-4' : ''
                              } text-sm leading-relaxed`}
                            >
                              {paragraph}
                            </p>
                          ))}
                          {message.attachments?.map((attachment, index) => (
                            <div key={index} className="mt-2">
                              <a 
                                href={attachment.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm underline"
                              >
                                <Paperclip className="w-4 h-4" />
                                {attachment.fileName}
                              </a>
                            </div>
                          ))}
                          <span className="text-xs opacity-70 mt-2 block">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 md:p-4 border-t space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isBlocked || isCaseBlocked}
                      >
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach File
                      </Button>
                    </div>
                    <AIInput
                      placeholder={
                        isBlocked 
                          ? "Your account has been blocked from sending prompts" 
                          : isCaseBlocked 
                          ? "Your account has been blocked from creating new cases"
                          : "Enter your case details here..."
                      }
                      minHeight={100}
                      maxHeight={200}
                      onSubmit={handleSendMessage}
                      isLoading={isLoading}
                      disabled={isBlocked || isCaseBlocked}
                    />
                    {isBlocked ? (
                      <p className="text-xs text-red-500 mt-2">
                        Your account has been blocked from sending prompts. Please contact support for assistance.
                      </p>
                    ) : isCaseBlocked ? (
                      <p className="text-xs text-red-500 mt-2">
                        Your account has been blocked from creating new cases. Please contact support for assistance.
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2 italic">
                        * To generate a full report or fix an existing report, type "report:" followed by your appointment summary or existing report
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <div className="w-full col-span-1 md:order-2">
              <Card className="h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] p-4 md:p-6 overflow-y-auto">
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Chat;
