import { Roadmap } from "@/types";

/**
 * Pre-built sample roadmaps for demo purposes
 * These showcase the app's capabilities with curated, high-quality resources
 */
export const SAMPLE_ROADMAPS: Record<string, Roadmap> = {
    react: {
        id: "demo-react",
        title: "Learn React: From Fundamentals to Production",
        description: "Master the art of building dynamic, efficient user interfaces with React.",
        createdAt: Date.now(),
        lastActive: Date.now(),
        tasks: [
            {
                id: "r1",
                label: "Modern JavaScript & Development Environment",
                description: "Set up Node.js, npm, and your code editor. Learn ES6+ features like arrow functions, destructuring, and modules.",
                completed: false,
                resources: {
                    docs: { title: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
                    video: { title: "JavaScript ES6+ in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=DHjqpvDnNGE" },
                    tip: "Always use 'const' by default, only use 'let' when you need to reassign"
                }
            },
            {
                id: "r2",
                label: "Introduction to React & JSX",
                description: "Understand React's component-based architecture and how JSX transforms into JavaScript.",
                completed: false,
                resources: {
                    docs: { title: "React Quick Start", url: "https://react.dev/learn" },
                    video: { title: "React in 100 Seconds", channel: "Fireship", url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM" },
                    tip: "JSX is just syntactic sugar for React.createElement() - understanding this helps debugging"
                }
            },
            {
                id: "r3",
                label: "Components & Props",
                description: "Create functional components, pass data via props, and understand the unidirectional data flow.",
                completed: false,
                resources: {
                    docs: { title: "Passing Props to a Component", url: "https://react.dev/learn/passing-props-to-a-component" },
                    video: { title: "React Props Explained", channel: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=PHaECbrKgs0" },
                    tip: "Props are read-only - never modify them directly inside a component"
                }
            },
            {
                id: "r4",
                label: "State Management with useState",
                description: "Add interactivity with local component state using the useState hook.",
                completed: false,
                resources: {
                    docs: { title: "useState Reference", url: "https://react.dev/reference/react/useState" },
                    video: { title: "useState Hook Explained", channel: "Codevolution", url: "https://www.youtube.com/watch?v=lAW1Jmmr9hc" },
                    tip: "State updates are asynchronous - use the callback form when new state depends on old state"
                }
            },
            {
                id: "r5",
                label: "Handling Events & User Interaction",
                description: "Respond to clicks, form submissions, and keyboard events in React.",
                completed: false,
                resources: {
                    docs: { title: "Responding to Events", url: "https://react.dev/learn/responding-to-events" },
                    video: { title: "React Events Tutorial", channel: "The Net Ninja", url: "https://www.youtube.com/watch?v=0XSDAup85SA" },
                    tip: "Always use e.preventDefault() in form handlers to prevent page reload"
                }
            },
            {
                id: "r6",
                label: "useEffect & Side Effects",
                description: "Fetch data, set up subscriptions, and manage side effects properly.",
                completed: false,
                resources: {
                    docs: { title: "useEffect Reference", url: "https://react.dev/reference/react/useEffect" },
                    video: { title: "useEffect Hook Explained", channel: "Jack Herrington", url: "https://www.youtube.com/watch?v=0ZJgIjIuY7U" },
                    tip: "Always return a cleanup function when setting up subscriptions or timers"
                }
            },
            {
                id: "r7",
                label: "Lists, Keys & Conditional Rendering",
                description: "Render dynamic lists efficiently and conditionally show/hide UI elements.",
                completed: false,
                resources: {
                    docs: { title: "Rendering Lists", url: "https://react.dev/learn/rendering-lists" },
                    video: { title: "React Lists and Keys", channel: "Academind", url: "https://www.youtube.com/watch?v=0sasRxl35_8" },
                    tip: "Never use array index as key if list items can be reordered or deleted"
                }
            },
            {
                id: "r8",
                label: "React Router & Navigation",
                description: "Implement client-side routing for multi-page applications.",
                completed: false,
                resources: {
                    docs: { title: "React Router Docs", url: "https://reactrouter.com/en/main/start/tutorial" },
                    video: { title: "React Router v6 Tutorial", channel: "Web Dev Simplified", url: "https://www.youtube.com/watch?v=Ul3y1LXxzdU" },
                    tip: "Use <Navigate> for programmatic redirects, not window.location"
                }
            },
            {
                id: "r9",
                label: "Global State with Context API",
                description: "Share state across components without prop drilling.",
                completed: false,
                resources: {
                    docs: { title: "useContext Reference", url: "https://react.dev/reference/react/useContext" },
                    video: { title: "React Context Explained", channel: "Codevolution", url: "https://www.youtube.com/watch?v=5LrDIWkK_Bc" },
                    tip: "Context is great for low-frequency updates like themes - for high-frequency state, consider Zustand or Redux"
                }
            },
            {
                id: "r10",
                label: "Build & Deploy Your First App",
                description: "Create a production build and deploy to Vercel or Netlify.",
                completed: false,
                resources: {
                    docs: { title: "Vite Deployment Guide", url: "https://vitejs.dev/guide/static-deploy.html" },
                    video: { title: "Deploy React to Vercel", channel: "Traversy Media", url: "https://www.youtube.com/watch?v=FvsvHzcwOmQ" },
                    tip: "Always test your production build locally with 'npm run preview' before deploying"
                }
            },
        ],
    },
    python: {
        id: "demo-python",
        title: "Master Python: From Zero to Capstone Project",
        description: "Learn Python programming from fundamentals to building real-world applications.",
        createdAt: Date.now(),
        lastActive: Date.now(),
        tasks: [
            {
                id: "p1",
                label: "Python Setup & First Program",
                description: "Install Python, set up VS Code, and write your first 'Hello, World!' program.",
                completed: false,
                resources: {
                    docs: { title: "Python Official Tutorial", url: "https://docs.python.org/3/tutorial/index.html" },
                    video: { title: "Python for Beginners", channel: "Programming with Mosh", url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc" },
                    tip: "Use Python 3.10+ for better error messages and modern features"
                }
            },
            {
                id: "p2",
                label: "Variables, Data Types & Operators",
                description: "Understand integers, floats, strings, booleans, and basic arithmetic.",
                completed: false,
                resources: {
                    docs: { title: "Built-in Types", url: "https://docs.python.org/3/library/stdtypes.html" },
                    video: { title: "Python Data Types", channel: "Corey Schafer", url: "https://www.youtube.com/watch?v=khKv-8q7YmY" },
                    tip: "Use f-strings for string formatting: f'Hello {name}' is cleaner than concatenation"
                }
            },
            {
                id: "p3",
                label: "Control Flow: Conditionals & Loops",
                description: "Master if/elif/else statements, for loops, and while loops.",
                completed: false,
                resources: {
                    docs: { title: "Control Flow Tools", url: "https://docs.python.org/3/tutorial/controlflow.html" },
                    video: { title: "Python Loops Tutorial", channel: "Tech With Tim", url: "https://www.youtube.com/watch?v=OnDr4J2UJ8s" },
                    tip: "Use enumerate() instead of range(len()) when you need both index and value"
                }
            },
            {
                id: "p4",
                label: "Functions & Modules",
                description: "Write reusable functions, understand scope, and import modules.",
                completed: false,
                resources: {
                    docs: { title: "Defining Functions", url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions" },
                    video: { title: "Python Functions", channel: "Corey Schafer", url: "https://www.youtube.com/watch?v=9Os0o3wzS_I" },
                    tip: "Use type hints for better code documentation: def greet(name: str) -> str:"
                }
            },
            {
                id: "p5",
                label: "Lists, Tuples & Dictionaries",
                description: "Work with Python's core data structures for organizing data.",
                completed: false,
                resources: {
                    docs: { title: "Data Structures", url: "https://docs.python.org/3/tutorial/datastructures.html" },
                    video: { title: "Python Lists, Dicts, Tuples", channel: "Corey Schafer", url: "https://www.youtube.com/watch?v=W8KRzm-HUcc" },
                    tip: "Use list comprehensions for cleaner code: [x*2 for x in items if x > 0]"
                }
            },
            {
                id: "p6",
                label: "File I/O & Error Handling",
                description: "Read/write files and handle exceptions gracefully with try/except.",
                completed: false,
                resources: {
                    docs: { title: "Reading and Writing Files", url: "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files" },
                    video: { title: "Python File Handling", channel: "Corey Schafer", url: "https://www.youtube.com/watch?v=Uh2ebFW8OYM" },
                    tip: "Always use 'with open()' context manager - it handles closing files automatically"
                }
            },
            {
                id: "p7",
                label: "Object-Oriented Programming",
                description: "Create classes, objects, and understand inheritance and encapsulation.",
                completed: false,
                resources: {
                    docs: { title: "Classes", url: "https://docs.python.org/3/tutorial/classes.html" },
                    video: { title: "Python OOP Tutorial", channel: "Corey Schafer", url: "https://www.youtube.com/watch?v=ZDa-Z5JzLYM" },
                    tip: "Use dataclasses for simple data containers: @dataclass makes boilerplate disappear"
                }
            },
            {
                id: "p8",
                label: "Working with APIs & JSON",
                description: "Make HTTP requests, parse JSON, and interact with web services.",
                completed: false,
                resources: {
                    docs: { title: "Requests Library", url: "https://docs.python-requests.org/en/latest/user/quickstart/" },
                    video: { title: "Python API Tutorial", channel: "Tech With Tim", url: "https://www.youtube.com/watch?v=9LwGQPlq3ws" },
                    tip: "Always check response.status_code before parsing - APIs can fail!"
                }
            },
            {
                id: "p9",
                label: "Data Analysis with Pandas",
                description: "Load, clean, and analyze datasets using the Pandas library.",
                completed: false,
                resources: {
                    docs: { title: "Pandas Getting Started", url: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/" },
                    video: { title: "Pandas Tutorial", channel: "Corey Schafer", url: "https://www.youtube.com/watch?v=ZyhVh-qRZPA" },
                    tip: "Use .head() and .info() first to understand your data before analysis"
                }
            },
            {
                id: "p10",
                label: "Build a Capstone Project",
                description: "Apply everything to build a complete CLI or web application.",
                completed: false,
                resources: {
                    docs: { title: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" },
                    video: { title: "Build a Python Project", channel: "Tech With Tim", url: "https://www.youtube.com/watch?v=DLLrcr9u_XI" },
                    tip: "Start small, get it working, then iterate - don't try to build everything at once"
                }
            },
        ],
    },
    design: {
        id: "demo-design",
        title: "UI/UX Design Fundamentals",
        description: "Learn to create beautiful, user-centered digital experiences.",
        createdAt: Date.now(),
        lastActive: Date.now(),
        tasks: [
            {
                id: "d1",
                label: "Design Thinking & UX Principles",
                description: "Understand empathy-driven design and the double diamond process.",
                completed: false,
                resources: {
                    docs: { title: "IDEO Design Thinking", url: "https://designthinking.ideo.com/" },
                    video: { title: "Design Thinking Explained", channel: "AJ&Smart", url: "https://www.youtube.com/watch?v=gHGN6hs2gZY" },
                    tip: "Always start with the user problem, not the solution you want to build"
                }
            },
            {
                id: "d2",
                label: "Color Theory & Typography",
                description: "Master color psychology, contrast, and font pairing fundamentals.",
                completed: false,
                resources: {
                    docs: { title: "Google Fonts Guide", url: "https://fonts.google.com/knowledge" },
                    video: { title: "Color Theory for Designers", channel: "The Futur", url: "https://www.youtube.com/watch?v=KMS3VwGh3HY" },
                    tip: "Use 60-30-10 rule: 60% primary color, 30% secondary, 10% accent"
                }
            },
            {
                id: "d3",
                label: "Layout & Visual Hierarchy",
                description: "Use grids, whitespace, and visual weight to guide the eye.",
                completed: false,
                resources: {
                    docs: { title: "Laws of UX", url: "https://lawsofux.com/" },
                    video: { title: "Visual Hierarchy in UI Design", channel: "DesignCourse", url: "https://www.youtube.com/watch?v=qZWDJqY27bw" },
                    tip: "When in doubt, add more whitespace - it's almost always too tight"
                }
            },
            {
                id: "d4",
                label: "Figma Basics & Wireframing",
                description: "Learn the essential Figma tools and create low-fidelity wireframes.",
                completed: false,
                resources: {
                    docs: { title: "Figma Getting Started", url: "https://help.figma.com/hc/en-us/categories/360002051613-Getting-Started" },
                    video: { title: "Figma Tutorial for Beginners", channel: "Figma", url: "https://www.youtube.com/watch?v=FTFaQWZBqQ8" },
                    tip: "Use Auto Layout from day one - it's essential for responsive designs"
                }
            },
            {
                id: "d5",
                label: "High-Fidelity Mockups",
                description: "Transform wireframes into polished, pixel-perfect designs.",
                completed: false,
                resources: {
                    docs: { title: "Figma Design Basics", url: "https://help.figma.com/hc/en-us/sections/360006798733-Design-basics" },
                    video: { title: "UI Design Tutorial", channel: "DesignCourse", url: "https://www.youtube.com/watch?v=5IanQIwhA4E" },
                    tip: "Steal like an artist - reference Dribbble and Mobbin for UI patterns"
                }
            },
            {
                id: "d6",
                label: "Design Systems & Components",
                description: "Build reusable UI components and maintain design consistency.",
                completed: false,
                resources: {
                    docs: { title: "Figma Components Guide", url: "https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma" },
                    video: { title: "Design Systems in Figma", channel: "Figma", url: "https://www.youtube.com/watch?v=EK-pHkc5EL4" },
                    tip: "Name components with a clear hierarchy: Button/Primary/Large"
                }
            },
            {
                id: "d7",
                label: "Prototyping & Interactions",
                description: "Create interactive prototypes with transitions and micro-animations.",
                completed: false,
                resources: {
                    docs: { title: "Figma Prototyping", url: "https://help.figma.com/hc/en-us/articles/360040314193-Guide-to-prototyping-in-Figma" },
                    video: { title: "Figma Prototyping Tutorial", channel: "Mizko", url: "https://www.youtube.com/watch?v=RfpYTu1sNac" },
                    tip: "Use Smart Animate for smooth transitions between similar frames"
                }
            },
            {
                id: "d8",
                label: "Portfolio Project",
                description: "Design a complete app from concept to prototype for your portfolio.",
                completed: false,
                resources: {
                    docs: { title: "UX Portfolio Guide", url: "https://www.nngroup.com/articles/ux-portfolio-tips/" },
                    video: { title: "How to Build a UX Portfolio", channel: "Flux Academy", url: "https://www.youtube.com/watch?v=lyHaE9D7lQM" },
                    tip: "Show your process, not just final screens - case studies > mockups"
                }
            },
        ],
    },
};

/**
 * Load a demo roadmap by key
 */
export const getDemoRoadmap = (key: keyof typeof SAMPLE_ROADMAPS): Roadmap => {
    return {
        ...SAMPLE_ROADMAPS[key],
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        lastActive: Date.now(),
    };
};

/**
 * Reset gamification data for demo purposes
 */
export const resetDemoData = () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("skill-bloom-gamification");
    localStorage.removeItem("skill-bloom-onboarding-completed");
};
