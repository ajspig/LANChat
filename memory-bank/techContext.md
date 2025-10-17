# Technical Context: LANChat

## Technology Stack

### Runtime Environment
- **Bun v1.x**: JavaScript runtime with native TypeScript support
  - Replaces Node.js for this project
  - Built-in TypeScript transpilation
  - Fast startup and execution
  - Native test runner and bundler

### Core Technologies

#### Server-Side
- **Hono v4.8.5**: Lightweight web framework
  - Express-like API
  - Optimized for edge computing
  - TypeScript-first
  - Used for HTTP API endpoints

- **Socket.IO v4.8.1**: WebSocket library
  - Bidirectional real-time communication
  - Automatic reconnection
  - Transport fallback (WebSocket → polling)
  - Room/namespace support

#### AI/ML Integration
- **Ollama v0.5.16**: Local LLM client
  - Interface to local Ollama server
  - Supports various models (llama3.1, mistral, etc.)
  - Streaming and JSON mode support
  - Used for agent intelligence

- **@honcho-ai/sdk v1.5.0**: Conversational AI SDK
  - Session management
  - Context window management
  - Peer psychology modeling (dialectic system)
  - Semantic search (vector-based)
  - Memory and representation storage

#### Client-Side
- **Socket.IO Client v4.8.1**: WebSocket client library
- **Chalk v5.4.1**: Terminal string styling
  - Colored output
  - Text formatting
  - ANSI escape codes

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["ESNext"],
    "types": ["bun-types"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "allowJs": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

**Key Settings**:
- `module: "ESNext"`: Use modern ES modules
- `moduleResolution: "bundler"`: Bun-specific resolution
- `allowImportingTsExtensions: true`: Allow `.ts` imports
- `noEmit: true`: No JS output (Bun handles this)

## Development Setup

### Prerequisites
1. **Bun Runtime**: Install via `curl -fsSL https://bun.sh/install | bash`
2. **Ollama**: Local LLM server
   - Install: `curl -fsSL https://ollama.com/install.sh | sh`
   - Start: `ollama serve`
   - Pull model: `ollama pull llama3.1:8b`
3. **Honcho Service** (optional): Psychology modeling service
   - Runs on `http://localhost:8000`
   - Required for psychology and semantic search features

### Installation
```bash
# Clone repository
git clone <repo>
cd LANChat

# Install dependencies
bun install

# Start server
bun start
# or with auto-restart:
bun dev
```

### Available Scripts
```json
{
  "start": "bun run src/server/index.ts",
  "monitor": "bun run src/monitor.ts",
  "visualize": "bun run src/visualize-reps.ts",
  "dev": "bun --watch src/server/index.ts",
  "client": "bun run src/client/terminal-client.ts",
  "agent": "bun run src/agent.ts",
  "build": "bun build src/server/index.ts --outdir ./dist --target bun",
  "type-check": "tsc --noEmit"
}
```

## Environment Configuration

### Environment Variables

**.env File**:
```bash
# Server Configuration
PORT=3000                    # Server port (default: 3000)

# Agent Configuration
MODEL=llama3.1:8b           # Ollama model to use
CHAT_SERVER=http://localhost:3000  # Server URL for agents

# Honcho Configuration (optional)
HONCHO_BASE_URL=http://localhost:8000
# HONCHO_API_KEY=your_key_here     # If authentication enabled
```

### Configuration Files

**.env.example**: Template for environment variables
**.env.template**: Same as .env.example
**.gitignore**: Excludes node_modules, .env, dist, etc.

## Dependencies

### Production Dependencies
```json
{
  "@honcho-ai/sdk": "^1.5.0",    // Conversational AI SDK
  "chalk": "^5.4.1",              // Terminal colors
  "hono": "^4.8.5",               // Web framework
  "ollama": "^0.5.16",            // LLM client
  "socket.io": "^4.8.1",          // WebSocket server
  "socket.io-client": "^4.8.1"    // WebSocket client
}
```

### Development Dependencies
```json
{
  "@types/bun": "latest",         // Bun type definitions
  "@types/node": "^24.1.0"        // Node.js type definitions
}
```

### Peer Dependencies
```json
{
  "typescript": "^5"              // TypeScript compiler
}
```

## Technical Constraints

### Bun-Specific Features Used
- **Native TypeScript**: No build step required
- **Bun.env**: Environment variable access
- **Top-level await**: Used throughout
- **import.meta.main**: Script detection

### Breaking Changes from Node.js
- `process.argv` still works but Bun-specific APIs preferred
- Some Node.js-specific modules may not work
- Native crypto/fetch available globally

### System Requirements
- **OS**: macOS or Linux (Windows via WSL)
- **Memory**: 4GB minimum (8GB+ for LLMs)
- **Disk**: 10GB for Ollama models
- **Network**: LAN connectivity required

## External Service Dependencies

### Ollama Service
**Purpose**: Local LLM inference

**Configuration**:
```typescript
const ollama = new Ollama({ 
  host: "http://localhost:11434" 
})
```

**Model Selection**:
- Default: `llama3.1:8b` (4.7GB)
- Alternatives: `mistral`, `llama3.2`, `qwen2.5`
- Configurable via `MODEL` env var

**API Calls**:
- `ollama.generate()`: One-shot generation with JSON mode
- `ollama.chat()`: Multi-turn conversations

### Honcho Service
**Purpose**: Session management, context, peer psychology

**Configuration**:
```typescript
const honcho = new Honcho({
  baseURL: process.env.HONCHO_BASE_URL || "http://localhost:8000",
  workspaceId: agentName  // Unique per agent
})
```

**Features Used**:
- **Sessions**: `honcho.session(id)`
- **Peers**: `honcho.peer(username)`
- **Context**: `session.getContext(options)`
- **Messages**: `session.addMessages(messages)`
- **Search**: `session.search(query)`
- **Dialectic**: `peer.chat(question, options)`

**Graceful Degradation**:
- Server runs without Honcho (basic chat mode)
- Agents won't have psychology/search features
- Warning displayed on startup

## Network Architecture

### Port Usage
- **3000**: Default server HTTP/WebSocket port (configurable)
- **11434**: Ollama service (standard)
- **8000**: Honcho service (standard)

### Network Detection
Server automatically detects and displays available network interfaces:

```typescript
const interfaces = os.networkInterfaces()
// Filters for IPv4, non-internal addresses
// Prioritizes common interface names (en0, eth0, etc.)
```

### Connection Methods

#### WebSocket (Socket.IO)
```typescript
const socket = io('http://192.168.1.100:3000', {
  transports: ['websocket'],
  reconnection: true
})
```

#### Raw TCP (netcat/telnet)
```bash
nc 192.168.1.100 3001  # Raw socket port
```

## Tool Usage Patterns

### Ollama Integration

**JSON Mode Generation**:
```typescript
const response = await ollama.generate({
  model: MODEL,
  prompt: "Your prompt here",
  format: "json",  // Forces JSON output
  options: {
    temperature: 0.3,
    num_predict: 100
  }
})
const decision = JSON.parse(response.response)
```

**Chat Completion**:
```typescript
const response = await ollama.chat({
  model: MODEL,
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ],
  options: {
    temperature: 0.7,
    num_predict: 150
  }
})
```

### Honcho SDK Patterns

**Session Context**:
```typescript
const session = await honcho.session(sessionId)
const context = await session.getContext({
  summary: true,          // Include conversation summary
  tokens: 5000,          // Context window size
  lastUserMessage: msg,  // Latest message
  peerTarget: username   // Focus on specific peer
})
```

**Peer Psychology**:
```typescript
const peer = await honcho.peer(agentName)
const response = await peer.chat(question, {
  sessionId: sessionId,
  target: targetUsername  // Who to analyze
})
```

**Semantic Search**:
```typescript
const results = await session.search(query)
// Returns array of relevant messages
```

### Socket.IO Patterns

**Server-Side**:
```typescript
// Broadcast to all
io.emit('message', messageObject)

// Send to specific socket
socket.emit('session_id', sessionId)

// Listen for events
socket.on('chat', async (data) => {
  // Handle chat message
})
```

**Client-Side**:
```typescript
// Connect
const socket = io(SERVER_URL)

// Emit events
socket.emit('register', { username, type })
socket.emit('chat', { content })

// Listen for events
socket.on('message', (message) => {
  // Handle incoming message
})
```

## Build and Deployment

### Development Mode
```bash
bun dev  # Auto-restarts on file changes
```

### Production Build
```bash
bun build src/server/index.ts --outdir ./dist --target bun
```

Creates optimized bundle in `dist/` directory.

### Type Checking
```bash
bun type-check  # Runs tsc --noEmit
```

No JavaScript output, just type validation.

## Testing Strategy

### Current State
- No formal test suite yet
- Manual testing via client connections
- Agent behavior testing via sample agents

### Future Testing
- Unit tests for utilities
- Integration tests for Socket.IO handlers
- Agent decision testing with mock LLM responses
- End-to-end conversation testing

## Performance Characteristics

### Startup Time
- Server: < 1 second
- Client: < 500ms
- Agent: ~2-3 seconds (includes LLM warmup)

### Response Times
- Message broadcast: < 10ms
- Agent decision: 1-3 seconds (LLM dependent)
- Context retrieval: 100-500ms (Honcho)
- Semantic search: 200-800ms (Honcho + vectors)

### Resource Usage
- Server RAM: ~50MB base
- Agent RAM: ~100MB + LLM overhead
- Ollama RAM: 4-8GB (model dependent)
- Network: < 1MB/hour typical usage

## Security Considerations

### Current Security Model
- **Trust-based**: No authentication
- **LAN-only**: Not exposed to internet
- **No encryption**: Plain text messages
- **No rate limiting**: Unlimited messages

### Assumptions
- Trusted network environment
- Known participants
- Controlled access to LAN
- No sensitive data in messages

### Future Security Enhancements
- Optional authentication
- TLS/SSL for encryption
- Rate limiting per user
- Message filtering/moderation

## Debugging and Monitoring

### Logging
- **Server**: Console logs with color coding
- **Agents**: Decision reasoning logged
- **Errors**: Stack traces printed

### Available Tools

**monitor.ts**: Session monitoring
```bash
bun run monitor
```

**visualize-reps.ts**: Representation visualization
```bash
bun run visualize
```

### Debug Environment
```bash
# Verbose logging (if implemented)
DEBUG=* bun start

# Check Ollama
ollama list  # Show installed models
ollama ps    # Show running models

# Check Honcho
curl http://localhost:8000/health
```

## Common Issues and Solutions

### Issue: "Connection refused"
**Cause**: Server not running or wrong port
**Solution**: Verify server running on correct port

### Issue: "Ollama not found"
**Cause**: Ollama service not running
**Solution**: `ollama serve` in separate terminal

### Issue: "Model not found"
**Cause**: Model not downloaded
**Solution**: `ollama pull llama3.1:8b`

### Issue: "Honcho warnings"
**Cause**: Honcho service unavailable
**Solution**: Start Honcho or use basic mode (warnings are normal)

### Issue: "Empty agent responses"
**Cause**: Model temperature too low or wrong model
**Solution**: Check MODEL env var, adjust temperature

### Issue: "Agent not responding"
**Cause**: Decision logic filtered response
**Solution**: Check decision logs, adjust `shouldRespond` logic
