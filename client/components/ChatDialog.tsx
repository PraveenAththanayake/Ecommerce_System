"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useRef, useState, useCallback } from "react";
import Cookies from "js-cookie";
import { Users, Send, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface ChatMessage {
  userId: string;
  username: string;
  content: string;
  timestamp: string;
}

interface OnlineUser {
  userId: string;
  username: string;
}

interface ChatDialogProps {
  children: React.ReactNode;
}

export const ChatDialog = ({ children }: ChatDialogProps) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentUserId = Cookies.get("userId");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebSocket connection logic remains the same...
  const connectWebSocket = useCallback(() => {
    if (
      ws.current?.readyState === WebSocket.OPEN ||
      ws.current?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    try {
      ws.current = new WebSocket("ws://localhost:8000/ws");

      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        const token = Cookies.get("token");
        if (token) {
          ws.current?.send(
            JSON.stringify({
              type: "auth",
              token,
            })
          );
        } else {
          setError("Authentication token not found. Please log in again.");
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "message":
              setMessages((prev) => [...prev, data]);
              break;
            case "onlineUsers":
              const filteredUsers = data.content.filter(
                (user: OnlineUser) => user.userId !== currentUserId
              );
              setOnlineUsers(filteredUsers);
              setSelectedUser((prev) =>
                prev
                  ? filteredUsers.find(
                      (u: OnlineUser) => u.userId === prev.userId
                    ) || null
                  : null
              );
              break;
            case "error":
              setError(data.content);
              break;
            case "auth":
              if (data.userId) {
                Cookies.set("userId", data.userId);
              }
              break;
          }
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        ws.current = null;

        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
        }
        reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
      };

      ws.current.onerror = () => {
        setError("Connection error. Trying to reconnect...");
      };
    } catch {
      setError("Failed to establish connection");
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      reconnectTimeout.current = setTimeout(connectWebSocket, 3000);
    }
  }, [currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !messageInput.trim() || !isConnected) return;

    try {
      ws.current?.send(
        JSON.stringify({
          type: "message",
          recipientId: selectedUser.userId,
          content: messageInput.trim(),
        })
      );
      setMessageInput("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  const UsersList = () => (
    <div className="flex flex-col h-full">
      <div className="p-2 bg-muted/30 text-sm font-medium flex items-center gap-2">
        <Users size={16} />
        <span>Online Users ({onlineUsers.length})</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {onlineUsers.length === 0 ? (
          <div className="p-3 text-sm text-muted-foreground">
            No users online
          </div>
        ) : (
          onlineUsers.map((user) => (
            <div
              key={user.userId}
              onClick={() => {
                setSelectedUser(user);
                setIsSidebarOpen(false);
              }}
              className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                selectedUser?.userId === user.userId
                  ? "bg-accent text-accent-foreground"
                  : ""
              }`}
            >
              <div className="text-sm font-medium truncate">
                {user.username}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <Dialog onOpenChange={(open) => open && connectWebSocket()}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-[65vw] h-[90vh] p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                {selectedUser ? (
                  <>
                    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                      <SheetTrigger className="lg:hidden">
                        <Menu className="w-5 h-5" />
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[240px] p-0">
                        <UsersList />
                      </SheetContent>
                    </Sheet>
                    <span>Chat with {selectedUser.username}</span>
                  </>
                ) : (
                  "Select a user to start chatting"
                )}
              </DialogTitle>
              {!isConnected && (
                <span className="text-xs text-red-500">Reconnecting...</span>
              )}
            </div>
          </DialogHeader>

          {error && (
            <div className="p-2 m-4 bg-red-100 text-red-600 text-sm rounded">
              {error}
            </div>
          )}

          <div className="flex flex-1 min-h-0">
            <div className="hidden lg:block w-64 border-r">
              <UsersList />
            </div>

            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    No messages yet
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isCurrentUser = msg.userId === currentUserId;
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${
                          isCurrentUser ? "items-end" : "items-start"
                        }`}
                      >
                        {!isCurrentUser && (
                          <span className="text-xs text-muted-foreground mb-1">
                            {msg.username}
                          </span>
                        )}
                        <div
                          className={`rounded-lg p-3 max-w-[85%] break-words ${
                            isCurrentUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={
                      selectedUser
                        ? "Type your message..."
                        : "Select a user to start chatting"
                    }
                    className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={!selectedUser || !isConnected}
                  />
                  <button
                    type="submit"
                    disabled={
                      !selectedUser || !isConnected || !messageInput.trim()
                    }
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <Send size={16} />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
