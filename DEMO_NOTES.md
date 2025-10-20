# LANChat Demo Notes

**Project**: Real-time LAN Chat with AI Agent Integration  
**Developer**: Built with Cline (Claude Sonnet 4.5)  
**Timeline**: ~11 days of development  
**Repository**: https://github.com/ajspig/LANChat

---

## Development Notes & Workflow

### Tools Used

**Primary Development:**
- **Cline (Claude Sonnet 4.5)** - AI coding assistant
  - Why: Had leftover credits from hackathon, wanted to compare with Claude Code (use at work)
  - Used for: Feature implementation, bug fixing, refactoring, documentation
  - Strengths: Great for exploratory coding, understanding existing codebases
  - Weaknesses: Sometimes needed more business context, required manual code review

**Development Stack:**
- **VS Code** - Primary IDE
- **Bun** - Runtime & package manager (faster than Node.js, native TypeScript)
- **Git/GitHub** - Version control
- **Fly.io** - Deployment (both frontend and backend)

**Frontend:**
- React + TypeScript + Vite
- Socket.IO Client
- CSS Modules

**Backend:**
- Bun runtime
- Hono web framework (lighter/faster than Express)
- Socket.IO Server
- Honcho AI SDK (memory management & Dialectic)
- OpenRouter API (recommended) or Ollama (local)

### Typical Development Flow

1. **Planning with Cline (PLAN mode)**
   - Discuss feature requirements
   - Explore existing code structure
   - Plan implementation

2. **Implementation (ACT mode)**
   - Generate code with Cline
   - Iterative refinement
   - Real-time testing in browser

3. **Testing**
   - Manual testing (no automated tests yet - tech debt!)
   - Agent behavior verification in logs

4. **Deployment**
   - `git push` to GitHub
   - `fly deploy` for backend/frontend
   - Monitor with `fly logs`

### Key Decisions & Rationale

**Why Fly.io?**
- Free tier for demos
- Simple deployment (`fly deploy`)
- Built-in SSL and load balancing

**Why Bun over Node.js?**
- Faster startup times
- Native TypeScript (no build step)
- Want to explore newer tech
- Trade-off: Smaller community

**Why Honcho AI?**
- Sophisticated memory management
- Dialectic system for psychology modeling
- Built for multi-agent systems
- Trade-off: External dependency, learning curve

**Why OpenRouter over Ollama?**
- Faster response times
- No local setup
- Multiple model options
- Trade-off: Costs money vs. Ollama being free

---

## Architecture Diagrams

### System Overview
```
┌─────────────────────────────────────┐
│   Frontend (React + Socket.IO)     │
│   - Chat UI                         │
│   - Insights Panel                  │
│   - Live User List                  │
└─────────────┬───────────────────────┘
              │ WebSocket
              ▼
┌─────────────────────────────────────┐
│   Backend (Bun + Hono + Socket.IO)  │
│   - Message Broadcasting            │
│   - Agent Management                │
│   - Session Handling                │
└─────┬───────────────────┬───────────┘
      │                   │
      ▼                   ▼
┌──────────┐        ┌─────────────┐
│  Honcho  │        │ OpenRouter  │
│   AI     │        │  /Ollama    │
│ (Memory) │        │   (LLM)     │
└──────────┘        └─────────────┘
```

### Agent Decision Flow
```
Message Received
    │
    ▼
Get Context (Honcho)
    │
    ▼
Should Respond? ──NO──> END
    │ YES
    ▼
Choose Action:
├─ Psychology Query
├─ Semantic Search  
└─ Direct Response
    │
    ▼
Generate Response (LLM)
    │
    ▼
Broadcast & Save
```

### Insights Data Flow
```
Frontend Requests Insights
    │
    ├─ Session Summary
    │   └─> Honcho context summarization
    │
    ├─ Peer Knowledge
    │   └─> Honcho Dialectic: "What topics discussed?"
    │
    └─ Relationship Dynamics
        └─> For each user pair:
            Dialectic query: "What's your relationship with X?"
            Sentiment analysis (keyword matching)
            Return matrix of relationships
```

---

## Issues & Tech Debt

### 1. Agent Registration as Users
**Issue**: Agents registered as `type: 'agent'` users, not separate entity

**Why confusing**: Semantically unclear, mixes concerns

**Why done this way**: Simplified MVP, agents need session IDs like users

**Decision**: Keep for now, refactor if needed later

### 2. Ollama/OpenRouter Configuration Mess
**Issue**: Duplicated code with if/else for two providers

**Current**:
```typescript
if (USE_OPENROUTER) {
  responseText = await this.callOpenRouter([...]);
} else {
  const response = await this.ollama.generate({...});
  responseText = response.response;
}
```

**Better approach**: Strategy pattern with `LLMProvider` interface

**Status**: Known tech debt, needs refactor

### 3. Agent Echo Chambers
**Issue**: Agents can loop talking to each other endlessly

**Attempts to fix**:
- Check if sender is agent, reduce response probability ✅ (partially works)
- Honcho's `observeOthers` config ❌ (didn't see difference, unclear docs)
- Psychology query caching ✅ (helps)

**Still needed**:
- Response rate limiting per time window
- Turn-taking protocol
- Better understanding of Honcho features

### 4. Slow Insights Panel
**Issue**: Takes 4-6 seconds to load, blocks UI

**Root causes**:
- No loading states
- No caching
- Synchronous API calls
- Fresh generation every time

**Solutions planned**:
- Add loading spinners
- Cache results (5-min TTL)
- Background fetching
- Optimize queries

### 5. Honcho's observeOthers Feature Confusion
**What I tried**:
```typescript
await session.setPeerConfig(agentPeer, { 
  observeOthers: true,
  observeMe: false 
});
```

**Expected**: WellnessCoach wouldn't be observed by others

**Actual**: No visible difference in behavior

**Issue**: Honcho docs limited, unclear what "observe" means, no debugging tools

**Workaround**: Manual filtering in decision logic

### 6. No Testing
**Missing**:
- Unit tests (agent logic)
- Integration tests (Socket.IO)
- E2E tests (user flows)
- Agent behavior tests

**Impact**: Harder to refactor, manual regression testing

**Priority**: High for next phase

### 7. Multiple Human Users Removed
**Original plan**: Support multiple humans in same chat

**Why removed**: 
- Added complexity to session management
- Unclear UX for joining
- Demo didn't need it

**Current**: One human + multiple agents per session

### 8. Hardcoded Agent Configuration
**Issue**: Agent personalities in source code, can't change without redeploy

**Wanted**: JSON config files for agent personalities

**Status**: Nice-to-have for future

---

## Feature Highlights

### Live User Updates
- Real-time list showing who's connected
- 👤 for humans, 🤖 for agents
- Updates on join/leave

### Intelligent Agent Responses
Agents use 4-step decision process:
1. Should I respond? (not just keyword matching)
2. What action? (respond/analyze/search)
3. Gather context if needed
4. Generate response

Context sources:
- Honcho conversation summary
- Dialectic psychology queries
- Semantic search of history
- Real-time messages

### Honcho Insights Panel
Three views:
1. **Session Summary** - High-level conversation overview (every 20/60 messages)
2. **Peer Knowledge** - What system knows about each participant
3. **Relationship Dynamics** - How participants relate to each other

**How relationships work**:
- Query Honcho Dialectic for each user pair
- "What is your relationship with [User]?"
- AI generates description from conversation history
- Keyword-based sentiment analysis (positive/neutral/negative)
- Display as relationship matrix

Code: `src/server/socket.ts` (get_peer_relationships handler)

---

## Lessons Learned

### What Went Well ✅
- Cline excellent for exploratory coding and understanding codebases
- Fly.io deployment super smooth
- Honcho powerful for memory and psychology
- Socket.IO reliable for real-time

### What Was Challenging ⚠️
- Tuning agent response frequency (still not perfect)
- Honcho docs limited for advanced features (observeOthers)
- Performance optimization (insights panel)
- No automated testing (manual testing time-consuming)

### Key Takeaways 💡
1. **AI-assisted dev**: Review all generated code, iterate in PLAN mode first
2. **Agent design**: Start simple, add complexity gradually, monitor behavior
3. **Real-time apps**: Think about state sync early, plan for disconnections
4. **External services**: Have fallbacks, cache aggressively, understand rate limits
5. **Demo-driven dev**: Build impressive features first, document limitations

---

## Quick Reference

**Deploy Backend:**
```bash
fly deploy --app lanchat-backend
fly logs --app lanchat-backend
```

**Deploy Frontend:**
```bash
cd frontend && fly deploy --app lanchat-frontend
```

**Local Development:**
```bash
bun install
bun dev              # Start server
bun run agent Name   # Start agent
```

**Environment Variables:**
```bash
HONCHO_API_KEY=xxx
OPENROUTER_API_KEY=xxx
USE_OPENROUTER=true
MODEL=openai/gpt-4o-mini
ENABLE_DEMO_AGENTS=true
```

---