import { Roadmap } from "@/types";

/**
 * Pre-built sample roadmaps for demo purposes
 * These showcase the app's capabilities without requiring API calls
 */
export const SAMPLE_ROADMAPS: Record<string, Roadmap> = {
    react: {
        id: "demo-react",
        title: "Learn React: From Fundamentals to Production",
        description: "Master the art of building dynamic, efficient user interfaces with React.",
        createdAt: Date.now(),
        lastActive: Date.now(),
        tasks: [
            { id: "r1", label: "Modern JavaScript & Development Environment", description: "Set up Node.js, npm, and your code editor. Learn ES6+ features like arrow functions, destructuring, and modules.", completed: false },
            { id: "r2", label: "Introduction to React & JSX", description: "Understand React's component-based architecture and how JSX transforms into JavaScript.", completed: false },
            { id: "r3", label: "Components & Props", description: "Create functional components, pass data via props, and understand the unidirectional data flow.", completed: false },
            { id: "r4", label: "State Management with useState", description: "Add interactivity with local component state using the useState hook.", completed: false },
            { id: "r5", label: "Handling Events & User Interaction", description: "Respond to clicks, form submissions, and keyboard events in React.", completed: false },
            { id: "r6", label: "useEffect & Side Effects", description: "Fetch data, set up subscriptions, and manage side effects properly.", completed: false },
            { id: "r7", label: "Lists, Keys & Conditional Rendering", description: "Render dynamic lists efficiently and conditionally show/hide UI elements.", completed: false },
            { id: "r8", label: "React Router & Navigation", description: "Implement client-side routing for multi-page applications.", completed: false },
            { id: "r9", label: "Global State with Context API", description: "Share state across components without prop drilling.", completed: false },
            { id: "r10", label: "Build & Deploy Your First App", description: "Create a production build and deploy to Vercel or Netlify.", completed: false },
        ],
    },
    python: {
        id: "demo-python",
        title: "Master Python: From Zero to Capstone Project",
        description: "Learn Python programming from fundamentals to building real-world applications.",
        createdAt: Date.now(),
        lastActive: Date.now(),
        tasks: [
            { id: "p1", label: "Python Setup & First Program", description: "Install Python, set up VS Code, and write your first 'Hello, World!' program.", completed: false },
            { id: "p2", label: "Variables, Data Types & Operators", description: "Understand integers, floats, strings, booleans, and basic arithmetic.", completed: false },
            { id: "p3", label: "Control Flow: Conditionals & Loops", description: "Master if/elif/else statements, for loops, and while loops.", completed: false },
            { id: "p4", label: "Functions & Modules", description: "Write reusable functions, understand scope, and import modules.", completed: false },
            { id: "p5", label: "Lists, Tuples & Dictionaries", description: "Work with Python's core data structures for organizing data.", completed: false },
            { id: "p6", label: "File I/O & Error Handling", description: "Read/write files and handle exceptions gracefully with try/except.", completed: false },
            { id: "p7", label: "Object-Oriented Programming", description: "Create classes, objects, and understand inheritance and encapsulation.", completed: false },
            { id: "p8", label: "Working with APIs & JSON", description: "Make HTTP requests, parse JSON, and interact with web services.", completed: false },
            { id: "p9", label: "Data Analysis with Pandas", description: "Load, clean, and analyze datasets using the Pandas library.", completed: false },
            { id: "p10", label: "Build a Capstone Project", description: "Apply everything to build a complete CLI or web application.", completed: false },
        ],
    },
    design: {
        id: "demo-design",
        title: "UI/UX Design Fundamentals",
        description: "Learn to create beautiful, user-centered digital experiences.",
        createdAt: Date.now(),
        lastActive: Date.now(),
        tasks: [
            { id: "d1", label: "Design Thinking & UX Principles", description: "Understand empathy-driven design and the double diamond process.", completed: false },
            { id: "d2", label: "Color Theory & Typography", description: "Master color psychology, contrast, and font pairing fundamentals.", completed: false },
            { id: "d3", label: "Layout & Visual Hierarchy", description: "Use grids, whitespace, and visual weight to guide the eye.", completed: false },
            { id: "d4", label: "Figma Basics & Wireframing", description: "Learn the essential Figma tools and create low-fidelity wireframes.", completed: false },
            { id: "d5", label: "High-Fidelity Mockups", description: "Transform wireframes into polished, pixel-perfect designs.", completed: false },
            { id: "d6", label: "Design Systems & Components", description: "Build reusable UI components and maintain design consistency.", completed: false },
            { id: "d7", label: "Prototyping & Interactions", description: "Create interactive prototypes with transitions and micro-animations.", completed: false },
            { id: "d8", label: "Portfolio Project", description: "Design a complete app from concept to prototype for your portfolio.", completed: false },
        ],
    },
};

/**
 * Load a demo roadmap by key
 */
export const getDemoRoadmap = (key: keyof typeof SAMPLE_ROADMAPS): Roadmap => {
    return {
        ...SAMPLE_ROADMAPS[key],
        id: crypto.randomUUID(), // Generate fresh ID
        createdAt: Date.now(),
        lastActive: Date.now(),
    };
};

/**
 * Reset gamification data for demo purposes
 */
export const resetDemoData = () => {
    if (typeof window === "undefined") return;

    // Clear gamification data
    localStorage.removeItem("skill-bloom-gamification");

    // Reset onboarding tour
    localStorage.removeItem("skill-bloom-onboarding-completed");
};
