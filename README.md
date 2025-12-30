# 🌱 SkillBloom

<img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1200&h=400&auto=format&fit=crop" alt="SkillBloom Hero" width="100%" style="border-radius: 12px; object-fit: cover; height: 300px;" />

> **Turn your learning journey into a beautiful, growing digital garden.**  
> SkillBloom uses AI to generate personalized learning roadmaps and visualizes your progress as a unique, growing tree.

## 🚀 Inspiration
Learning creates growth, but traditional to-do lists feel stagnant. We wanted to make the act of learning feel alive. **SkillBloom** gamifies self-improvement by transforming abstract progress into something tangible and beautiful—a living tree that grows, branches, and blooms as you master new skills.

## ✨ Key Features

-   **🧠 AI-Powered Roadmaps**: Powered by **Google Gemini 2.5 Flash**, SkillBloom instantly generates comprehensive, step-by-step learning paths for *any* skill.
-   **🌳 Dynamic Growth Visualization**: Watch your skill tree grow from a seedling to a majestic oak. Every completed task adds meaningful growth to your tree.
-   **💾 Auto-Save Persistence**: Your journey is safe! Progress is automatically saved locally, so you can leave and come back anytime.
-   **🎯 Smart Resources**: Don't just list tasks—learn them. Each step comes with one-click access to the best curated search queries and resources.
-   **🎨 Beautiful Theming**: Experience your garden in different seasons with Light, Dark, and Autumn modes.
-   **📤 Social Sharing**: Proud of your growth? Share a generated summary of your tree's progress with friends.

## 🛠️ Tech Stack

This project was built with a modern, high-performance stack:

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **AI Model**: [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash`)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/) (Complex SVG path animations)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **State & Persistence**: React Hooks + LocalStorage API

## 🏃‍♂️ Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/skill-bloom.git
    cd skill-bloom
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```


3.  **Set up Environment Variables**
    Create a `.env.local` file in the root directory:
    ```env
    GEMINI_API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) to start your garden!

## 📸 Screenshots



| The Garden | Dark Mode | Completion |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/088dba59-5a5e-451c-83b4-bd26fa7c60b7" alt="The Garden" width="100%" /> | <img src="https://github.com/user-attachments/assets/d10a8678-f356-4e80-b552-74ad9c3907fe" alt="Dark Mode" width="100%" /> | <img src="https://github.com/user-attachments/assets/882c9f46-3131-4d70-8189-881116dedee5" alt="Quest Complete" width="100%" /> |

## 🤝 Contributing

We welcome contributions! Feel free to push a PR if you have ideas for new tree types (🌴 Pine? 🌵 Cactus?) or features.

### 🎨 How to Add a New Tree
SkillBloom typically separates "Architecture" (the shape logic) from "Configuration" (colors/style).

1.  **Define a Config**: Open `components/tree/tree-types.tsx`. Add a new entry to `TREE_VARIANTS` with your colors and target architecture (e.g., `deciduous`, `tropical`).
2.  **Create a Renderer** (Optional): If you need a completely new shape (like a Bonsai), create a new component in `components/tree/variants/` (e.g., `bonsai-tree.tsx`).
3.  **Determinstic "Randomness"**: We use index-based math (e.g., `(i * 123.45) % 1`) instead of `Math.random()` to ensure trees look organic but stay consistent across re-renders (avoiding hydration errors).

## 📄 License

MIT License - grow freely!
