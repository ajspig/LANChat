# Demo Agents Guide

LANChat includes built-in AI agents that automatically participate in conversations to create an engaging demo experience.

## 🤖 Available Demo Agents

### NewsBot (Journalist)
- **Personality**: Enthusiastic journalist who loves interviewing people
- **Behavior**: 
  - Asks follow-up questions
  - References what others have said
  - Creates engaging group discussions
  - Uses interview techniques
  - Sometimes does "rapid-fire rounds"

### Socrates (Philosopher)
- **Personality**: Thoughtful philosopher who ponders deep questions
- **Behavior**:
  - Asks "why" and explores assumptions
  - Draws connections between ideas
  - Offers different perspectives
  - Uses analogies and metaphors
  - Encourages reflection

## 🚀 How It Works

When the backend server starts, it automatically:
1. Waits 2 seconds for the server to initialize
2. Connects NewsBot to the chat
3. Waits 1 second
4. Connects Socrates to the chat

Both agents:
- Connect via Socket.IO like normal clients
- Use Honcho AI for memory and context
- Use OpenRouter or Ollama for AI responses
- Have access to psychology analysis tools
- Can search conversation history
- Respond intelligently based on conversation context

## 🎯 Configuration

### Enable/Disable Demo Agents

**Environment Variable:**
```bash
ENABLE_DEMO_AGENTS=true   # Agents auto-start (default)
ENABLE_DEMO_AGENTS=false  # Agents disabled
```

**Fly.io Deployment:**
```bash
# To disable agents on fly.io
fly secrets set ENABLE_DEMO_AGENTS=false --app lanchat-backend

# To enable agents (or just omit, as true is default)
fly secrets set ENABLE_DEMO_AGENTS=true --app lanchat-backend
```

### Local Development

1. Make sure your `.env` file has the required AI credentials:
```bash
USE_OPENROUTER=true
MODEL=openai/gpt-4o-mini
OPENROUTER_API_KEY=your-key-here
HONCHO_API_KEY=your-key-here
HONCHO_BASE_URL=https://api.honcho.dev
HONCHO_WORKSPACE_ID=default
ENABLE_DEMO_AGENTS=true
```

2. Start the server:
```bash
bun run start
```

3. You should see:
```
🤖 Starting demo agents...
✅ NewsBot journalist agent started
✅ Socrates philosopher agent started
🎉 All demo agents running!
```

## 💬 Interacting with Demo Agents

1. **Join the chat** at http://localhost:5173 (or your deployed URL)
2. **Enter a username** to register
3. **Start chatting** - the agents will respond based on:
   - Whether the message is directed at them
   - If it's a question that needs answering
   - If their response would add value
   - Recent conversation context

### Tips for Best Results

- **Mention agents by name**: "Hey NewsBot, what do you think?"
- **Ask open-ended questions**: "What's everyone's opinion on..."
- **Reference previous messages**: "I agree with what Socrates said about..."
- **Keep conversations flowing**: Agents are designed to keep discussions going

## 🔧 Customizing Agents

### Modify Existing Agents

Edit `src/server/demo-agents.ts`:

```typescript
class JournalistAgent extends ChatAgent {
  constructor(name: string, serverUrl: string) {
    const journalistPrompt = `Your custom prompt here...`;
    
    super(name, journalistPrompt);
    this.temperature = 0.7;  // Creativity (0.0 - 1.0)
    this.responseLength = 150;  // Max response tokens
  }
}
```

### Add New Agents

1. Create a new class in `demo-agents.ts`:
```typescript
class ComedianAgent extends ChatAgent {
  constructor(name: string, serverUrl: string) {
    const comedianPrompt = `You are ${name}, a funny comedian...`;
    super(name, comedianPrompt);
    this.temperature = 0.9;
    this.responseLength = 120;
  }
}
```

2. Add to the `startDemoAgents` function:
```typescript
const comedian = new ComedianAgent("JokeBot", serverUrl);
await comedian.connect();
agents.push(comedian);
```

## 🧪 Testing Agents Locally

### Option 1: With Demo Agents (Automatic)
```bash
# Start server with auto-starting agents
ENABLE_DEMO_AGENTS=true bun run start

# In another terminal, start frontend
cd frontend
npm run dev
```

### Option 2: Manual Agent Testing
```bash
# Start server WITHOUT demo agents
ENABLE_DEMO_AGENTS=false bun run start

# In separate terminals, start agents manually
bun run src/sample-agents/journalist-agent.ts NewsBot --server=http://localhost:3000
bun run src/sample-agents/philosopher-agent.ts Socrates --server=http://localhost:3000
```

## 📊 Monitoring Agents

### Check Agent Activity

**Backend logs:**
```bash
fly logs --app lanchat-backend
```

Look for:
- `🤖 Starting demo agents...`
- `✅ NewsBot journalist agent started`
- `✅ Socrates philosopher agent started`
- `🤔 Decision: Yes/No - [reason]`
- `💭 Generating response...`
- `📤 Sending response: ...`

### View Connected Users

Visit your API endpoint:
```bash
curl https://lanchat-backend.fly.dev/api/users
```

Should show agents:
```json
{
  "users": [...],
  "agents": [
    {
      "id": "...",
      "username": "NewsBot",
      "type": "agent"
    },
    {
      "id": "...",
      "username": "Socrates",
      "type": "agent"
    }
  ]
}
```

## ⚠️ Troubleshooting

### Agents Not Appearing

1. **Check environment variable:**
   ```bash
   fly secrets list --app lanchat-backend
   ```
   Should show `ENABLE_DEMO_AGENTS` if set

2. **Check logs for errors:**
   ```bash
   fly logs --app lanchat-backend
   ```

3. **Verify AI credentials are set:**
   - `OPENROUTER_API_KEY` or Ollama running
   - `HONCHO_API_KEY` 
   - `USE_OPENROUTER=true`

### Agents Not Responding

1. **Check if agents are connected:**
   - Visit `/api/users` endpoint
   - Should see agents in the list

2. **Try mentioning them directly:**
   - "Hey NewsBot, what's up?"
   - "@Socrates what do you think?"

3. **Check AI model configuration:**
   - Ensure `MODEL` env var is set correctly
   - Verify API keys are valid
   - Check fly.io logs for API errors

### Agent Responses Too Slow

1. **Increase VM memory:**
   ```bash
   fly scale memory 1024 --app lanchat-backend
   ```

2. **Use a faster model:**
   ```bash
   fly secrets set MODEL=openai/gpt-3.5-turbo --app lanchat-backend
   ```

3. **Reduce response length:**
   Edit `src/server/demo-agents.ts` and decrease `responseLength`

## 🎨 Agent Personality Ideas

Some ideas for creating your own agents:

- **TechExpert** - Answers technical questions, explains concepts
- **Storyteller** - Shares stories and asks about others' experiences
- **DebateBot** - Plays devil's advocate, challenges assumptions
- **CoachBot** - Motivational, asks goal-oriented questions
- **PunMaster** - Makes puns and dad jokes
- **FactChecker** - Provides interesting facts and trivia
- **Therapist** - Empathetic listener, asks reflective questions

## 📝 Best Practices

1. **Keep prompts focused** - Clear personality and behavior guidelines
2. **Set appropriate temperature** - Lower (0.3-0.5) for consistency, higher (0.7-0.9) for creativity
3. **Limit response length** - Keep conversations flowing, avoid walls of text
4. **Test locally first** - Verify agent behavior before deploying
5. **Monitor costs** - Each agent response uses API tokens
6. **Use psychology tools wisely** - Agents can query Honcho for user insights

## 🔗 Related Files

- `src/server/demo-agents.ts` - Demo agent implementations
- `src/agent.ts` - Base agent class with all capabilities
- `src/sample-agents/` - Standalone agent examples
- `src/server/index.ts` - Server startup with agent initialization
