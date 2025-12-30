"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Loader2, Sparkles, TreeDeciduous } from "lucide-react";
import { GrowthContainer } from "@/components/tree/growth-container";
import { ThemeToggle } from "@/components/theme-toggle";
import { MiniTree, getTreeType, treeInfo } from "@/components/tree/tree-types";

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
                setData(json);
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
        setData(null);
        setPrompt("");
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center min-h-screen">

            {/* Header / Logo */}
            <motion.div
                layout
                className="w-full flex items-center justify-between mb-8"
            >
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-md border border-green-100 dark:border-green-900">
                        <TreeDeciduous className="text-green-600 dark:text-green-400 w-8 h-8" />
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
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                                one step at a time.
                            </span>
                        </h2>
                        <p className="text-stone-500 dark:text-stone-400 mb-8 text-lg">
                            Enter what you want to learn. Watch your tree grow as you complete each milestone.
                        </p>

                        <form onSubmit={handleGenerate} className="relative group">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="I want to learn..."
                                disabled={isLoading}
                                className="w-full px-6 py-5 rounded-2xl border-2 border-stone-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-lg shadow-sm group-hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-white/90 dark:bg-gray-800/90 dark:text-white backdrop-blur-sm placeholder:text-stone-400 dark:placeholder:text-stone-500"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !prompt}
                                className="absolute right-3 top-3 bottom-3 px-6 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
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
                            <div className="flex gap-3 justify-center text-sm text-stone-400 dark:text-stone-500">
                                <span>Try:</span>
                                {["Learn React", "Master Python", "Learn Chess"].map((ex) => {
                                    const treeType = getTreeType(ex);
                                    const info = treeInfo[treeType];
                                    return (
                                        <button
                                            key={ex}
                                            onClick={() => setPrompt(ex)}
                                            onMouseEnter={() => setHoveredSkill(ex)}
                                            onMouseLeave={() => setHoveredSkill(null)}
                                            className="hover:text-green-600 dark:hover:text-green-400 transition-colors underline decoration-dotted underline-offset-4 relative"
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
                                        className="flex flex-col items-center gap-2 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-green-100 dark:border-green-900 shadow-lg"
                                    >
                                        <MiniTree type={getTreeType(hoveredSkill)} size={80} />
                                        <span className="text-xs text-stone-500 dark:text-stone-400">
                                            {treeInfo[getTreeType(hoveredSkill)].emoji} {treeInfo[getTreeType(hoveredSkill)].name} Tree
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
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
