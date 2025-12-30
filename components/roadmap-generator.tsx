"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, Loader2, Sparkles, TreeDeciduous } from "lucide-react";
import { GrowthContainer } from "@/components/tree/growth-container";

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
                className="flex items-center gap-3 mb-8"
            >
                <div className="p-3 bg-white rounded-2xl shadow-md border border-green-100">
                    <TreeDeciduous className="text-green-600 w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-green-900 tracking-tight">
                    SkillBloom
                </h1>
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
                        <h2 className="text-4xl font-bold mb-6 text-green-900 leading-tight">
                            Grow your skills,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                                one step at a time.
                            </span>
                        </h2>
                        <p className="text-stone-500 mb-8 text-lg">
                            Enter what you want to learn. Watch your tree grow as you complete each milestone.
                        </p>

                        <form onSubmit={handleGenerate} className="relative group">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="I want to learn..."
                                disabled={isLoading}
                                className="w-full px-6 py-5 rounded-2xl border-2 border-stone-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all text-lg shadow-sm group-hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-white/90 backdrop-blur-sm"
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

                        <div className="mt-8 flex gap-3 justify-center text-sm text-stone-400">
                            <span>Try:</span>
                            {["Learn React", "Master Python", "Learn Chess"].map((ex) => (
                                <button
                                    key={ex}
                                    onClick={() => setPrompt(ex)}
                                    className="hover:text-green-600 transition-colors underline decoration-dotted underline-offset-4"
                                >
                                    {ex}
                                </button>
                            ))}
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
