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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  readTime: z.string().min(1, "Read time is required"),
});

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
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: "Understanding Medical Risk Management",
      excerpt: "Learn about the key principles of managing medical risks in modern healthcare practices.",
      date: "2024-03-15",
      readTime: "5 min read"
    },
  ]);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      readTime: "",
    },
  });

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
        const formattedUsers = data.map(user => ({
          id: user.id,
          name: user.full_name || 'N/A',
          email: user.email,
          subscription: user.subscription_status || 'Free',
          country: user.country || 'N/A',
          sector: user.medical_sector || 'N/A',
          lastActive: new Date(user.updated_at).toLocaleDateString(),
          isBlocked: user.is_blocked,
          caseBlocked: user.case_blocked,
        }));
        setUsers(formattedUsers);
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

    fetchUsers();
    fetchEnterpriseLeads();
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

  const handleAddBlogPost = async (values: z.infer<typeof blogPostSchema>) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title: values.title,
          excerpt: values.excerpt,
          content: values.content,
          read_time: values.readTime,
        });

      if (error) throw error;

      // Fetch the latest blog posts
      const { data: newPosts, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setBlogPosts(newPosts.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        date: new Date(post.created_at).toISOString(),
        readTime: post.read_time
      })));

      setIsNewPostDialogOpen(false);
      form.reset();
      
      toast({
        title: "Blog post created",
        description: "Your new blog post has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating blog post",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteBlogPost = (postId: number) => {
    setBlogPosts(blogPosts.filter(post => post.id !== postId));
    toast({
      title: "Blog post deleted",
      description: "The blog post has been deleted successfully.",
    });
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
                <Button onClick={() => setIsNewPostDialogOpen(true)}>Add New Post</Button>
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
                        <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                        <TableCell>{post.readTime}</TableCell>
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

      <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Fill in the details for your new blog post
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddBlogPost)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter a brief excerpt" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your blog post content" 
                        className="min-h-[200px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="readTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Read Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5 min read" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsNewPostDialogOpen(false);
                  form.reset();
                }}>
                  Cancel
                </Button>
                <Button type="submit">Create Post</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
