# LANChat Memory Bank

This directory contains Cline's Memory Bank - a comprehensive documentation system that persists context across sessions.

## Purpose

Cline's memory resets completely between sessions. The Memory Bank is the **only** way to maintain project context, understand decisions, and continue work effectively. These files must be read at the start of every session.

## File Structure

### Core Files (Read in Order)

1. **projectbrief.md** - Foundation document
   - Project overview and mission
   - Core requirements
   - Success criteria
   - Technical constraints

2. **productContext.md** - Product understanding
   - Why the project exists
   - Target users
   - User experience flows
   - Design philosophy

3. **systemPatterns.md** - Technical architecture
   - System design patterns
   - Component relationships
   - Critical implementation paths
   - Extension points

4. **techContext.md** - Technology details
   - Technology stack
   - Development setup
   - Dependencies
   - Tool usage patterns

5. **activeContext.md** - Current state
   - Current work focus
   - Recent changes
   - Active decisions
   - Important patterns

6. **progress.md** - Project status
   - What works
   - What's left to build
   - Known issues
   - Project roadmap

## How to Use

### Starting a New Session
1. Read ALL core files (projectbrief → productContext → systemPatterns → techContext → activeContext → progress)
2. Understand current project state
3. Identify where to continue work

### During Work
- Update activeContext.md with new decisions and patterns
- Update progress.md when completing features or finding issues

### When User Requests "Update Memory Bank"
- Review ALL files for accuracy
- Update with new insights and changes
- Focus on activeContext.md and progress.md for current state

## File Dependencies

```
projectbrief.md (foundation)
    ↓
    ├─→ productContext.md (why & how)
    ├─→ systemPatterns.md (architecture)
    └─→ techContext.md (technology)
         ↓
         └─→ activeContext.md (current)
              ↓
              └─→ progress.md (status)
```

## Maintenance

### Update Triggers
- Discovering new project patterns
- After implementing significant changes
- When user requests "update memory bank"
- When context needs clarification
- After completing milestones

### Update Focus
- **activeContext.md**: Most frequently updated (current work)
- **progress.md**: Updated with each milestone or issue
- **systemPatterns.md**: Updated when architecture changes
- **techContext.md**: Updated when adding dependencies or tools
- **productContext.md**: Updated when requirements change
- **projectbrief.md**: Rarely updated (foundation document)

## Critical Guidelines

1. **Read ALL files** at session start - no exceptions
2. **Keep accurate** - effectiveness depends on accuracy
3. **Be detailed** - future Cline needs comprehensive context
4. **Update regularly** - don't let documentation drift
5. **Focus on patterns** - capture learnings and insights

## Additional Resources

### WORKFLOW_GUIDE.md
**Comprehensive guide** for documenting work that directly addresses:
1. How to document work as you code (notes, diagrams, decisions)
2. How to document tools and workflows
3. How to track issues and technical debt

**Read this guide** to understand the complete documentation workflow and best practices.

## Current Status

✅ All core files created and up-to-date
✅ Complete project context documented
✅ Workflow guide for documentation practices
✅ Ready for use in future sessions

**Last Updated**: October 17, 2025 at 4:08 PM EDT
