"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Loader2, Sparkles, TreeDeciduous } from "lucide-react";
import { GrowthContainer } from "@/components/tree/growth-container";
import { ThemeToggle } from "@/components/theme-toggle";
import { MiniTree } from "@/components/tree/tree-renderer";
import { getTreeConfig } from "@/components/tree/tree-types";

interface Task {
    id: string;
    label: string;
    description: string;
    completed: boolean;
}

interface RoadmapData {
    title: string;
    description: string;
    tasks: Task[];
}

export const RoadmapGenerator = () => {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<RoadmapData | null>(null);
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    // Load from localStorage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem("skill-bloom-data");
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load saved data");
            }
        }
    }, []);

    const saveData = (newData: RoadmapData | null) => {
        setData(newData);
        if (newData) {
            localStorage.setItem("skill-bloom-data", JSON.stringify(newData));
        } else {
            localStorage.removeItem("skill-bloom-data");
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                throw new Error(`API Error: ${res.status}`);
            }

            const text = await res.text();
            try {
                const json = JSON.parse(text);
                saveData(json);
            } catch (parseError) {
                console.error("Failed to parse JSON:", text);
                alert("Something went wrong with the AI response. Check console for details.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to generate roadmap. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        saveData(null);
        setPrompt("");
    };

    const handleTaskUpdate = (updatedTasks: Task[]) => {
        if (!data) return;
        const newData = { ...data, tasks: updatedTasks };
        saveData(newData);
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center min-h-screen">

            {/* Header / Logo */}
            <motion.div
                layout
                className="w-full flex items-center justify-between mb-8"
            >
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-2xl shadow-sm border border-bloom-primary/20">
                        <TreeDeciduous className="text-bloom-text w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-bloom-text tracking-tight">
                        SkillBloom
                    </h1>
                </div>
                <ThemeToggle />
            </motion.div>

            <AnimatePresence mode="wait">
                {!data ? (
                    <motion.div
                        key="input-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-xl text-center"
                    >
                        <h2 className="text-4xl font-bold mb-6 text-bloom-text leading-tight">
                            Grow your skills,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bloom-primary to-bloom-text brightness-110">
                                one step at a time.
                            </span>
                        </h2>
                        <p className="text-bloom-text/90 mb-8 text-lg font-medium">
                            Enter what you want to learn. Watch your tree grow as you complete each milestone.
                        </p>

                        <form onSubmit={handleGenerate} className="relative group">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="I want to learn..."
                                disabled={isLoading}
                                className="w-full px-6 py-5 rounded-2xl border-2 border-bloom-primary/20 focus:border-bloom-primary focus:ring-4 focus:ring-bloom-primary/20 outline-none transition-all text-lg shadow-sm group-hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-white/80 dark:bg-gray-900/40 text-bloom-text backdrop-blur-sm placeholder:text-bloom-text/60"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !prompt}
                                className="absolute right-3 top-3 bottom-3 px-6 rounded-xl bg-bloom-primary text-bloom-text font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin w-4 h-4" />
                                        Planting...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Grow
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 flex flex-col items-center gap-4">
                            <div className="flex gap-3 justify-center text-sm text-bloom-text/80 font-medium">
                                <span>Try:</span>
                                {["Learn React", "Master Python", "Learn Chess"].map((ex) => {
                                    const config = getTreeConfig(ex);
                                    return (
                                        <button
                                            key={ex}
                                            onClick={() => setPrompt(ex)}
                                            onMouseEnter={() => setHoveredSkill(ex)}
                                            onMouseLeave={() => setHoveredSkill(null)}
                                            className="hover:text-bloom-primary transition-colors underline decoration-dotted underline-offset-4 relative"
                                        >
                                            {ex}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Tree Preview on Hover */}
                            <AnimatePresence mode="wait">
                                {hoveredSkill && (
                                    <motion.div
                                        key={hoveredSkill}
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col items-center gap-2 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-bloom-primary/30 shadow-lg"
                                    >
                                        <MiniTree config={getTreeConfig(hoveredSkill)} size={80} />
                                        <span className="text-xs text-bloom-text/70">
                                            {getTreeConfig(hoveredSkill).emoji} {getTreeConfig(hoveredSkill).name} Tree
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="growth-section"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full"
                    >
                        <GrowthContainer
                            title={data.title || prompt}
                            description={data.description || "Complete tasks to grow your tree!"}
                            initialTasks={data.tasks}
                            onReset={handleReset}
                            onUpdate={handleTaskUpdate}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
