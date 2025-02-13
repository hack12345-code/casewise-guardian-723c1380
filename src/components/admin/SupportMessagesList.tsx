
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { CircleDot, CirclePlay, CheckCircle } from "lucide-react";
import { SupportMessage } from "@/types/admin";

interface SupportMessagesListProps {
  messages: SupportMessage[];
  onOpenChat: (chat: SupportMessage) => void;
}

export const SupportMessagesList = ({ messages, onOpenChat }: SupportMessagesListProps) => {
  return (
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
            {messages.map((chat) => (
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
                    onClick={() => onOpenChat(chat)}
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
  );
};
