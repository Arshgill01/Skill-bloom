# 🌱 SkillBloom

> **Grow your skills, literally.** > A gamified learning platform that turns your educational roadmap into a living, breathing digital garden.


![The Garden](https://github.com/user-attachments/assets/772e9e41-5ba7-4fee-bd75-ff47523ccd98)

## The Concept

Learning requires consistent effort, but traditional to-do lists feel stagnant. **SkillBloom** solves this by visualizing abstract progress as organic growth.

Powered by **Google Gemini 2.5 Flash**, the application instantly generates a comprehensive curriculum for _any_ skill you want to learn. As you check off tasks, your unique tree grows from a seedling into a complex, blooming plant. It transforms the dopamine hit of "checking a box" into the satisfaction of nurturing a life form.

## 🚀 Key Features

- **🧠 AI-Curated Roadmaps**: Enter any topic (e.g., "Learn React," "Baking 101") and get a structured, step-by-step learning path generated instantly.
- **🌳 Procedural Growth Engine**: Your tree isn't a static image. It renders dynamically based on your progress, adding branches, leaves, and blooms as you complete specific milestones.
- **💾 Local Persistence**: Your garden is saved automatically to your browser. Close the tab and return anytime; your growth remains.
- **🎨 Seasonal Theming**: Immersive environments that react to your preferences (Light, Dark, and Autumn modes).

## ⚙️ Technical Highlights

We focused on creating a "living" UI without sacrificing performance.

- **Deterministic "Organic" Randomness**: To prevent hydration errors while keeping trees looking natural, we use index-based math (e.g., `(i * 123.45) % 1`) instead of `Math.random()`. This ensures every tree looks unique but renders identically on the server and client.
- **Complex SVG Animation**: We utilize **Framer Motion** to animate individual SVG paths, allowing branches to "grow" out seamlessly rather than just appearing.
- **Gemini 2.5 Integration**: Leverages the latest multimodal model for low-latency JSON generation, parsing vague user intents into structured data arrays instantly.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **AI Model**: Google Gemini API (`gemini-2.5-flash`)
- **Styling**: Tailwind CSS 4
- **Motion**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## 🏃‍♂️ Quick Start

Get your garden growing in under 2 minutes:

1.  **Clone & Install**

    ```bash
    git clone [https://github.com/yourusername/skill-bloom.git](https://github.com/yourusername/skill-bloom.git)
    cd skill-bloom
    npm install
    ```

2.  **Set API Key**
    Create a `.env.local` file in the root:

    ```env
    GEMINI_API_KEY=your_google_gemini_api_key
    ```

3.  **Launch**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to start planting.


## 📸 Gallery

| Light Mode | Dark Mode |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/a75a8c7f-5a90-4f7d-a012-6719a2401237" alt="Light Mode" width="100%" /> | <img src="https://github.com/user-attachments/assets/78d0b495-92f8-4bdd-a5b0-57051cb7cbe0" alt="Dark Mode" width="100%" /> |
| **Autumn Mode** | **Quest Complete** |
| <img src="https://github.com/user-attachments/assets/197338c6-c3df-4422-8b8e-5b4b01880774" alt="Autumn Mode" width="100%" /> | <img src="https://github.com/user-attachments/assets/0a1b5ad4-2000-41c3-885f-0791e0290274" alt="Quest Complete" width="100%" /> |




## License

MIT License
