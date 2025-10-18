# Active Context: LANChat

## Current Session Information
**Date**: October 18, 2025
**Focus**: React frontend completed and running locally
**Status**: Frontend dev server active at http://localhost:5173/

## Recent Developments

### Honcho Insights Panel Implementation (October 18, 2025) ✅
**Achievement**: Full Honcho insights integration with real-time data display

**What Was Built**:
- **Three insight components** in the collapsible panel:
  - **SessionSummary**: Displays session overview with short/full summaries
    - Auto-refreshes every 10 seconds
    - Expandable to show full context
    - Shows message count and last updated time
  - **PeerKnowledge**: Shows what topics each participant has discussed
    - Auto-refreshes every 15 seconds
    - Highlights recent topics with "NEW" badge
    - Lists up to 5 topics per peer
  - **RelationshipDynamics**: Displays peer-to-peer relationships
    - Auto-refreshes every 20 seconds
    - Shows sentiment analysis (positive/neutral/negative)
    - Color-coded with emojis for quick scanning
    - Groups relationships by perspective

**Backend API Endpoints** (added to socket.ts):
- `get_session_summary`: Returns Honcho session context with summary
- `get_peer_knowledge`: Queries each peer about discussed topics
- `get_peer_relationships`: Analyzes relationships between all peers with sentiment

**Technical Implementation**:
- Socket.IO event-based communication
- Automatic polling at different intervals per component
- Graceful error handling with fallback messages
- Loading states for better UX
- Simple sentiment analysis using keyword matching

### React Frontend Complete (October 18, 2025) ✅
**Achievement**: Fully functional web interface built and running

**What Was Built**:
- **React + TypeScript + Vite** setup
- **Socket.IO client** integration for real-time messaging
- **All-in-one Chat component** with:
  - Message list with auto-scroll
  - User badges showing humans (👤) and agents (🤖)
  - User selector dropdown for switching between participants
  - Message input with send button
  - Session ID display
  - Real-time message timestamps
- **Collapsible Insights panel** with three Honcho-powered components
- **Dark/light theme system** with localStorage persistence
- **Monospace/ASCII aesthetic** (terminal-like, no colors)
- **Username modal** on first load (auto-generate or custom)
- **Auto-detect backend** server connection (port 5173 → 3000)
- **Production ready**: Docker + nginx + Fly.io configuration

**Development Environment Setup**:
- Upgraded to Node 20 via Homebrew (`brew install node@20`)
- Added Node 20 to PATH in ~/.zshrc
- Reinstalled npm dependencies with correct Node version
- Dev server running at http://localhost:5173/
- Backend should be running at http://localhost:3000/

**File Structure**:
```
frontend/
├── src/
│   ├── components/
│   │   ├── Chat.tsx                    # All-in-one chat component
│   │   ├── Insights.tsx                # Collapsible insights panel container
│   │   ├── SessionSummary.tsx          # Session overview with summaries
│   │   ├── PeerKnowledge.tsx           # Topic tracking per peer
│   │   └── RelationshipDynamics.tsx    # Peer relationship analysis
│   ├── hooks/
│   │   └── useSocket.ts      # Socket.IO connection logic
│   ├── types.ts              # TypeScript types matching backend
│   ├── styles.css            # Monospace aesthetic styling
│   ├── App.tsx               # Main app with theme toggle
│   └── main.tsx              # Entry point
├── Dockerfile                # Multi-stage production build
├── nginx.conf                # Nginx configuration
├── fly.toml                  # Fly.io deployment config
└── index.html
```

**Design Decisions**:
- **Monospace fonts**: Monaco, Courier New for terminal aesthetic
- **Minimal colors**: Only grays/blacks/whites, no color-heavy design (except sentiment indicators)
- **Simple borders**: CSS borders instead of heavy ASCII art
- **Subtle distinctions**: Dashed borders for agents vs solid for humans
- **User switching**: Dropdown allows sending messages as different participants
- **Single session**: One chat interface matches backend's single Honcho session
- **Auto-refreshing insights**: Different intervals per component (10s/15s/20s) to balance freshness and load
- **Graceful degradation**: Loading states and error messages when Honcho unavailable

**Next Steps**:
1. Test full integration (frontend + backend + agents + insights)
2. Enhance sentiment analysis algorithm
3. Add more insight visualizations (charts, graphs)
4. Deploy to Fly.io
5. Add comprehensive testing
6. Optimize Honcho API call frequency

### Agent Timeout Errors (October 17, 2025) - RESOLVED ✅
**Symptom**: Agents experiencing TimeoutError (code 23) and slow response times

**Root Cause**: Local Ollama (llama3.1:8b) was too slow for real-time chat interactions

**Solution Implemented**: Switched to OpenRouter API with GPT-4o-mini
- Added OpenRouter integration to `src/agent.ts`
- Modified all LLM-dependent methods: `shouldRespond()`, `decideAction()`, `generateResponse()`
- Created `callOpenRouter()` helper method for API calls
- Environment configuration in `.env`:
  - `USE_OPENROUTER=true`
  - `MODEL=openai/gpt-4o-mini`
  - `OPENROUTER_API_KEY=sk-or-v1-...`

**Results**:
- Response times improved from 30+ seconds to 4-9 seconds
- All three test queries responded successfully
- Agent decision-making and response generation working correctly
- Honcho integration verified and working
- Chat history properly logged

## Current Development Status

### What's Running
- ✅ **Backend server**: Should be at http://localhost:3000/ (with Honcho insights API)
- ✅ **Frontend dev server**: http://localhost:5173/ (with insights panel)
- ⏳ **Demo agents**: WellnessCoach, NutritionExpert, and MindfulnessGuide auto-start with server
- ⏳ **Additional agents**: Can be started with `bun run agent <name>`
- ⏳ **Ollama**: Can be running for local LLM (optional with OpenRouter)

### Testing the Full Stack
To test the complete system:

1. **Start backend** (in root directory):
   ```bash
   bun run dev
   ```

2. **Start frontend** (already running):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Start an agent** (in another terminal):
   ```bash
   bun run agent TestBot
   ```

4. **Open browser**: http://localhost:5173/
   - Enter a username
   - Send messages
   - Watch for agent responses

### Integration Points

**Frontend ↔ Backend**:
- Frontend connects via Socket.IO to `http://localhost:3000`
- Auto-detection replaces port 5173 with 3000
- Events: `connect`, `register`, `chat`, `message`, `history`, `session_id`, `get_users`

**Backend ↔ Agents**:
- Agents connect as clients with type "agent"
- Receive `agent_event` notifications
- Can emit `agent_response` messages

**Backend ↔ Honcho**:
- Session management
- Peer psychology
- Message history
- Semantic search

## Known Issues & Workarounds

### Frontend
- **Node version**: Requires Node 20+ (now set up)
- **Port detection**: Uses simple port replacement (5173 → 3000)
- **Production URL**: Will need manual configuration for non-local deployments

### Backend
- **Unbounded chat history**: Memory grows with conversations
- **Single session**: One Honcho session per server instance
- **No persistence**: Messages lost on restart

### Integration
- **CORS**: May need configuration for production
- **WebSocket**: Fallback to polling if WebSocket fails
- **Reconnection**: Frontend handles reconnection, but messages during disconnect are lost

## Environment Configuration

### Backend (.env)
```bash
# Honcho
HONCHO_BASE_URL=https://api.honcho.dev
HONCHO_API_KEY=your-key
HONCHO_WORKSPACE_ID=your-workspace

# AI Model
USE_OPENROUTER=true
MODEL=openai/gpt-4o-mini
OPENROUTER_API_KEY=your-key

# Or use local Ollama
USE_OPENROUTER=false
MODEL=llama3.1:8b
```

### Frontend
No environment variables needed for local development. Frontend auto-detects backend at port 3000.

For production, update `src/hooks/useSocket.ts`:
```typescript
const serverUrl = window.location.origin.replace(':5173', ':3000');
```

## Immediate Priorities

1. **Test full stack integration**
   - Frontend sending messages ✅
   - Backend receiving and broadcasting ✅
   - Agents responding appropriately ⏳
   - Insights panel data display ✅

2. **Enhance insights panel**
   - ✅ Display Honcho session summaries
   - ✅ Show peer knowledge state
   - ✅ Display relationship dynamics
   - ⏳ Add visualization (charts/graphs)
   - ⏳ Improve sentiment analysis algorithm

3. **Deploy to Fly.io**
   - Test Docker build
   - Deploy backend + frontend
   - Configure production URLs
   - Test Honcho integration in production

4. **Add testing**
   - Component tests for insights (Vitest ready)
   - Integration tests for Socket.IO events
   - E2E tests for full chat flow

## Recent Commands

```bash
# Node upgrade
brew install node@20
echo 'export PATH="/usr/local/opt/node@20/bin:$PATH"' >> ~/.zshrc

# Frontend setup
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Active Issues
None blocking - ready for testing and deployment!

## Questions for Next Session
1. Should we add authentication?
2. What Honcho insights to show first?
3. Deploy to Fly.io now or add more features?
4. Need more sample agents?

---

**Last Updated**: October 18, 2025 at 1:08 PM EDT
