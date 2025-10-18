// Shared types for the LANChat frontend

export const MessageType = {
  CHAT: "chat",
  AGENT_DATA: "agent_data",
  SYSTEM: "system",
  JOIN: "join",
  LEAVE: "leave",
  AGENT_RESPONSE: "agent_response",
} as const;

export type MessageType = typeof MessageType[keyof typeof MessageType];

export interface Message {
  id: string;
  type: MessageType | "chat" | "agent_response" | "system" | "join" | "leave" | "agent_data";
  username: string;
  content: string;
  metadata: {
    timestamp: string;
    userId?: string;
    userType?: "human" | "agent";
    [key: string]: any;
  };
}

export interface User {
  id: string;
  username: string;
  type: "human" | "agent";
  capabilities?: string[];
}

export interface SocketEvents {
  message: (message: Message) => void;
  history: (messages: Message[]) => void;
  session_id: (sessionId: string) => void;
}
