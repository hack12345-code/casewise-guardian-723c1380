
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { UsersList } from "@/components/admin/UsersList";
import { EnterpriseLeadsList } from "@/components/admin/EnterpriseLeadsList";
import { SupportMessagesList } from "@/components/admin/SupportMessagesList";
import { BlogPostsList } from "@/components/admin/BlogPostsList";
import { ManageUserDialog } from "@/components/admin/ManageUserDialog";
import { SupportChatDialog } from "@/components/admin/SupportChatDialog";
import { User, EnterpriseLead, SupportMessage, BlogPost } from "@/types/admin";

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
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: "Understanding Medical Risk Management",
      excerpt: "Learn about the key principles of managing medical risks in modern healthcare practices.",
      date: "2024-03-15",
      readTime: "5 min read"
    },
  ]);
  
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
        const formattedUsers = data.map(user => ({
          id: user.id,
          name: user.full_name || 'N/A',
          email: user.email,
          subscription: user.subscription_status || 'Free',
          country: user.country || 'N/A',
          sector: user.medical_sector || 'N/A',
          lastActive: new Date(user.updated_at).toLocaleDateString(),
          isBlocked: user.is_blocked,
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
    
    const { error } = await supabase.auth.admin.deleteUser(selectedUser.id);

    if (error) {
      toast({
        title: "Error deleting account",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setIsManageDialogOpen(false);
    
    toast({
      title: "Account deleted",
      description: `Account deleted for ${selectedUser.email}`,
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

  const handleManageUser = (user: User) => {
    setSelectedUser(user);
    setIsManageDialogOpen(true);
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

  const handleResolveChat = () => {
    if (!selectedChat) return;
    
    const updatedMessages = supportMessages.map((msg) =>
      msg.id === selectedChat.id ? { ...msg, status: "resolved" as const } : msg
    );
    setSupportMessages(updatedMessages);
    localStorage.setItem("support-messages", JSON.stringify(updatedMessages));
    setIsChatDialogOpen(false);
    
    toast({
      title: "Chat resolved",
      description: "The support conversation has been marked as resolved.",
    });
  };

  const handleAddBlogPost = () => {
    toast({
      title: "Blog post created",
      description: "Your new blog post has been created successfully.",
    });
  };

  const handleDeleteBlogPost = (postId: number) => {
    setBlogPosts(blogPosts.filter(post => post.id !== postId));
    toast({
      title: "Blog post deleted",
      description: "The blog post has been deleted successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex items-center gap-2 mb-8">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <DashboardStats 
          users={users}
          enterpriseLeads={enterpriseLeads}
          supportMessages={supportMessages}
        />

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise Leads</TabsTrigger>
            <TabsTrigger value="support">Support Messages</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersList
              users={users}
              onManageUser={handleManageUser}
              onResetPassword={handleResetPassword}
            />
          </TabsContent>

          <TabsContent value="enterprise">
            <EnterpriseLeadsList leads={enterpriseLeads} />
          </TabsContent>

          <TabsContent value="support">
            <SupportMessagesList
              messages={supportMessages}
              onOpenChat={handleOpenChat}
            />
          </TabsContent>

          <TabsContent value="blog">
            <BlogPostsList
              posts={blogPosts}
              onAddPost={handleAddBlogPost}
              onDeletePost={handleDeleteBlogPost}
            />
          </TabsContent>
        </Tabs>

        <ManageUserDialog
          user={selectedUser}
          isOpen={isManageDialogOpen}
          onClose={() => setIsManageDialogOpen(false)}
          onBlock={handleBlockUser}
          onCancelSubscription={handleCancelSubscription}
          onDelete={handleDeleteAccount}
        />

        <SupportChatDialog
          chat={selectedChat}
          isOpen={isChatDialogOpen}
          onClose={() => setIsChatDialogOpen(false)}
          onSendMessage={handleSendMessage}
          onResolve={handleResolve