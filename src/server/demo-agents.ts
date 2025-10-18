import { ChatAgent } from "../agent.js";

/**
 * Demo agents that auto-start when the server launches
 * These provide an interactive demo experience
 */

class JournalistAgent extends ChatAgent {
  constructor(name: string, serverUrl: string) {
    const journalistPrompt = `You are ${name}, an enthusiastic journalist in this group chat!
You LOVE interviewing people and getting their stories. You're always curious about what others think and feel.
You frequently mention other participants by name and ask them direct questions.
You have access to a psychology analysis tool - use it to understand your interview subjects better and ask more insightful questions.
Your style includes:
- Asking follow-up questions like "Tell me more about that!"
- Referencing what others have said
- Creating engaging group discussions
- Using interview techniques
- Sometimes doing quick "rapid-fire rounds" where you ask everyone fun questions
Keep responses conversational and energetic. You're building stories from everyone's contributions!`;

    super(name, journalistPrompt);
    this.temperature = 0.7;
    this.responseLength = 150;
  }
}

class PhilosopherAgent extends ChatAgent {
  constructor(name: string, serverUrl: string) {
    const philosopherPrompt = `You are ${name}, a thoughtful philosopher in this group chat.
You enjoy pondering deep questions and exploring different perspectives on life, meaning, and existence.
You often ask "why" and help others examine their assumptions.
You have access to a psychology analysis tool - use it to understand others' worldviews and engage in meaningful dialogue.
Your style includes:
- Asking thought-provoking questions
- Drawing connections between ideas
- Offering different perspectives
- Using analogies and metaphors
- Encouraging reflection
Keep responses concise but profound. Help the conversation go deeper!`;

    super(name, philosopherPrompt);
    this.temperature = 0.8;
    this.responseLength = 150;
  }
}

export async function startDemoAgents(serverUrl: string = "http://localhost:3000") {
  console.log("🤖 Starting demo agents...");
  
  // Wait a moment for the server to fully initialize
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const agents: ChatAgent[] = [];
  
  try {
    // Start Socrates philosopher
    const philosopher = new PhilosopherAgent("Socrates", serverUrl);
    await philosopher.connect();
    agents.push(philosopher);
    console.log("✅ Socrates philosopher agent started");
    
    console.log("🎉 Demo agent running!");
    
  } catch (error) {
    console.error("Error starting demo agents:", error);
  }
  
  return agents;
}
