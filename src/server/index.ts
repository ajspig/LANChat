import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { Honcho } from "@honcho-ai/sdk";
import type { Message, User, Agent, MessageType } from "../types.js";
import { createAPIRoutes } from "./api.js";
import { setupSocketIO } from "./socket.js";
import { displayStartupInfo, print } from "./utils.js";
import { startDemoAgents } from "./demo-agents.js";

// Parse command line arguments
const args = process.argv.slice(2);
const sessionFlag = args.findIndex((arg) => arg === "--session");
const providedSessionId =
  sessionFlag !== -1 && sessionFlag + 1 < args.length
    ? args[sessionFlag + 1]
    : null;

async function startServer() {
  // Initialize Honcho
  const honcho = new Honcho({
    baseURL: process.env.HONCHO_BASE_URL || "http://localhost:8000",
    workspaceId: process.env.HONCHO_WORKSPACE_ID || "default",
  });

  // Create or use existing session
  const sessionId = providedSessionId || `groupchat-${Date.now()}`;
  const session = await honcho.session(sessionId);
  print(`honcho session: ${session.id}`, "cyan");

  // Application state
  const connectedUsers = new Map<string, User>();
  const chatHistory: Message[] = [];
  const agents = new Map<string, Agent>();
  
  // Summary cache
  const summaryCache = {
    data: null as any,
    lastUpdated: null as Date | null,
    isGenerating: false,
  };

  // Background summary generation function
  async function generateSummary() {
    if (summaryCache.isGenerating) {
      print("summary generation already in progress, skipping", "yellow");
      return; // Skip if already generating
    }

    const messageCount = chatHistory.filter(msg => msg.type === "chat").length;
    
    // Don't generate if no messages yet
    if (messageCount === 0) {
      print("no messages yet, skipping summary generation", "yellow");
      summaryCache.data = {
        short: "No messages yet. Start chatting to see a summary!",
        full: "Once the conversation begins, this will show a summary of the key topics and interactions.",
        messageCount: 0,
        lastUpdated: new Date().toISOString()
      };
      return;
    }

    summaryCache.isGenerating = true;
    print(`generating summary for ${messageCount} messages...`, "cyan");
    
    try {
      const context = await session.getContext({ summary: true, tokens: 2000 });
      
      print(`context retrieved: ${JSON.stringify(context, null, 2)}`, "blue");
      
      const summary = context.summary;
      
      if (!summary || !summary.content) {
        print("warning: no summary content in context, using fallback", "yellow");
        summaryCache.data = {
          short: `${messageCount} messages exchanged. Summary generation in progress...`,
          full: "The system is processing the conversation. Please check back in a moment.",
          messageCount,
          lastUpdated: new Date().toISOString()
        };
      } else {
        summaryCache.data = {
          short: summary.content.substring(0, 150) || "No activity yet",
          full: summary.content || "No detailed summary available",
          messageCount,
          lastUpdated: new Date().toISOString()
        };
        print(`summary updated successfully: ${summary.content.substring(0, 100)}...`, "green");
      }
      
      summaryCache.lastUpdated = new Date();
    } catch (error) {
      print(`error generating summary: ${error}`, "red");
      console.error("Full error details:", error);
      summaryCache.data = {
        short: `${messageCount} messages. Summary temporarily unavailable.`,
        full: `Error retrieving session summary: ${error}`,
        messageCount,
        lastUpdated: new Date().toISOString()
      };
    } finally {
      summaryCache.isGenerating = false;
    }
  }

  // Load existing messages if using provided session
  if (providedSessionId) {
    print("loading existing messages from session...", "yellow");
    try {
      const existingMessagesPage = await session.getMessages();
      const existingMessages = existingMessagesPage.items;

      for (const msg of existingMessages) {
        const message: Message = {
          id: msg.id,
          type: "chat",
          username: msg.peer_id || "unknown",
          content: msg.content,
          metadata: {
            timestamp: msg.created_at || new Date().toISOString(),
            loadedFromSession: true,
          },
        };
        chatHistory.push(message);
      }

      print(`loaded ${existingMessages.length} messages from session`, "green");
    } catch (error) {
      print(`error loading messages from session: ${error}`, "red");
    }
  }

  // Configuration
  const PORT = parseInt(Bun.env.PORT || "3000");

  // Create API routes
  const app = createAPIRoutes(connectedUsers, agents, chatHistory, PORT);

  // Create HTTP server
  const server = createServer(async (req, res) => {
    if (req.url?.startsWith("/api/")) {
      const response = await app.fetch(
        new Request(`http://localhost${req.url}`, {
          method: req.method,
          headers: req.headers as any,
        }),
      );

      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      const body = await response.text();
      res.end(body);
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  });

  // Setup Socket.IO
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    pingInterval: 25000,
    pingTimeout: 60000,
    transports: ["websocket", "polling"],
  });

  // Enhanced summary generation with broadcasting
  const generateAndBroadcastSummary = async () => {
    await generateSummary();
    if (summaryCache.data) {
      io.emit("summary_updated", summaryCache.data);
    }
  };

  setupSocketIO(io, connectedUsers, agents, chatHistory, honcho, session, summaryCache, generateAndBroadcastSummary);

  // Generate initial summary after a short delay and broadcast when ready
  setTimeout(async () => {
    await generateSummary();
    if (summaryCache.data) {
      io.emit("summary_updated", summaryCache.data);
    }
  }, 2000);

  // Update summary every 30 seconds and broadcast to all clients
  setInterval(async () => {
    await generateSummary();
    if (summaryCache.data) {
      io.emit("summary_updated", summaryCache.data);
    }
  }, 30000);

  // Start server
  print("starting LAN chat server...", "blue");
  server.listen(PORT, () => {
    print(`server listening on port ${PORT}`, "green");
    displayStartupInfo(PORT);
    
    // Start demo agents if ENABLE_DEMO_AGENTS is true
    const enableDemoAgents = Bun.env.ENABLE_DEMO_AGENTS !== "false"; // Default to true
    if (enableDemoAgents) {
      const serverUrl = `http://localhost:${PORT}`;
      startDemoAgents(serverUrl).catch((error) => {
        print(`failed to start demo agents: ${error}`, "red");
      });
    } else {
      print("demo agents disabled (set ENABLE_DEMO_AGENTS=true to enable)", "yellow");
    }
  });
}

startServer().catch(console.error);
