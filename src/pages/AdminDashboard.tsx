import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Users, DollarSign, Building2, BarChart3, MessageSquare, CircleDot, CirclePlay, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AIInput } from "@/components/ui/ai-input";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface User {
  id: string;
  name: string;
  email: string;
  subscription: string;
  country: string;
  sector: string;
  lastActive: string;
  isBlocked?: boolean;
  caseBlocked?: boolean;
  promptsLastDay: number;
  totalCases: number;
}

interface EnterpriseLead {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  status: string;
}

interface SupportMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  status: "unread" | "ongoing" | "resolved";
  messages: Array<{
    id: string;
    text: string;
    sender: "user" | "admin";
    timestamp: string;
  }>;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  read_time: string;
  created_at: string | null;
  updated_at: string | null;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [enterpriseLeads, setEnterpriseLeads] = useState<EnterpriseLead[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>(() => {
    const savedMessages = localStorage.getItem("support-messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<SupportMessage | null>(null);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isNewBlogPostDialogOpen, setIsNewBlogPostDialogOpen] = useState(false);
  const [newBlogPost, setNewBlogPost] = useState({
    title: "",
    excerpt: "",
    content: "",
    readTime: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        
        const userPrompts = await Promise.all(
          data.map(async (user) => {
            const { count: promptCount } = await supabase
              .from('medical_messages')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .eq('role', 'user')
              .gte('created_at', last24Hours);

            const { count: casesCount } = await supabase
              .from('medical_chats')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id);

            return {
              id: user.id,
              name: user.full_name || 'N/A',
              email: user.email,
              subscription: user.subscription_status || 'Free',
              country: user.country || 'N/A',
              sector: user.medical_sector || 'N/A',
              lastActive: new Date(user.updated_at).toLocaleDateString(),
              isBlocked: user.is_blocked,
              caseBlocked: user.case_blocked,
              promptsLastDay: promptCount || 0,
              totalCases: casesCount || 0
            };
          })
        );

        setUsers(userPrompts);
      }
    };

    const fetchEnterpriseLeads = async () => {
      const { data, error } = await supabase
        .from('enterprise_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching enterprise leads",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setEnterpriseLeads(data);
      }
    };

    const fetchBlogPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching blog posts",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setBlogPosts(data || []);
    };

    fetchUsers();
    fetchEnterpriseLeads();
    fetchBlogPosts();

    // Subscribe to new chat notifications and messages
    const channel = supabase
      .channel('admin_notifications')
      .on(
        'broadcast',
        { event: 'new_chat' },
        (payload) => {
          setSupportMessages(prev => [...prev, payload.payload]);
          
          // Show notification for new chat
          toast({
            title: "New Support Chat",
            description: "A new user has started a support conversation",
          });
        }
      )
      .on(
        'broadcast',
        { event: 'chat_message' },
        (payload) => {
          setSupportMessages(prev => {
            const newMessages = [...prev];
            const chatIndex = newMessages.findIndex(chat => chat.id === payload.payload.chatId);
            
            if (chatIndex !== -1) {
              newMessages[chatIndex].messages.push({
                id: Date.now().toString(),
                text: payload.payload.message,
                sender: payload.payload.sender,
                timestamp: payload.payload.timestamp
              });
              newMessages[chatIndex].message = payload.payload.message;

              // If it's a user message, show a notification
              if (payload.payload.sender === 'user') {
                toast({
                  title: "New Message",
                  description: `New message from ${newMessages[chatIndex].userName}`,
                });
              }
            }
            
            return newMessages;
          });

          // Store updated messages in localStorage
          const existingMessages = JSON.parse(localStorage.getItem("support-messages") || "[]");
          const chatIndex = existingMessages.findIndex((chat: any) => chat.id === payload.payload.chatId);
          
          if (chatIndex !== -1) {
            existingMessages[chatIndex].messages.push({
              id: Date.now().toString(),
              text: payload.payload.message,
              sender: payload.payload.sender,
              timestamp: payload.payload.timestamp
            });
            existingMessages[chatIndex].message = payload.payload.message;
            localStorage.setItem("support-messages", JSON.stringify(existingMessages));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleBlockCases = async () => {
    if (!selectedUser) return;
    
    const newBlockedStatus = !selectedUser.caseBlocked;
    
    const { error } = await supabase
      .from('profiles')
      .update({ case_blocked: newBlockedStatus })
      .eq('id', selectedUser.id);

    if (error) {
      toast({
        title: "Error updating case blocking status",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, caseBlocked: newBlockedStatus }
        : user
    ));
    
    toast({
      title: newBlockedStatus ? "Cases blocked" : "Cases unblocked",
      description: `${selectedUser.email} has been ${newBlockedStatus ? 'blocked from creating new cases' : 'allowed to create cases again'}`,
    });
  };

  const handleUpdateSubscription = async (newStatus: string) => {
    if (!selectedUser) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_status: newStatus })
      .eq('id', selectedUser.id);

    if (error) {
      toast({
        title: "Error updating subscription",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, subscription: newStatus }
        : user
    ));
    
    toast({
      title: "Subscription updated",
      description: `${selectedUser.email}'s subscription has been updated to ${newStatus}`,
    });
  };

  const handleBlockUser = async () => {
    if (!selectedUser) return;
    
    const newBlockedStatus = !selectedUser.isBlocked;
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_blocked: newBlockedStatus })
      .eq('id', selectedUser.id);

    if (error) {
      toast({
        title: "Error updating user status",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, isBlocked: newBlockedStatus }
        : user
    ));
    
    toast({
      title: newBlockedStatus ? "User blocked" : "User unblocked",
      description: `${selectedUser.email} has been ${newBlockedStatus ? 'blocked from sending prompts' : 'unblocked'}`,
    });
    setIsManageDialogOpen(false);
  };

  const handleManageUser = (user: User) => {
    setSelectedUser(user);
    setIsManageDialogOpen(true);
  };

  const handleCancelSubscription = async () => {
    if (!selectedUser) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({ subscription_status: 'cancelled' })
      .eq('id', selectedUser.id);

    if (error) {
      toast({
        title: "Error cancelling subscription",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, subscription: 'Cancelled' }
        : user
    ));
    
    toast({
      title: "Subscription cancelled",
      description: `Subscription cancelled for ${selectedUser.email}`,
    });
  };

  const handleDeleteAccount = async () => {
    if (!selectedUser) return;
    
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', selectedUser.id);

    if (profileError) {
      toast({
        title: "Error deleting profile",
        description: profileError.message,
        variant: "destructive",
      });
      return;
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(
      selectedUser.id
    );

    if (authError) {
      toast({
        title: "Error deleting user account",
        description: authError.message,
        variant: "destructive",
      });
      return;
    }
    
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setIsManageDialogOpen(false);
    
    toast({
      title: "Account deleted",
      description: `Account for ${selectedUser.email} has been permanently deleted`,
    });
  };

  const handleOpenChat = (chat: SupportMessage) => {
    setSelectedChat(chat);
    setIsChatDialogOpen(true);
    
    if (chat.status === "unread") {
      const updatedMessages = supportMessages.map((msg) =>
        msg.id === chat.id ? { ...msg, status: "ongoing" as const } : msg
      );
      setSupportMessages(updatedMessages);
      localStorage.setItem("support-messages", JSON.stringify(updatedMessages));
    }
  };

  const handleSendMessage = (message: string) => {
    if (!selectedChat || !message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "admin" as const,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = supportMessages.map((chat) =>
      chat.id === selectedChat.id
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
          }
        : chat
    );

    setSupportMessages(updatedMessages);
    localStorage.setItem("support-messages", JSON.stringify(updatedMessages));
    
    supabase.channel(`chat_${selectedChat.id}`)
      .send({
        type: 'broadcast',
        event: 'chat_message',
        payload: {
          chatId: selectedChat.id,
          message: message,
          sender: 'admin',
          timestamp: new Date().toISOString()
        },
      });
    
    toast({
      title: "Message sent",
      description: "Your response has been sent to the user.",
    });
  };

  const handleResolveChat = (chatId: string) => {
    const updatedMessages = supportMessages.map((msg) =>
      msg.id === chatId ? { ...msg, status: "resolved" as const } : msg
    );
    setSupportMessages(updatedMessages);
    localStorage.setItem("support-messages", JSON.stringify(updatedMessages));
    setIsChatDialogOpen(false);
    
    toast({
      title: "Chat resolved",
      description: "The support conversation has been marked as resolved.",
    });
  };

  const handleAddBlogPost = async () => {
    try {
      const { error } = await supabase.from('blog_posts').insert({
        title: newBlogPost.title,
        excerpt: newBlogPost.excerpt,
        content: newBlogPost.content,
        read_time: newBlogPost.readTime,
      });

      if (error) {
        toast({
          title: "Error creating blog post",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setIsNewBlogPostDialogOpen(false);
      setNewBlogPost({
        title: "",
        excerpt: "",
        content: "",
        readTime: "",
      });

      const { data: updatedPosts, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        toast({
          title: "Error fetching blog posts",
          description: fetchError.message,
          variant: "destructive",
        });
        return;
      }

      setBlogPosts(updatedPosts || []);
      
      toast({
        title: "Blog post created",
        description: "Your new blog post has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteBlogPost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        toast({
          title: "Error deleting blog post",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setBlogPosts(blogPosts.filter(post => post.id !== postId));
      toast({
        title: "Blog post deleted",
        description: "The blog post has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleResetPassword = async (userId: string, userEmail: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/dashboard/settings`,
      });

      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: `A password reset email has been sent to ${userEmail}`,
      });
    } catch (error: any) {
      toast({
        title: "Error resetting password",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex items-center gap-2 mb-8">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Signups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter((u) => u.subscription !== "Free" && u.subscription !== "Cancelled").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enterprise Leads</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enterpriseLeads.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {supportMessages.filter((m) => m.status === "unread").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise Leads</TabsTrigger>
            <TabsTrigger value="support">Support Messages</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Total Cases</TableHead>
                      <TableHead>Prompts (24h)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.subscription}</TableCell>
                        <TableCell>{user.country}</TableCell>
                        <TableCell>{user.sector}</TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell>
                          <span className="font-mono">{user.totalCases}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">{user.promptsLastDay}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleManageUser(user)}
                            >
                              Manage
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResetPassword(user.id, user.email)}
                            >
                              Reset Password
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enterprise" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enterpriseLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>{lead.company_name}</TableCell>
                        <TableCell>{lead.contact_name}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {lead.message}
                        </TableCell>
                        <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            lead.status === 'new' 
                              ? 'bg-blue-100 text-blue-800'
                              : lead.status === 'contacted'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Last Message</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supportMessages.map((chat) => (
                      <TableRow key={chat.id}>
                        <TableCell>{chat.userName}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {chat.messages[chat.messages.length - 1]?.text}
                        </TableCell>
                        <TableCell>
                          {new Date(chat.messages[chat.messages.length - 1]?.timestamp).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {chat.status === "unread" && (
                              <CircleDot className="h-4 w-4 text-red-500" />
                            )}
                            {chat.status === "ongoing" && (
                              <CirclePlay className="h-4 w-4 text-yellow-500" />
                            )}
                            {chat.status === "resolved" && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            <span className={`
                              px-2 py-1 rounded-full text-xs
                              ${chat.status === "unread" && "bg-red-100 text-red-800"}
                              ${chat.status === "ongoing" && "bg-yellow-100 text-yellow-800"}
                              ${chat.status === "resolved" && "bg-green-100 text-green-800"}
                            `}>
                              {chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenChat(chat)}
                          >
                            Open Chat
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Blog Posts</CardTitle>
                <Button onClick={() => setIsNewBlogPostDialogOpen(true)}>Add New Post</Button>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Excerpt</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Read Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell className="max-w-xs truncate">{post.excerpt}</TableCell>
                        <TableCell>{new Date(post.created_at || '').toLocaleDateString()}</TableCell>
                        <TableCell>{post.read_time}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteBlogPost(post.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Dialog open={isNewBlogPostDialogOpen} onOpenChange={setIsNewBlogPostDialogOpen}>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Create New Blog Post</DialogTitle>
                  <DialogDescription>
                    Fill in the details for your new blog post. All fields are required.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="title">Title</label>
                    <Input
                      id="title"
                      value={newBlogPost.title}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                      placeholder="Enter the blog post title"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="excerpt">Excerpt</label>
                    <Textarea
                      id="excerpt"
                      value={newBlogPost.excerpt}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, excerpt: e.target.value })}
                      placeholder="Enter a brief excerpt"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="content">Content</label>
                    <Textarea
                      id="content"
                      value={newBlogPost.content}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
                      placeholder="Enter the full blog post content"
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="readTime">Read Time</label>
                    <Input
                      id="readTime"
                      value={newBlogPost.readTime}
                      onChange={(e) => setNewBlogPost({ ...newBlogPost, readTime: e.target.value })}
                      placeholder="e.g. 5 min read"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewBlogPostDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddBlogPost}>
                    Create Post
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage User Account</DialogTitle>
            <DialogDescription>
              {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Subscription Status</h4>
              <Select
                onValueChange={handleUpdateSubscription}
                defaultValue={selectedUser?.subscription}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              className="w-full"
            >
              Cancel Subscription
            </Button>
            
            <Button
              variant={selectedUser?.caseBlocked ? "outline" : "destructive"}
              onClick={handleBlockCases}
              className="w-full"
            >
              {selectedUser?.caseBlocked ? 'Unblock Case Creation' : 'Block Case Creation'}
            </Button>
            
            <Button
              variant={selectedUser?.isBlocked ? "outline" : "destructive"}
              onClick={handleBlockUser}
              className="w-full"
            >
              {selectedUser?.isBlocked ? 'Unblock User' : 'Block User from Prompting'}
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="w-full"
            >
              Delete Account
            </Button>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isChatDialogOpen} onOpenChange={setIsChatDialogOpen}>
        <DialogContent className="sm:max-w-[600px] h-[80vh]">
          <DialogHeader>
            <DialogTitle>Chat with {selectedChat?.userName}</DialogTitle>
            <DialogDescription>
              Support conversation
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.sender === "admin"
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
            
            <div className="p-4 border-t mt-4">
              <AIInput
                placeholder="Type your response..."
                minHeight={80}
                maxHeight={120}
                onSubmit={handleSendMessage}
              />
              <div className="flex justify-end mt-4 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsChatDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => selectedChat && handleResolveChat(selectedChat.id)}
                >
                  Mark as Resolved
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
