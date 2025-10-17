# Memory Bank Workflow Guide

## How Memory Bank Supports Your Development Directives

This guide explains how the Memory Bank system directly supports your three key directives for this project.

---

## Directive 1: Document Work as You Code

### How Memory Bank Handles This

#### During Active Development
As I work on features, I use **activeContext.md** as a living document to capture:

**Code Changes**:
```markdown
### Recent Changes

#### Feature: Agent Psychology Analysis (2025-10-17)
**Files Modified**: 
- `src/agent.ts` - Added analyzePsychology() method
- `src/types.ts` - Added PsychologyAnalysis interface

**Implementation Notes**:
- Used Ollama JSON mode for structured decision
- Integrated with Honcho peer.chat() for dialectic queries
- Tracker pattern prevents infinite recursion

**Code Snippet**:
```typescript
const dialectic = JSON.parse(response.response) as Dialectic
const dialecticResponse = await peer.chat(dialectic.question, {
  sessionId: this.sessionId,
  target: dialectic.target
})
```

**Why This Approach**:
- JSON mode ensures parseable responses
- Honcho peer model provides psychological insights
- Question-based approach is flexible
```

#### Design Decisions
```markdown
### Decision: Multi-Stage Agent Pipeline

**Date**: 2025-10-15
**Context**: Agents were responding too frequently
**Decision**: Implement shouldRespond() before processing
**Rationale**: 
- Agents need to decide WHEN to respond, not just WHAT
- Reduces over-participation in conversations
- More natural conversation flow
**Outcome**: 50% reduction in unnecessary responses
**Alternative Considered**: Rate limiting (rejected - too rigid)
```

#### Diagrams and Visual Documentation
When creating architecture diagrams or flow charts, I include them directly in the Memory Bank:

```markdown
### Agent Decision Flow
```
User Message
    ↓
shouldRespond() → [No] → Skip
    ↓ [Yes]
decideAction()
    ↓
[psychology] → analyzePsychology() → Accumulate Context → Recurse
[search] → search() → Accumulate Context → Recurse
[respond] → generateResponse() → Send Message
```
```

### Where Documentation Goes

| What to Document | Primary Location | Secondary Location |
|-----------------|-----------------|-------------------|
| Current feature work | activeContext.md | - |
| Architecture decisions | systemPatterns.md | activeContext.md (while active) |
| Code patterns discovered | systemPatterns.md | - |
| Implementation notes | activeContext.md | progress.md (after completion) |
| Diagrams/flowcharts | systemPatterns.md or activeContext.md | - |
| Quick notes/scratchpad | activeContext.md "Work Notes" section | - |

### Example Work Documentation Template

Add this to activeContext.md for each coding session:

```markdown
## Current Coding Session

### Session: [Feature Name] - [Date]

**Goal**: [What you're trying to accomplish]

**Approach**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Files Being Modified**:
- `path/to/file1.ts` - [purpose]
- `path/to/file2.ts` - [purpose]

**Key Decisions**:
- [Decision 1 and rationale]
- [Decision 2 and rationale]

**Code Patterns/Snippets**:
```typescript
// Important pattern discovered
const example = await someFunction()
```

**Issues Encountered**:
- [Issue 1 and how resolved]
- [Issue 2 and workaround]

**Next Steps**:
- [ ] Complete implementation
- [ ] Add error handling
- [ ] Test functionality
```

---

## Directive 2: Document Tools and Workflows

### How Memory Bank Handles This

#### Tool Documentation Location: activeContext.md

I maintain a "Development Workflow Documentation" section in activeContext.md:

```markdown
## Development Workflow Documentation

### Tools Used
- **Primary AI Assistant**: Cline (via VSCode extension)
  - Version: [version]
  - Capabilities: Multi-tool use, file operations, command execution
  - Limitations: Memory resets between sessions
  
- **IDE**: Visual Studio Code
  - Extensions: Cline, TypeScript, Prettier
  - Settings: Auto-format on save
  
- **Runtime**: Bun v1.x
  - Why: Native TypeScript, faster than Node.js
  - Commands: `bun run`, `bun dev`, `bun install`
  
- **Version Control**: Git + GitHub
  - Workflow: Feature branches → PR → main
  - Commit style: Conventional commits
  
- **Local LLM**: Ollama
  - Models: llama3.1:8b (primary), mistral (testing)
  - Port: 11434
  - Usage: Agent intelligence

### Current Workflow Steps

1. **Session Start**
   - Cline reads all Memory Bank files
   - Reviews activeContext.md for current state
   - Checks progress.md for known issues
   
2. **Development Cycle**
   - Use Cline tools: read_file, write_to_file, replace_in_file
   - Test with: `bun dev` (auto-reload)
   - Verify with: `bun type-check`
   
3. **Documentation**
   - Update activeContext.md during work
   - Add code snippets and decisions
   - Track issues in progress.md
   
4. **Completion**
   - Move completed work from activeContext → progress
   - Update tech debt tracking
   - Commit changes

### Tool-Specific Notes

**Cline Patterns**:
- Always read files before modifying
- Use replace_in_file for targeted edits
- Use write_to_file for new files or major rewrites
- Execute commands with requires_approval: false for safe ops

**Bun Specifics**:
- Use `Bun.env` not `process.env`
- Top-level await works everywhere
- Native TypeScript - no build step
- `import.meta.main` for script detection

**Ollama Integration**:
- JSON mode: `format: "json"` in options
- Temperature affects response variability
- num_predict limits token generation
- Streaming available but not used yet
```

### Workflow Diagram Storage

Store workflow diagrams in either activeContext.md (if current) or systemPatterns.md (if established):

```markdown
## Development Workflow Diagram

```
┌─────────────────────────────────────────┐
│         Cline Development Cycle          │
└─────────────────────────────────────────┘
            │
            ▼
    [Read Memory Bank]
            │
            ▼
    [Understand Context]
            │
            ▼
    [Work on Feature]
     │           │
     ▼           ▼
[Code]      [Document]
     │           │
     └─────┬─────┘
           ▼
    [Update Memory Bank]
           │
           ▼
    [Commit Changes]
```
```

---

## Directive 3: Document Issues and Tech Debt

### How Memory Bank Handles This

#### Issues Tracking: progress.md

All issues, bugs, and tech debt are tracked in **progress.md** with this structure:

```markdown
## Known Issues 🐛

### Critical Issues
[Issues that block core functionality]

### High Priority Issues
1. **Unbounded chat history**
   - **Impact**: Memory grows indefinitely
   - **Severity**: Medium
   - **Workaround**: Restart server periodically
   - **Fix needed**: Implement rolling history with limit
   - **Estimated effort**: 2-3 hours
   - **Assigned to**: Next sprint
   - **Related files**: `src/server/index.ts`, `src/server/socket.ts`

### Medium Priority Issues
[Important but not urgent]

### Low Priority Issues / Edge Cases
[Nice to fix but not critical]

## Technical Debt 💳

### High Priority Debt
- **Chat history management**
  - Created: 2025-10-15
  - Reason: Quick implementation during prototype
  - Impact: Memory leak in long-running servers
  - Solution needed: Circular buffer or database
  - Effort: Medium (3-4 hours)

### Medium Priority Debt
- **Code duplication in sample agents**
  - Location: `src/sample-agents/*.ts`
  - Pattern: Each agent copies base logic
  - Better approach: Shared utility functions
  - Effort: Low (1-2 hours)

### Low Priority Debt
- **Hard-coded configuration**
  - Examples: Port numbers, timeouts
  - Should be: Environment variables or config file
  - Effort: Low (1 hour)
```

#### Real-Time Issue Tracking During Development

When I encounter an issue while coding, I immediately document it in **activeContext.md**:

```markdown
## Issues Encountered This Session

### Issue: Agent Empty Responses (2025-10-17 4:15 PM)
**Symptom**: Agent occasionally sends empty messages
**Discovery**: While testing philosopher agent
**Context**: Happens after psychology analysis
**Debug attempts**:
1. Checked Ollama logs - no errors
2. Added console logging - response.message.content is empty string
3. Checked model temperature - set to 0.7

**Root cause hypothesis**: 
- Model sometimes generates only tool calls, no content
- Content extraction may fail silently

**Temporary workaround**: 
```typescript
const content = response.message?.content?.trim()
if (!content) {
  console.error("Empty response from Ollama")
  return
}
```

**Permanent fix needed**: 
- Better response validation
- Retry logic with different prompt
- Fallback response

**Tech debt created**: Quick fix without proper error handling
**Tracked in**: progress.md under "Known Issues"
```

#### Tech Debt Creation Log

When I take shortcuts or make quick fixes, I log them:

```markdown
## Tech Debt Created This Session

### Date: 2025-10-17
**Feature**: Agent decision pipeline
**Debt Item**: Recursive decideAction without depth limit
**Why taken**: Needed to ship the feature, tracker prevents most issues
**Risk**: Edge case of complex decision chains could cause stack overflow
**Mitigation**: Tracker prevents infinite loops (one action type per call)
**To fix**: Add depth counter, max 3 recursive calls
**Priority**: Low (hasn't caused issues yet)
**File**: `src/agent.ts:125`
```

### Issue Discovery Process

```
Issue Discovered During Coding
        ↓
Document immediately in activeContext.md
        ↓
Assess severity & impact
        ↓
Quick fix with workaround? → Document as tech debt
        ↓
Proper fix? → Implement & document in progress.md
        ↓
Cannot fix now? → Add to progress.md backlog
```

---

## Complete Documentation Workflow

### When Starting a Coding Session

1. **Read Memory Bank** (5-10 minutes)
   - Read all 6 core files in order
   - Focus on activeContext.md (current state)
   - Review progress.md (known issues)

2. **Create Session Section** in activeContext.md
   ```markdown
   ## Coding Session: [Date/Time]
   **Goal**: [What I'm working on]
   **Files**: [List of files I'll modify]
   ```

### While Coding

3. **Live Documentation** in activeContext.md
   - Add notes as I discover patterns
   - Document decisions as I make them
   - Capture issues immediately when found
   - Include code snippets for important patterns

4. **Track Changes**
   ```markdown
   ### Changes Made
   - ✅ Added X feature to Y file
   - ✅ Fixed Z bug in W file
   - ⏳ Started implementation of A feature
   ```

### After Completing Work

5. **Move to progress.md**
   - Completed features → "What Works" section
   - Issues found → "Known Issues" section
   - Tech debt created → "Technical Debt" section
   - Update milestones and metrics

6. **Clean Up activeContext.md**
   - Archive completed session notes
   - Update "Next Steps" section
   - Ensure current state is clear

### On User Request: "Update Memory Bank"

7. **Full Review** (15-20 minutes)
   - Read ALL files
   - Update outdated information
   - Consolidate scattered notes
   - Move stale items from activeContext → progress
   - Verify all six files are accurate

---

## File-Specific Responsibilities

| File | What to Document |
|------|------------------|
| **activeContext.md** | • Current coding session notes<br>• Work in progress<br>• Immediate decisions<br>• Active issues being debugged<br>• Tool usage notes<br>• Session-specific diagrams |
| **progress.md** | • Completed features<br>• Known bugs (with details)<br>• Tech debt inventory<br>• Milestones achieved<br>• Performance metrics<br>• Long-term issues |
| **systemPatterns.md** | • Established architecture patterns<br>• Design decisions (historical)<br>• Flow diagrams<br>• Critical paths<br>• Extension points |
| **techContext.md** | • Tool versions and configs<br>• Dependencies<br>• Setup procedures<br>• Environment requirements |
| **productContext.md** | • User requirements<br>• Use cases<br>• Design philosophy |
| **projectbrief.md** | • Project scope<br>• Success criteria<br>• Constraints |

---

## Example: Complete Session Documentation

Here's how a full session would be documented:

### During Coding (activeContext.md)
```markdown
## Coding Session: Add Chat History Limit Feature

**Start Time**: 2025-10-18 2:00 PM
**Goal**: Prevent unbounded memory growth in chat history
**Approach**: Circular buffer with configurable limit

**Files Being Modified**:
- `src/server/index.ts` - Add history limit constant
- `src/server/socket.ts` - Implement circular buffer logic
- `src/types.ts` - Add ServerConfig interface

**Implementation Plan**:
1. Add MAX_HISTORY_SIZE constant (default: 1000)
2. Modify chatHistory.push() to use circular buffer
3. Add configuration option in .env
4. Update API to respect limit

**Code Pattern Discovered**:
```typescript
// Circular buffer implementation
if (chatHistory.length >= MAX_HISTORY_SIZE) {
  chatHistory.shift() // Remove oldest
}
chatHistory.push(newMessage)
```

**Decision**: Use simple array with shift() vs. ring buffer
**Rationale**: Array operations are O(n) but history is small (<1000)
**Alternative**: Ring buffer would be O(1) but adds complexity
**Choice**: Start simple, optimize if needed

**Issues Encountered**:
- TypeScript error: MAX_HISTORY_SIZE not found
  - Fix: Added to ServerConfig interface
- History API returns incorrect count
  - Fix: Updated response.total to use actual length

**Testing**:
- ✅ Tested with 10 messages
- ✅ Tested with 1001 messages (oldest dropped)
- ✅ API returns correct count
- ⏳ Need to test with agents

**Tech Debt Created**:
- Using shift() on array (O(n) operation)
- Should consider ring buffer for performance
- Priority: Low (not a bottleneck yet)

**Next**: Test with multiple agents, then commit
```

### After Session (progress.md)
```markdown
## Recent Changes (2025-10-18)

### Completed: Chat History Limit Feature ✅
**Implementation**: Added configurable history limit with circular buffer
**Files Modified**: 
- `src/server/index.ts`
- `src/server/socket.ts`
- `src/types.ts`

**Resolves Issue**: "Unbounded chat history" (was in Known Issues)

**Configuration**:
```bash
MAX_HISTORY_SIZE=1000  # Default in .env
```

**Testing**: Verified with 1000+ messages, works correctly

### New Tech Debt Created
**Array shift() performance**
- Location: `src/server/socket.ts:85`
- Issue: O(n) operation on message insertion
- Impact: Low (history size limited to 1000)
- Better solution: Ring buffer implementation
- Priority: Low
- Effort: 2 hours

### Resolved Tech Debt
**Unbounded memory growth** - Fixed with history limit
```

---

## Best Practices

### Do's ✅
- Document as you code, not after
- Be specific (file names, line numbers, timestamps)
- Include code snippets for important patterns
- Explain *why* decisions were made
- Track all tech debt, even minor
- Update Memory Bank after each session

### Don'ts ❌
- Don't wait until end of day to document
- Don't leave decisions unexplained
- Don't hide tech debt
- Don't let activeContext get stale
- Don't forget to move completed work to progress
- Don't skip the Memory Bank read at session start

---

## Tools for Better Documentation

### VS Code Extensions (Recommended)
- **Markdown Preview Enhanced**: Better markdown rendering
- **Draw.io Integration**: Inline diagrams
- **TODO Highlight**: Track inline TODOs
- **GitLens**: See code history

### Diagram Tools
- **ASCII Flow**: Text-based diagrams (already used)
- **Mermaid**: Markdown-native diagrams
- **Draw.io**: Complex architecture diagrams

### Code Documentation
- **TSDoc comments**: In code documentation
- **Type annotations**: Self-documenting code
- **README per directory**: Local context

---

## Summary

The Memory Bank system directly supports all three directives:

1. **Document work as you code** → activeContext.md (live notes) → progress.md (completed work)
2. **Document tools and workflows** → activeContext.md (tools section) + techContext.md (setup)
3. **Document issues and tech debt** → activeContext.md (immediate) → progress.md (inventory)

**Key Success Factor**: Discipline in updating Memory Bank during and after each coding session, not as an afterthought.
