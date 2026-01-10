import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Complete "Learn React" roadmap with 12 detailed checkpoints
const MOCK_ROADMAP = {
  title: "Learn React",
  description: "From zero to React hero — build modern web applications",
  tasks: [
    { id: "1", label: "Environment Setup", description: "Install Node.js, npm, and create your first React app with Vite", completed: false },
    { id: "2", label: "JSX Fundamentals", description: "Learn JSX syntax — the HTML-like code that React uses", completed: false },
    { id: "3", label: "Components Basics", description: "Create your first functional component and understand composition", completed: false },
    { id: "4", label: "Props & Data Flow", description: "Pass data between components using props", completed: false },
    { id: "5", label: "State with useState", description: "Make components interactive with the useState hook", completed: false },
    { id: "6", label: "Event Handling", description: "Handle clicks, form submissions, and user interactions", completed: false },
    { id: "7", label: "useEffect Hook", description: "Manage side effects like API calls and subscriptions", completed: false },
    { id: "8", label: "Conditional Rendering", description: "Show/hide elements based on state and props", completed: false },
    { id: "9", label: "Lists & Keys", description: "Render arrays of data and understand the key prop", completed: false },
    { id: "10", label: "Forms & Inputs", description: "Build controlled forms with validation", completed: false },
    { id: "11", label: "Custom Hooks", description: "Extract reusable logic into custom hooks", completed: false },
    { id: "12", label: "Build & Deploy", description: "Create a production build and deploy to Vercel", completed: false },
  ],
};

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found. Using mock data.");
      return NextResponse.json(MOCK_ROADMAP);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are an expert curriculum designer and learning path architect. Create a comprehensive, optimally-ordered learning roadmap for: "${prompt}".

CRITICAL: Return ONLY valid JSON. No markdown, no backticks, no explanation.

{
  "title": "Skill Title",
  "description": "A motivating one-line summary of the learning journey",
  "tasks": [
    { 
      "id": "1", 
      "label": "Task Name", 
      "description": "Clear, actionable description", 
      "completed": false,
      "searchQuery": "Optimized Google search query to learn this topic (e.g. 'React useState tutorial')"
    }
  ]
}

RULES FOR OPTIMAL LEARNING ORDER:
1. Create exactly 10-15 progressive milestones
2. ORDER MATTERS: Each task must be a prerequisite for the next
3. Start with absolute basics
4. Progress through: Fundamentals → Core Skills → Intermediate → Advanced → Capstone
5. Each task should be achievable in 1-3 hours
6. Descriptions should be specific
7. "searchQuery" must be a concise, effective search term for a beginner to find the best tutorials/docs

Generate the roadmap now:`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    } catch {
      console.error("Failed to parse Gemini response as JSON:", text.substring(0, 200));
      return NextResponse.json(
        { error: "Invalid response from AI. Please try again.", details: "JSON parse error" },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Generation failed:", error);

    // Return descriptive error instead of silently falling back to mock
    if (error instanceof Error) {
      if (error.message.includes("API_KEY") || error.message.includes("auth")) {
        return NextResponse.json(
          { error: "API authentication failed. Please check your API key." },
          { status: 401 }
        );
      }
      if (error.message.includes("rate") || error.message.includes("quota")) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to generate roadmap. Please try again." },
      { status: 500 }
    );
  }
}
