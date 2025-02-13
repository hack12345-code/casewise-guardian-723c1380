
export interface User {
  id: string;
  name: string;
  email: string;
  subscription: string;
  country: string;
  sector: string;
  lastActive: string;
  isBlocked?: boolean;
}

export interface EnterpriseLead {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  status: string;
}

export interface SupportMessage {
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

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
}
