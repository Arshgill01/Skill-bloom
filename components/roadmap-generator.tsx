"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, TreeDeciduous, Zap, RotateCcw } from "lucide-react";
import { GrowthContainer } from "@/components/tree/growth-container";
import { ThemeToggle } from "@/components/theme-toggle";
import { MiniTree } from "@/components/tree/tree-renderer";
import { getTreeConfig } from "@/components/tree/tree-types";
import { Task, Roadmap } from "@/types";
import { useToast } from "@/components/toast";
import { GardenManager } from "@/components/garden-manager";
import { usePersistence } from "@/hooks/use-persistence";
import { getDemoRoadmap, resetDemoData } from "@/lib/demo-data";

export const RoadmapGenerator = () => {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
    const [isGardenManagerOpen, setIsGardenManagerOpen] = useState(false);
    const { showToast } = useToast();

    // Persistence integration
    const {
        userData,
        isHydrated,
        addRoadmap,
        updateRoadmap,
        deleteRoadmap,
        setActiveRoadmap
    } = usePersistence();

    // Derived state: Current active roadmap
    const activeRoadmap = userData?.activeRoadmapId && userData.roadmaps[userData.activeRoadmapId]
        ? userData.roadmaps[userData.activeRoadmapId]
        : null;

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                body: JSON.stringify({ prompt }),
            });

            const json = await res.json();

            if (!res.ok || json.error) {
                showToast(json.error || "Failed to generate roadmap", "error");
                return;
            }

            // Create new roadmap object
            const newRoadmap: Roadmap = {
                id: crypto.randomUUID(),
                title: json.title,
                description: json.description,
                tasks: json.tasks,
                createdAt: Date.now(),
                lastActive: Date.now(),
            };

            addRoadmap(newRoadmap);
            showToast(`🌱 Your "${json.title}" tree is ready to grow!`, "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to generate roadmap. Please try again.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        // Just deselect the current roadmap to go back to "new" screen
        setActiveRoadmap("");
        setPrompt("");
    };

    const handleTaskUpdate = (updatedTasks: Task[]) => {
        if (!activeRoadmap) return;
        const updatedRoadmap = { ...activeRoadmap, tasks: updatedTasks };
        updateRoadmap(updatedRoadmap);
    };

    const handleCreateNew = () => {
        setActiveRoadmap("");
        setPrompt("");
        setIsGardenManagerOpen(false);
    };

    // Demo mode - instant roadmap loading
    const handleDemoLaunch = (key: "react" | "python" | "design") => {
        const demoRoadmap = getDemoRoadmap(key);
        addRoadmap(demoRoadmap);
        showToast(`⚡ Demo loaded: ${demoRoadmap.title}`, "success");
    };

    // Reset all demo data for fresh presentation
    const handleDemoReset = () => {
        resetDemoData();
        // Clear all roadmaps for fresh demo
        Object.keys(userData?.roadmaps || {}).forEach(id => deleteRoadmap(id));
        showToast("🔄 Demo reset complete! Fresh start.", "info");
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center min-h-screen">

            {/* Header / Logo */}
            <motion.div
                layout
                className="w-full flex items-center justify-between mb-8"
            >
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-bloom-card border border-bloom-border rounded-xl">
                        <TreeDeciduous className="text-bloom-primary w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-bloom-text tracking-tight">
                        SkillBloom
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsGardenManagerOpen(true)}
                        className="px-4 py-2 bg-bloom-card hover:bg-bloom-card-hover border border-bloom-border rounded-xl text-bloom-text font-medium text-sm transition-colors flex items-center gap-2"
                    >
                        <TreeDeciduous className="w-4 h-4" />
                        My Gardens
                    </button>
                    <ThemeToggle />
                </div>
            </motion.div>

            <GardenManager
                isOpen={isGardenManagerOpen}
                onClose={() => setIsGardenManagerOpen(false)}
                userData={userData}
                onSelect={(id) => setActiveRoadmap(id)}
                onCreate={handleCreateNew}
                onDelete={deleteRoadmap}
            />

            <AnimatePresence mode="wait">
                {!isHydrated ? (
                    <motion.div
                        key="loading-skeleton"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-xl text-center space-y-6"
                    >
                        {/* Skeleton for title */}
                        <div className="h-10 bg-bloom-primary/20 rounded-xl w-3/4 mx-auto animate-pulse" />
                        <div className="h-10 bg-bloom-primary/10 rounded-xl w-1/2 mx-auto animate-pulse" />
                        {/* Skeleton for subtitle */}
                        <div className="h-6 bg-bloom-primary/10 rounded-lg w-2/3 mx-auto animate-pulse" />
                        {/* Skeleton for input */}
                        <div className="h-16 bg-white/50 dark:bg-gray-900/30 rounded-2xl border-2 border-bloom-primary/10 animate-pulse" />
                    </motion.div>
                ) : !activeRoadmap ? (
                    <motion.div
                        key="input-section"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-xl text-center"
                    >
                        <h2 className="text-4xl font-bold mb-6 text-bloom-text leading-tight">
                            Grow your skills,<br />
                            <span className="text-bloom-primary">
                                one step at a time.
                            </span>
                        </h2>
                        <p className="text-bloom-text-muted mb-8 text-lg">
                            Enter what you want to learn. Watch your tree grow as you complete each milestone.
                        </p>

                        <form onSubmit={handleGenerate} className="relative group">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="I want to learn..."
                                disabled={isLoading}
                                className="w-full px-6 py-5 rounded-xl border border-bloom-border focus:border-bloom-primary focus:ring-2 focus:ring-bloom-primary/20 outline-none transition-all text-lg shadow-sm group-hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-bloom-card text-bloom-text placeholder:text-bloom-text-muted"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !prompt}
                                className="absolute right-3 top-3 bottom-3 px-6 rounded-lg bg-bloom-primary text-white font-bold hover:bg-bloom-accent transition-all disabled:opacity-50 flex items-center gap-2"
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

                        {/* Demo Quick Launch */}
                        <div className="mt-10 w-full">
                            <div className="flex items-center justify-center gap-2 mb-4 text-sm text-bloom-text-muted">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span>Instant Demo</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { key: "react" as const, label: "Learn React", emoji: "⚛️", color: "from-cyan-500 to-blue-500" },
                                    { key: "python" as const, label: "Master Python", emoji: "🐍", color: "from-yellow-400 to-green-500" },
                                    { key: "design" as const, label: "UI/UX Design", emoji: "🎨", color: "from-pink-500 to-purple-500" },
                                ].map((demo) => (
                                    <motion.button
                                        key={demo.key}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleDemoLaunch(demo.key)}
                                        onMouseEnter={() => setHoveredSkill(demo.label)}
                                        onMouseLeave={() => setHoveredSkill(null)}
                                        className="relative overflow-hidden p-4 rounded-xl border border-bloom-border bg-bloom-card hover:bg-bloom-card-hover transition-all group"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${demo.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                        <div className="text-2xl mb-2">{demo.emoji}</div>
                                        <div className="text-sm font-medium text-bloom-text">{demo.label}</div>
                                        <div className="text-xs text-bloom-text-muted mt-1">Click to start instantly</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Or use AI */}
                        <div className="mt-6 flex items-center gap-2 text-xs text-bloom-text-muted">
                            <span className="h-px flex-1 bg-bloom-border" />
                            <span>or type anything above to generate with AI</span>
                            <span className="h-px flex-1 bg-bloom-border" />
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
                                    className="mt-4 flex flex-col items-center gap-2 p-4 bg-bloom-card border border-bloom-border rounded-xl shadow-lg"
                                >
                                    <MiniTree config={getTreeConfig(hoveredSkill)} size={80} />
                                    <span className="text-xs text-bloom-text-muted">
                                        {getTreeConfig(hoveredSkill).emoji} {getTreeConfig(hoveredSkill).name} Tree
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Demo Reset Button */}
                        {Object.keys(userData?.roadmaps || {}).length > 0 && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={handleDemoReset}
                                className="mt-6 flex items-center gap-2 text-xs text-bloom-text-muted hover:text-bloom-text transition-colors mx-auto"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Reset Demo
                            </motion.button>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="growth-section"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full"
                    >
                        <GrowthContainer
                            title={activeRoadmap.title || prompt}
                            description={activeRoadmap.description || "Complete tasks to grow your tree!"}
                            initialTasks={activeRoadmap.tasks}
                            onReset={handleReset}
                            onUpdate={handleTaskUpdate}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
