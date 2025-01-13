import express from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import jwt from "jsonwebtoken";
import { MONGO_URI, APP_SECRET } from "./config";
import {
  CategoryRoute,
  InquiryRoute,
  UserRoute,
  OrderRoute,
  ProductRoute,
  ReviewRoute,
  NewsletterRoute,
} from "./routes";
import { AuthPayload } from "./dto";
import { FindUser } from "./controllers";

const app = express();
const server = http.createServer(app);

// WebSocket Types
interface ChatClient {
  ws: WebSocket;
  userId: string;
  username: string;
}

interface ChatMessage {
  type: string;
  content: string;
  userId: string;
  username: string;
  timestamp: string;
}

// WebSocket token validation
const validateWSToken = async (token: string): Promise<AuthPayload | null> => {
  try {
    // Remove 'Bearer ' if present
    const actualToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    if (!actualToken) {
      return null;
    }

    const payload = (await jwt.verify(actualToken, APP_SECRET)) as AuthPayload;
    return payload;
  } catch (error) {
    console.error("WebSocket token verification failed:", error);
    return null;
  }
};

// WebSocket setup
const wss = new WebSocketServer({ server });
const clients: Map<string, ChatClient> = new Map();
const authenticatedTokens = new Set<string>();

// Express middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

// Express routes
app.use("/user", UserRoute);
app.use("/category", CategoryRoute);
app.use("/inquiry", InquiryRoute);
app.use("/order", OrderRoute);
app.use("/product", ProductRoute);
app.use("/review", ReviewRoute);
app.use("/newsletter", NewsletterRoute);

// WebSocket functions
function broadcastOnlineUsers() {
  const onlineUsers = Array.from(clients.values()).map((client) => ({
    userId: client.userId,
    username: client.username,
  }));

  const message = JSON.stringify({
    type: "onlineUsers",
    content: onlineUsers,
  });

  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
}

function cleanupDeadConnections() {
  for (const [userId, client] of clients.entries()) {
    if (
      client.ws.readyState === WebSocket.CLOSED ||
      client.ws.readyState === WebSocket.CLOSING
    ) {
      clients.delete(userId);
      for (const token of authenticatedTokens) {
        if (clients.get(userId)?.ws === client.ws) {
          authenticatedTokens.delete(token);
          break;
        }
      }
    }
  }
  broadcastOnlineUsers();
}

// WebSocket connection handler
wss.on("connection", (ws: WebSocket) => {
  console.log("New client attempting to connect");
  let clientId: string | null = null;

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("message", async (data: string) => {
    try {
      const message = JSON.parse(data);
      console.log("Received message:", message);

      switch (message.type) {
        // Update the auth case in the WebSocket message handler
        case "auth":
          if (message.token) {
            try {
              // Check if this token is already authenticated
              const actualToken = message.token.startsWith("Bearer ")
                ? message.token.slice(7)
                : message.token;

              if (authenticatedTokens.has(actualToken)) {
                ws.send(
                  JSON.stringify({
                    type: "error",
                    content: "Already authenticated in another window",
                  })
                );
                ws.close();
                return;
              }

              const payload = await validateWSToken(message.token);

              if (payload) {
                const user = await FindUser(payload._id);

                if (!user) {
                  throw new Error("User not found");
                }

                const fullUsername = `${user.firstName} ${user.lastName}`;
                clients.set(payload._id, {
                  ws,
                  userId: payload._id,
                  username: fullUsername,
                });

                clientId = payload._id;
                authenticatedTokens.add(actualToken); // Store the cleaned token

                ws.send(
                  JSON.stringify({
                    type: "auth",
                    content: "Authentication successful",
                    userId: payload._id,
                    username: fullUsername,
                  })
                );

                broadcastOnlineUsers();
                console.log(
                  `User authenticated: ${fullUsername} (${payload._id})`
                );
              } else {
                throw new Error("Invalid token");
              }
            } catch (error) {
              console.error("Auth error:", error);
              ws.send(
                JSON.stringify({
                  type: "error",
                  content: "Authentication failed",
                })
              );
              ws.close();
            }
          }
          break;

        case "message":
          if (message.recipientId && message.content && clientId) {
            const sender = clients.get(clientId);
            const recipient = clients.get(message.recipientId);

            if (sender && recipient) {
              const chatMessage: ChatMessage = {
                type: "message",
                content: message.content,
                userId: sender.userId,
                username: sender.username,
                timestamp: new Date().toISOString(),
              };

              if (recipient.ws.readyState === WebSocket.OPEN) {
                recipient.ws.send(JSON.stringify(chatMessage));
              }
              if (sender.ws.readyState === WebSocket.OPEN) {
                sender.ws.send(JSON.stringify(chatMessage));
              }
              console.log("Message sent:", chatMessage);
            } else {
              ws.send(
                JSON.stringify({
                  type: "error",
                  content: "Recipient not found or offline",
                })
              );
            }
          }
          break;

        default:
          ws.send(
            JSON.stringify({
              type: "error",
              content: "Unknown message type",
            })
          );
          break;
      }
    } catch (error) {
      console.error("Message handling error:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          content: "Failed to process message",
        })
      );
    }
  });

  ws.on("close", () => {
    if (clientId) {
      const client = clients.get(clientId);
      if (client) {
        for (const token of authenticatedTokens) {
          if (clients.get(clientId)?.ws === ws) {
            authenticatedTokens.delete(token);
            break;
          }
        }
        clients.delete(clientId);
        console.log("Client disconnected:", clientId);
        broadcastOnlineUsers();
      }
    }
  });
});

// Run WebSocket cleanup every minute
setInterval(cleanupDeadConnections, 60000);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    connections: clients.size,
    authenticatedTokens: authenticatedTokens.size,
  });
});

// MongoDB connection and server start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server after MongoDB connects
    server.listen(8000, () => {
      console.clear();
      console.log("Server is running on http://localhost:8000");
      console.log("WebSocket server is ready for connections");
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

export default app;
