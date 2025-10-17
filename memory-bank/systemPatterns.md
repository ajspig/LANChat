# System Patterns: LANChat

## Architecture Overview

### High-Level Architecture
```
┌──────────────────────────────────────────────────────────┐
│                     LANChat System                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐      ┌──────────────┐     ┌─────────┐ │
│  │   Clients   │◄────►│    Server    │◄────►│ Agents  │ │
│  │  (Human)    │      │  Socket.IO   │      │  (AI)   │ │
│  └─────────────┘      │  + HTTP API  │      └─────────┘ │
│        │              └──────────────┘            │      │
│        │                     │                    │      │
│        │              ┌──────▼──────┐            │      │
│        │              │   Memory    │            │      │
│        │              │  (History)  │            │      │
│        │              └─────────────┘            │      │
│        │                                         │      │
│        └────────────┐         ┐──────────────────┘      │
│                     ▼         ▼                         │
│              ┌──────────────────┐                       │
│              │  Honcho Service  │                       │
│              │  (External)      │                       │
│              ├──────────────────┤                       │
│              │ • Sessions       │                       │
│              │ • Context        │                       │
│              │ • Peer Models    │                       │
│              │ • Search         │                       │
│              └──────────────────┘                       │
│                     ▲                                    │
│              ┌──────┴──────┐                            │
│              │   Ollama    │                            │
│              │  (Local LLM)│                            │
│              └─────────────┘                            │
└──────────────────────────────────────────────────────────┘
```

### Component Relationships

#### Server Layer (`src/server/`)
- **index.ts**: Main entry point, orchestrates all components
- **socket.ts**: WebSocket event handlers and message routing
- **api.ts**: HTTP REST endpoints for stats and history
- **utils.ts**: Helper functions for display and network detection

#### Client Layer (`src/client/`)
- **terminal-client.ts**: User-facing terminal interface
- **socket-client.ts**: WebSocket client logic
- **commands.ts**: Command parsing and handling

#### Agent Layer
- **agent.ts**: Base agent class with decision-making framework
- **sample-agents/**: Example agent implementations with personalities

## Key Design Patterns

### 1. Event-Driven Architecture (Socket.IO)

**Pattern**: Pub/Sub messaging with event-driven handlers

**Implementation**:
```typescript
// Server emits events to all connected clients
io.emit('message', messageObject)

// Clients listen for events
socket.on('message', (message) => {
  // Handle incoming message
})
```

**Benefits**:
- Decoupled components
- Real-time bidirectional communication
- Scalable message distribution

### 2. State Management Pattern

**Pattern**: Centralized state with Map collections

**Implementation**:
```typescript
const connectedUsers = new Map<string, User>()
const agents = new Map<string, Agent>()
const chatHistory: Message[] = []
```

**Benefits**:
- Single source of truth
- Fast lookups by ID
- Easy state inspection
- Simple serialization

### 3. Agent Decision Pipeline Pattern

**Pattern**: Multi-stage decision making with conditional execution

**Stages**:
1. **Should Respond?** → Binary decision with confidence
2. **Choose Action** → psychology | search | respond
3. **Execute Action** → Gather context
4. **Generate Response** → Contextual reply

**Implementation Flow**:
```typescript
processMessage(message) {
  // Stage 1: Decide if response needed
  decision = await shouldRespond(message, context)
  if (!decision.should_respond) return
  
  // Stage 2: Choose and execute action
  await decideAction(message, context, tracker)
}

decideAction(message, context, tracker) {
  decision = await chooseAction()
  
  if (decision === 'psychology' && !tracker.psychology) {
    result = await analyzePsychology()
    tracker.psychology = result
    // Recurse with new context
    await decideAction(message, context, tracker)
  } else if (decision === 'search' && !tracker.search) {
    result = await search()
    tracker.search = result
    await decideAction(message, context, tracker)
  } else {
    // Generate final response
    await generateResponse(message, context, tracker)
  }
}
```

**Benefits**:
- Prevents infinite recursion (tracker prevents re-executing same action)
- Accumulates context before final response
- Flexible and extensible
- Clear decision reasoning

### 4. Context Building Pattern

**Pattern**: Progressive context accumulation from multiple sources

**Sources**:
1. **Recent Conversation**: From Honcho session context
2. **Peer Psychology**: From Honcho peer models
3. **Semantic Search**: From message history
4. **Real-Time Stream**: Current message

**Implementation**:
```typescript
// 1. Get recent context
const context = await session.getContext({
  summary: true,
  tokens: 5000,
  lastUserMessage: message.content,
  peerTarget: message.username
})

// 2. Add psychology (if needed)
if (tracker.psychology) {
  context += `Psychology analysis: ${tracker.psychology}`
}

// 3. Add search results (if needed)
if (tracker.search) {
  context += `Search results: ${tracker.search}`
}

// 4. Generate with full context
response = await ollama.chat({ messages: [context, ...] })
```

### 5. Message Type Polymorphism

**Pattern**: Unified message interface with type discrimination

**Implementation**:
```typescript
interface Message {
  id: string
  type: MessageType  // Discriminator
  username: string
  content: string
  metadata: {
    timestamp: string
    [key: string]: any  // Extensible
  }
}
```

**Message Types**:
- `chat`: Regular user messages
- `agent_response`: AI agent responses
- `agent_data`: Structured data
- `system`: System notifications
- `join`/`leave`: Connection events

### 6. Client Connection Flexibility

**Pattern**: Multiple connection methods to same server

**Methods**:
1. **TypeScript Client**: `bun run client`
2. **Netcat**: `nc <ip> <port>`
3. **Telnet**: `telnet <ip> <port>`
4. **WebSocket**: Direct Socket.IO connection

**Benefits**:
- No client installation required
- Uses existing Unix tools
- Lowest common denominator (plain text)
- Developer-friendly

## Critical Implementation Paths

### Message Flow Path

```
User types message
    ↓
Terminal client receives input
    ↓
Socket.emit('chat', { content })
    ↓
Server receives via socket.on('chat')
    ↓
Server creates Message object with metadata
    ↓
Server adds to chatHistory array
    ↓
Server sends to Honcho session (if available)
    ↓
Server broadcasts to all clients via io.emit('message')
    ↓
All clients receive and display message
    ↓
Agents process through decision pipeline
```

### Agent Response Path

```
Agent receives message event
    ↓
Build context from Honcho session
    ↓
Stage 1: shouldRespond() decision
    ↓ (if yes)
Stage 2: decideAction() choice
    ↓
Execute chosen action:
  • Psychology: Query peer model
  • Search: Semantic search history
  • Respond: Direct to response
    ↓
Accumulate context in tracker
    ↓
Recurse if more context needed
    ↓
Generate response with Ollama
    ↓
Emit chat message back to server
    ↓
Server broadcasts to all (including agent)
    ↓
Save agent's message to Honcho
```

### Session Management Path

```
Server starts
    ↓
Initialize Honcho client (if available)
    ↓
Client connects
    ↓
Server generates/retrieves session ID
    ↓
Server emits 'session_id' to client
    ↓
Agent receives session ID
    ↓
Agent stores sessionId for all operations
    ↓
All context/peer operations use session ID
    ↓
Session persists across agent reconnections
```

## Technical Decisions

### Why Bun?
- **Native TypeScript**: No transpilation needed
- **Fast startup**: Important for CLI tools
- **Built-in tools**: Testing, bundling included
- **Modern APIs**: Better than Node.js

### Why Socket.IO?
- **Bidirectional**: Server can push to clients
- **Reconnection**: Automatic retry logic
- **Transport fallback**: WebSocket → polling
- **Room support**: For future multi-channel

### Why Ollama?
- **Local**: No API costs or rate limits
- **Privacy**: Data stays on machine
- **Customizable**: Any model that fits
- **Fast**: Local inference

### Why Honcho?
- **Session management**: Persistent context
- **Peer modeling**: Psychology understanding
- **Semantic search**: Vector-based search
- **Purpose-built**: Designed for conversational AI

### Why No Authentication?
- **LAN-based**: Assumes trusted network
- **Simplicity**: Focus on AI capabilities
- **Unix philosophy**: Small, focused tools
- **Future extension**: Can add later if needed

## Data Flow Patterns

### Synchronous Flow (HTTP API)
```
Client → HTTP Request → Server → Response → Client
```

### Asynchronous Flow (WebSocket)
```
Client → Socket Event → Server → Broadcast → All Clients
```

### Agent Context Flow
```
Agent → Honcho SDK → Honcho Service → Response → Agent
```

### LLM Inference Flow
```
Agent → Ollama Client → Ollama Service → Response → Agent
```

## Extension Points

### Creating Custom Agents
1. Extend `ChatAgent` class
2. Override `systemPrompt` for personality
3. Optionally override `processMessage()` for custom logic
4. Optionally override `shouldRespond()` for custom decision logic
5. Optionally add custom methods for new capabilities

### Adding New Message Types
1. Add to `MessageType` enum in `types.ts`
2. Add handler in `socket.ts`
3. Update client to handle new type
4. Document behavior in this file

### Adding API Endpoints
1. Add route in `api.ts` using Hono
2. Access shared state (users, agents, history)
3. Return appropriate JSON response
4. Update documentation

### Integrating New Services
1. Add client initialization in `server/index.ts`
2. Pass to `setupSocketIO()` if needed by handlers
3. Use in agent logic as needed
4. Handle graceful degradation if unavailable

## Performance Considerations

### Memory Management
- Chat history array grows unbounded (future: add limit)
- Map collections scale well for users/agents
- Honcho handles context window management

### Network Efficiency
- WebSocket maintains persistent connections
- Binary protocol more efficient than HTTP
- Broadcast to all clients (no filtering)

### LLM Performance
- Local Ollama inference (no network latency)
- Temperature/token settings tunable per agent
- Parallel agent processing (each in own process)

### Scaling Considerations
- Current: Single server instance
- Future: Could add Redis for distributed state
- Future: Could add load balancer for multiple servers
- Future: Could add message queue for agent processing
