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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `
      You are an expert curriculum designer. Create a learning roadmap for: "${prompt}".
      Return ONLY valid JSON. No markdown backticks.
      Structure:
      {
        "title": "${prompt}",
        "description": "One line summary",
        "tasks": [
          { "id": "1", "label": "Step Name", "description": "Short explanation", "completed": false }
        ]
      }
      Rules:
      1. Create 8-12 progressive tasks.
      2. Start with fundamentals, end with a capstone project.
      3. Each task builds on the previous ones.
    `;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("Generation failed:", error);
    return NextResponse.json(MOCK_ROADMAP, { status: 200 });
  }
}
