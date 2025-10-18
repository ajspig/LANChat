// Message types
export type MessageType = 
  | "chat"
  | "agent_response"
  | "system"
  | "join"
  | "leave"
  | "agent_data";

// Core message interface
export interface Message {
  id: string;
  type: MessageType;
  username: string;
  content: string;
  metadata: {
    timestamp: string;
    [key: string]: any;
  };
}

// User and agent types
export interface User {
  id: string;
  username: string;
  type: "human" | "agent";
  capabilities?: string[];
  observe_me?: boolean;
}

// Honcho Insights Types
export interface SessionSummary {
  short: string;
  full: string;
  messageCount: number;
  lastUpdated: string;
}

export interface KnowledgeItem {
  content: string;
  isRecent: boolean;
  timestamp: string;
}

export interface PeerKnowledge {
  peerId: string;
  peerName: string;
  topics: KnowledgeItem[];
}

export interface PeerRelationship {
  fromPeer: string;
  toPeer: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  description: string;
  strength: number; // 0-1
}
