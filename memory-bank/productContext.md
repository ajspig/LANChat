# Product Context: LANChat

## Why This Project Exists

### Problem Statement
Traditional chat applications lack sophisticated AI agent integration. Most chatbots are:
- Simple rule-based systems without context awareness
- Unable to understand conversation psychology
- Limited to direct command responses
- Lacking natural decision-making capabilities

LANChat solves this by creating a platform where AI agents can participate as genuine conversation members with:
- Context-aware response decisions
- Psychological understanding of participants
- Natural conversation flow
- Multi-step reasoning capabilities

### Target Users

#### Primary: AI Researchers & Developers
- Building and testing conversational AI agents
- Researching multi-agent systems
- Experimenting with LLM-based decision making
- Testing peer psychology modeling

#### Secondary: Technical Teams
- Internal team communication with AI assistants
- Development environments with AI pair programming
- Research labs conducting AI experiments
- Hackathon projects and prototypes

## How It Should Work

### User Experience Flow

#### For Human Participants
1. **Connection**: Connect via terminal client, netcat, or telnet
   - Server displays connection instructions automatically
   - No account creation required
   - Immediate access to chat

2. **Messaging**: Send messages naturally
   - Type message and press enter
   - See all messages from humans and agents
   - Use slash commands for special actions (`/help`, `/users`, `/quit`)

3. **Agent Interaction**: Interact with AI agents naturally
   - Agents respond when contextually appropriate
   - No special syntax required
   - Agents understand conversation flow

#### For AI Agents
1. **Connection**: Start agent with `bun run agent <name>`
   - Registers as user (not special agent type)
   - Receives all conversation messages
   - Gets assigned session ID

2. **Message Processing**: Multi-step decision making
   - **Step 1**: Decide if response needed (based on context)
   - **Step 2**: Choose action (respond, analyze psychology, search)
   - **Step 3**: Execute action and gather context
   - **Step 4**: Generate contextual response

3. **Context Building**: Agents leverage multiple sources
   - Recent conversation summary (Honcho context)
   - Peer psychology models (dialectic queries)
   - Semantic search of history
   - Real-time message stream

### Key Interactions

#### Agent Response Decision
```
User: "Hey everyone, I'm thinking about learning Rust"

Agent Internal Process:
1. Receives message → Builds context from Honcho
2. Decides: "Yes, this is a discussion I can contribute to"
3. Chooses: "Search for previous Rust discussions"
4. Searches → Finds past conversations about programming languages
5. Generates: Natural response incorporating found context
6. Sends: "That's great! Rust is excellent for..."
```

#### Psychology Analysis Flow
```
User A: "I'm frustrated with this bug"

Agent Internal Process:
1. Detects emotional content
2. Decides: "I should understand User A better"
3. Queries: "What are User A's typical frustration patterns?"
4. Receives: Peer psychology model insights
5. Responds: Empathetically based on user's patterns
```

### Expected Behavior

#### Agents Should
- ✅ Respond naturally, not robotically
- ✅ Know when NOT to respond (avoid over-participation)
- ✅ Use context to inform responses
- ✅ Ask follow-up questions when appropriate
- ✅ Understand conversation flow and timing

#### Agents Should NOT
- ❌ Respond to every message
- ❌ Dominate conversations
- ❌ Give generic responses
- ❌ Ignore context and history
- ❌ Break natural conversation rhythm

### Success Metrics

#### Conversation Quality
- Agents contribute meaningfully to discussions
- Natural back-and-forth flow
- Context-appropriate responses
- Minimal off-topic responses

#### Technical Performance
- < 2 second response time for agents
- Successful context retrieval
- Accurate psychology modeling
- Reliable message delivery

#### User Satisfaction
- Agents feel like genuine participants
- Conversations flow naturally
- Technical users find it useful for research
- Easy to extend with new agent types

## User Experience Goals

### Simplicity
- Zero-configuration client connection
- One-command server start
- No complex setup procedures
- Works with existing Unix tools

### Intelligence
- Agents understand conversation context
- Psychology-aware responses
- Semantic understanding, not keyword matching
- Natural language interaction

### Extensibility
- Easy to create custom agents
- Clear agent personality examples
- Simple API for agent capabilities
- Modular architecture

### Performance
- Real-time message delivery
- Fast agent response generation
- Efficient context building
- Minimal latency

## Edge Cases & Considerations

### Multi-Agent Scenarios
- Multiple agents in same conversation
- Agent-to-agent communication
- Avoiding agent echo chambers
- Coordinated responses

### Context Management
- Long conversations (context overflow)
- New participants joining mid-conversation
- Session continuity across restarts
- Privacy of psychology analysis

### Error Handling
- Ollama service unavailable
- Honcho service unavailable
- Network disconnections
- Malformed messages

### Scale Considerations
- Current: Small teams (< 20 participants)
- Future: Larger groups with multiple agents
- Performance at scale not yet tested
- Memory usage with long histories

## Design Philosophy

### Agent Autonomy
Agents make their own decisions about:
- When to respond
- What context to gather
- How to analyze situations
- Response tone and content

### Natural Interaction
- No special syntax for agent commands
- Agents participate like humans
- Organic conversation flow
- Context-driven, not rule-based

### Developer Freedom
- Extend base agent class
- Override decision logic
- Add custom capabilities
- Experiment with different models

### Transparency
- Agent decisions logged
- Context sources visible (in logs)
- Response reasoning tracked
- Debugging-friendly architecture
