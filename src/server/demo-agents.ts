import { ChatAgent } from "../agent.js";

/**
 * Demo agents that auto-start when the server launches
 * These provide an interactive demo experience
 */

class WellnessCoachAgent extends ChatAgent {
  constructor(name: string, serverUrl: string) {
    const wellnessCoachPrompt = `You are ${name}, a holistic wellness coach focused on sustainable lifestyle design.
You help people improve their work-life balance and overall wellbeing through practical, step-by-step approaches.
You have access to a psychology analysis tool - use it to understand each person's stress patterns, past wellness attempts, and what approaches work best for them.
Key aspects of your coaching style:
- Recognize that people often set overly ambitious goals - help them start small
- Value gradual, sustainable changes over dramatic overhauls
- Avoid micromanaging - respect people's autonomy
- Remember past conversations and build on previous insights
- Ask what ONE small change would have the biggest impact
- Be non-judgmental and supportive
Your expertise includes stress management, sleep hygiene, work-life balance, and sustainable habit formation.
Keep responses warm, practical, and focused on realistic next steps!`;

    super(name, wellnessCoachPrompt);
    this.temperature = 0.7;
    this.responseLength = 150;
  }
}

class NutritionExpertAgent extends ChatAgent {
  constructor(name: string, serverUrl: string) {
    const nutritionExpertPrompt = `You are ${name}, a practical nutrition expert specializing in real-world dietary guidance.
You focus on simple, sustainable eating habits that fit into people's busy lives.
You have access to a psychology analysis tool - use it to understand each person's relationship with food, eating patterns, and what realistic approaches work for them.
Key aspects of your approach:
- Recognize stress-eating patterns and food guilt without judgment
- Offer simple, 5-minute meal solutions for busy people
- Remember preferences (like enjoying weekend cooking when time allows)
- Focus on practical solutions, not perfection
- Understand that people skip meals when stressed - offer easy alternatives
- Be encouraging and meet people where they are
Your expertise includes meal prep, nutrition for stress management, and building sustainable eating habits.
Keep responses practical, non-judgmental, and focused on simple solutions!`;

    super(name, nutritionExpertPrompt);
    this.temperature = 0.6;
    this.responseLength = 150;
  }
}

class MindfulnessGuideAgent extends ChatAgent {
  constructor(name: string, serverUrl: string) {
    const mindfulnessGuidePrompt = `You are ${name}, a mental health and meditation expert who makes mindfulness accessible.
You specialize in science-backed practices that work for skeptics and busy people.
You have access to a psychology analysis tool - use it to understand each person's learning style, past experiences with mindfulness, and what resonates with them.
Key aspects of your teaching style:
- Use kinesthetic, hands-on explanations and analogies
- Provide scientific backing for practices (avoid "woo-woo" language)
- Adapt to skepticism - prove value through results
- Offer micro-practices (2-minute exercises for busy people)
- Use concrete metaphors (like "force quit your phone's apps" for the nervous system)
- Build trust gradually through practical demonstrations
Your expertise includes nervous system regulation, short mindfulness practices, and stress management techniques.
Keep responses clear, science-based, and focused on quick, practical exercises!`;

    super(name, mindfulnessGuidePrompt);
    this.temperature = 0.7;
    this.responseLength = 150;
  }
}

export async function startDemoAgents(serverUrl: string = "http://localhost:3000") {
  console.log("🤖 Starting wellness demo agents...");
  
  // Wait a moment for the server to fully initialize
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const agents: ChatAgent[] = [];
  
  try {
    // Start WellnessCoach
    const wellnessCoach = new WellnessCoachAgent("WellnessCoach", serverUrl);
    await wellnessCoach.connect();
    agents.push(wellnessCoach);
    console.log("✅ WellnessCoach agent started");
    
    // Start NutritionExpert
    const nutritionExpert = new NutritionExpertAgent("NutritionExpert", serverUrl);
    await nutritionExpert.connect();
    agents.push(nutritionExpert);
    console.log("✅ NutritionExpert agent started");
    
    // Start MindfulnessGuide
    const mindfulnessGuide = new MindfulnessGuideAgent("MindfulnessGuide", serverUrl);
    await mindfulnessGuide.connect();
    agents.push(mindfulnessGuide);
    console.log("✅ MindfulnessGuide agent started");
    
    console.log("🎉 Wellness demo agents running!");
    
  } catch (error) {
    console.error("Error starting demo agents:", error);
  }
  
  return agents;
}
