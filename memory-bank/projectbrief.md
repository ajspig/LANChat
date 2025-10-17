# Project Brief: LANChat

## Project Overview
LANChat is a real-time LAN chat server with sophisticated AI agent integration. Built on Bun, TypeScript, and Hono, it enables both human users and AI agents to participate in conversations with advanced context awareness and psychological analysis capabilities.

## Core Mission
Create a chat system where AI agents can participate naturally in conversations by understanding context, analyzing participant psychology, and making intelligent decisions about when and how to respond.

## Key Requirements

### 1. Real-Time Communication
- WebSocket-based messaging via Socket.IO
- Support for both browser and terminal clients
- Connection via standard Unix tools (netcat, telnet)
- Automatic network interface detection

### 2. AI Agent Capabilities
- **Contextual Response Decision Making**: Agents decide when to respond based on conversation context
- **Psychology Analysis**: Agents can query peer models to understand participants better
- **Semantic Search**: Search conversation history for relevant context
- **Multi-Step Reasoning**: Agents can gather context before responding
- **Session Persistence**: Conversation history maintained per session

### 3. Integration Points
- **Ollama**: Local LLM inference for agent intelligence (default: llama3.1:8b)
- **Honcho SDK**: Session management, peer psychology modeling, semantic search
- **Socket.IO**: Real-time bidirectional communication
- **Bun Runtime**: Fast JavaScript runtime with native TypeScript support

### 4. Message Types
- `chat`: Regular user messages
- `agent_response`: AI agent responses
- `agent_data`: Structured data from agents
- `system`: System notifications
- `join`/`leave`: Connection events

## Project Structure

```
LANChat/
├── src/
│   ├── server/
│   │   ├── index.ts       # Main server entry point
│   │   ├── socket.ts      # Socket.IO setup and handlers
│   │   ├── api.ts         # REST API endpoints
│   │   └── utils.ts       # Utility functions
│   ├── client/
│   │   ├── terminal-client.ts  # Terminal-based client
│   │   ├── socket-client.ts    # Socket client logic
│   │   └── commands.ts         # Client commands
│   ├── sample-agents/
│   │   ├── journalist-agent.ts
│   │   ├── philosopher-agent.ts
│   │   ├── pirate-agent.ts
│   │   └── teenager-agent.ts
│   ├── agent.ts          # Base agent class
│   ├── monitor.ts        # Session monitoring
│   ├── visualize-reps.ts # Representation visualization
│   └── types.ts          # Shared TypeScript types
└── memory-bank/          # AI memory and context
```

## Success Criteria

### Core Functionality
- ✅ Users can connect via multiple methods (websocket, terminal, netcat/telnet)
- ✅ Messages broadcast in real-time to all participants
- ✅ Chat history persisted and queryable
- ✅ Agents can join and respond contextually

### Agent Intelligence
- ✅ Agents make intelligent response decisions
- ✅ Agents can analyze participant psychology
- ✅ Agents can search conversation history semantically
- ✅ Agents maintain conversation context across sessions

### Developer Experience
- Simple setup with `bun install` and `bun start`
- Clear connection instructions on server start
- Multiple agent personalities available as examples
- Extensible architecture for custom agents

## Non-Requirements
- No authentication/authorization (LAN-based trust model)
- No persistent user accounts
- No message encryption (assumes secure LAN environment)
- No web UI (terminal/CLI focused)

## Technical Constraints
- Must run on macOS/Linux (Unix tools dependency)
- Requires Ollama running locally for AI features
- Requires Honcho service for advanced features (optional)
- Bun runtime required (not Node.js compatible due to Bun-specific APIs)

## Future Considerations
- Web-based UI for easier access
- Integration with cloud LLM providers (Claude, GPT)
- Enhanced agent collaboration features
- Voice/audio integration
- Mobile client support
