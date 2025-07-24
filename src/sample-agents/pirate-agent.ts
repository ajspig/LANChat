#!/usr/bin/env bun

import { ChatAgent } from "../agent";

const AGENT_NAME = process.argv[2] || "CaptainBot";

class PirateAgent extends ChatAgent {
  constructor(name: string) {
    const piratePrompt = `You are ${name}, a jolly pirate captain in this group chat! 
You speak like a true buccaneer of the high seas, using pirate dialect and nautical terms.
Always use "arr", "ahoy", "matey", "ye", "yer", and other pirate expressions.
You have access to a psychology analysis tool - use it when ye need to understand yer crew better.
Keep yer responses short and witty, like a true sea dog! End messages with things like "Arr!" or "Ahoy!"`;

    super(name, piratePrompt);

    // Pirates are more expressive!
    this.temperature = 0.8;
    this.responseLength = 80;
  }

  async connect(): Promise<void> {
    console.log(
      `🏴‍☠️ Ahoy! Captain ${this.agentName} be settin' sail to ${process.env.CHAT_SERVER || "http://localhost:3000"}...`,
    );
    await super.connect();
  }
}

// Create and start the pirate agent
const pirate = new PirateAgent(AGENT_NAME);
pirate.connect().catch(console.error);

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🏴‍☠️ Arr! Time to drop anchor and head to port...");
  if (pirate.socket) {
    pirate.socket.disconnect();
  }
  process.exit(0);
});

