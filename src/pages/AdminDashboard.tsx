
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
import { Users, Settings, Building2, BarChart3, MessageSquare, CircleDot, CirclePlay, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { AIInput } from "@/components/ui/ai-input";

interface User {
  id: string;
  name: string;
  email: string;
  subscription: string;
  country: string;
  sector: string;
  lastActive: string;
  isBlocked?: boolean;
}

interface EnterpriseLead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  message: string;
  date: string;
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

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Dr. John Smith",
      email: "john@example.com",
      subscription: "Pro",
      country: "United States",
      sector: "Cardiology",
      lastActive: "2024-02-20",
      isBlocked: false,
    },
  ]);

  const [enterpriseLeads] = useState<EnterpriseLead[]>([
    {
      id: "1",
      companyName: "Medical Center Inc",
      contactName: "Jane Doe",
      email: "jane@medcenter.com",
      phone: "+1234567890",
      message: "Interested in enterprise plan for 50 doctors",
      date: "2024-02-19",
    },
  ]);

  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>(() => {
    const savedMessages = localStorage.getItem("support-messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<SupportMessage | null>(null);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleManageUser = (user: User) => {
    setSelectedUser(user);
    setIsManageDialogOpen(true);
  };

  const handleOpenChat = (chat: SupportMessage) => {
    setSelectedChat(chat);
    setIsChatDialogOpen(true);
    
    // Mark as ongoing if unread
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

  const handleCancelSubscription = () => {
    if (!selectedUser) return;
    
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, subscription: "Cancelled" }
        : user
    ));
    
    toast({
      title: "Subscription cancelled",
      description: `Subscription cancelled for ${selectedUser.email}`,
    });
  };

  const handleDeleteAccount = () => {
    if (!selectedUser) return;
    
    setUsers(users.filter(user => user.id !== selectedUser.id));
    setIsManageDialogOpen(false);
    
    toast({
      title: "Account deleted",
      description: `Account deleted for ${selectedUser.email}`,
    });
  };

  const handleBlockUser = () => {
    if (!selectedUser) return;
    
    setUsers(users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, isBlocked: !user.isBlocked }
        : user
    ));
    
    toast({
      title: selectedUser.isBlocked ? "User unblocked" : "User blocked",
      description: `${selectedUser.email} has been ${selectedUser.isBlocked ? 'unblocked' : 'blocked'}`,
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleManageUser(user)}
                          >
                            Manage
                          </Button>
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enterpriseLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>{lead.companyName}</TableCell>
                        <TableCell>{lead.contactName}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {lead.message}
                        </TableCell>
                        <TableCell>{lead.date}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
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
                          {new Date(chat.messages[chat.messages.length - 1]?.timestamp).toLocaleString()}
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
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              className="w-full"
            >
              Cancel Subscription
            </Button>
            
            <Button
              variant={selectedUser?.isBlocked ? "outline" : "destructive"}
              onClick={handleBlockUser}
              className="w-full"
            >
              {selectedUser?.isBlocked ? 'Unblock User' : 'Block User'}
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
