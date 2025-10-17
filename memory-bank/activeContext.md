# Active Context: LANChat

## Current Work Focus

### Memory Bank Initialization
**Status**: Just completed
**Date**: October 17, 2025

I've just initialized the Memory Bank system for LANChat. This is the foundation for maintaining context across my sessions, as my memory resets between sessions.

### Project Status
The LANChat project appears to be in a **functional state** with core features implemented:
- Server running with Socket.IO
- Terminal client working
- Base agent class with decision-making framework
- Sample agents with different personalities
- Integration with Ollama and Honcho SDK

## Recent Changes

### Memory Bank Creation (Just Now)
Created complete Memory Bank structure:
- ✅ `projectbrief.md` - Foundation document
- ✅ `productContext.md` - Why and how the project works
- ✅ `systemPatterns.md` - Architecture and design patterns
- ✅ `techContext.md` - Technology stack and setup
- ✅ `activeContext.md` - This file (current state)
- ✅ `progress.md` - Next to be created

## Next Steps

### Immediate
1. Complete Memory Bank initialization by creating `progress.md`
2. Review any open issues or TODO items in the codebase
3. Understand what the user wants to work on next

### Future Considerations
- Potential enhancements to agent decision-making
- Additional sample agents with different capabilities
- Integration with other LLM providers
- Web-based UI for easier access
- Enhanced testing framework

## Active Decisions and Considerations

### Honcho Service Integration
**Current State**: Optional integration with warnings
- Server runs without Honcho but displays warnings
- Agents can function in basic mode without psychology/search features
- Consider: Making the fallback more graceful or clear

### Agent Decision Logic
**Current Implementation**: Multi-stage pipeline
1. Should respond? (binary decision)
2. Choose action (psychology, search, or respond)
3. Execute and accumulate context
4. Generate final response

**Consideration**: The recursive approach with tracker prevents infinite loops but may need refinement for complex scenarios.

### Message Types
**Current**: Multiple message types (chat, agent_response, agent_data, system, join, leave)
**Usage**: Not all types are fully utilized yet - `agent_data` seems underused

### Client Connection Methods
**Working**: Terminal client, netcat, telnet
**Consideration**: Raw TCP connections may need better protocol handling

## Important Patterns and Preferences

### Code Organization
- Clear separation of concerns (server, client, agent layers)
- TypeScript types in dedicated `types.ts` file
- Sample agents in separate directory for easy reference
- Modular Socket.IO setup in `socket.ts`

### Agent Philosophy
- Agents should be autonomous decision-makers
- Context-aware, not rule-based responses
- Natural conversation flow
- Psychology-informed interactions

### Development Workflow
- Use Bun for everything (not Node.js)
- Native TypeScript without build step
- Development mode with auto-restart (`bun dev`)
- Type checking separate from runtime

### Error Handling
- Graceful degradation when services unavailable
- Clear error messages and warnings
- Console logging for debugging
- Color-coded terminal output

## Learnings and Project Insights

### What Works Well

1. **Bun Integration**: Fast startup, native TypeScript is excellent
2. **Socket.IO**: Reliable real-time communication, reconnection works well
3. **Ollama**: Local LLM inference is fast and cost-free
4. **Agent Architecture**: The decision pipeline pattern is clean and extensible
5. **Multiple Connection Methods**: Flexibility in how users connect is valuable

### What Could Be Improved

1. **Chat History**: Array grows unbounded, needs limiting
2. **Error Messages**: Could be more user-friendly
3. **Agent Response Time**: 1-3 seconds can feel slow
4. **Context Overflow**: Long conversations may exceed LLM context windows
5. **Testing**: No formal test suite yet

### Key Technical Insights

1. **Decision Pipeline**: The tracker pattern prevents infinite recursion while allowing flexible context gathering
2. **Honcho Integration**: Session persistence is key for long-term agent memory
3. **JSON Mode**: Using Ollama's JSON mode for structured decisions is reliable
4. **Peer Psychology**: The dialectic system (asking questions about users) is powerful for understanding
5. **Context Building**: Progressive accumulation from multiple sources works well

### Project Characteristics

- **Experimental Nature**: This is a research/prototype project
- **AI-First Design**: Built around agent intelligence, not just chat
- **LAN-Focused**: Security through network isolation
- **Developer-Friendly**: Easy to extend and experiment with
- **Minimal Dependencies**: Uses what's needed, nothing more

## Current File State

### Recently Modified
- All Memory Bank files just created
- `src/server/index.ts` was noted as recently modified (auto-save?)

### Open in Editor
- `src/server/socket.ts`
- `src/server/index.ts`
- `node_modules/@honcho-ai/core/core.js` (reference)
- Memory Bank files (just created)

### Pending Investigation
- Need to check if there are any open TODOs in the codebase
- Review recent git commits to understand latest changes
- Check if there are any outstanding issues or bugs

## Environment Notes

### System
- **OS**: macOS
- **IDE**: Visual Studio Code
- **Shell**: zsh
- **Working Directory**: `/Users/abbyspig/Documents/CodingProjects/LANChat`

### Services Required
- **Ollama**: Must be running for agents (`ollama serve`)
- **Honcho**: Optional but recommended for full features
- **Server**: Run with `bun start` or `bun dev`

### Git Repository
- Remote: `https://github.com/ajspig/LANChat.git`
- Latest commit: `289d01d8d7cb16796806bcaa33813729b1eb70bd`

## Questions for User

When the user returns, I should understand:
1. What specific feature or improvement they want to work on
2. Are there any known bugs or issues to address?
3. Do they want to add new functionality or refine existing features?
4. Is there a specific agent behavior they want to enhance?

## Development Workflow Documentation

### Tools Used
- **Primary AI Assistant**: Cline (via VSCode extension)
- **IDE**: Visual Studio Code
- **Runtime**: Bun (replaces Node.js)
- **Version Control**: Git (GitHub)
- **Local LLM**: Ollama
- **AI Framework**: Honcho SDK

### Current Workflow
1. Cline reads Memory Bank at session start
2. Work on tasks with iterative tool use
3. Document changes in activeContext.md
4. Update progress.md with completed work and tech debt
5. User reviews and provides feedback

### Work Documentation Process
As I code, I document:
- **Decisions made**: Why I chose a specific approach
- **Patterns discovered**: Reusable solutions
- **Issues encountered**: Bugs, blockers, workarounds
- **Code artifacts**: Important snippets, diagrams, notes
- **Tech debt**: Shortcuts taken, future improvements needed

All documentation goes into activeContext.md (current work) and progress.md (long-term tracking).

## Memory Bank Meta

This activeContext.md file should be updated:
- After significant changes to the codebase
- When starting new features
- When discovering important patterns
- When user requests "update memory bank"
- To reflect current work in progress
- **After each coding session** to document work completed
- **When encountering tech debt** to track for future resolution

The Memory Bank is my only persistence between sessions. It must be kept accurate and detailed.
