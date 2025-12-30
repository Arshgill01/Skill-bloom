"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { TreeRenderer } from "./tree-renderer";
import { getTreeConfig } from "./tree-types";

import { TaskChecklist } from "./task-checklist";
import { useSound } from "@/components/use-sound";

interface Task {
    id: string;
    label: string;
    description: string;
    completed: boolean;
    searchQuery?: string;
}

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard! Share your progress with friends.");
    } catch (err) {
        console.error("Failed to copy:", err);
    }
};

interface GrowthContainerProps {
    title: string;
    description: string;
    initialTasks: Task[];
    onReset: () => void;
    onUpdate: (tasks: Task[]) => void;
}

export const GrowthContainer = ({
    title,
    description,
    initialTasks,
    onReset,
    onUpdate,
}: GrowthContainerProps) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const treeConfig = getTreeConfig(title);
    const { playPop } = useSound();

    const handleToggle = useCallback((id: string) => {
        const newTasks = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(newTasks);
        onUpdate(newTasks);
    }, [tasks, onUpdate]);

    // Calculate progress
    const completedCount = tasks.filter((t) => t.completed).length;
    const progress = (completedCount / tasks.length) * 100;

    const handleShare = () => {
        const completedTasks = tasks.filter(t => t.completed).map(t => `✅ ${t.label}`).join("\n");
        const nextTask = tasks.find(t => !t.completed);
        const nextTaskText = nextTask ? `👉 Next: ${nextTask.label}` : "🎉 All Complete!";

        const emoji = progress < 25 ? "🌱" : progress < 50 ? "🌿" : progress < 75 ? "🌳" : "🌲";

        const shareText = `🌳 SkillBloom Update: ${title}\n${emoji} Progress: ${Math.round(progress)}%\n\n${completedTasks}\n${nextTaskText}\n\nGrow your own skills at using SkillBloom!`;

        copyToClipboard(shareText);
    };

    return (
        <div className="fixed inset-0 overflow-hidden">
            {/* Sky gradient background */}
            <div
                className="absolute inset-0 transition-all duration-1000"
                style={{
                    background: progress >= 75
                        ? "linear-gradient(to bottom, var(--sky-2-start) 0%, var(--sky-2-mid) 50%, var(--sky-2-end) 100%)"
                        : progress >= 50
                            ? "linear-gradient(to bottom, var(--sky-1-start) 0%, var(--sky-1-mid) 50%, var(--sky-1-end) 100%)"
                            : "linear-gradient(to bottom, var(--sky-0-start) 0%, var(--sky-0-mid) 50%, var(--sky-0-end) 100%)"
                }}
            />

            {/* Animated clouds */}
            <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden pointer-events-none">
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white/40 rounded-full blur-sm"
                        style={{
                            width: 100 + i * 40,
                            height: 40 + i * 15,
                            top: 20 + i * 25,
                            left: `${i * 25}%`,
                        }}
                        animate={{
                            x: [0, 30, 0],
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Sun (visible at high progress) */}
            {progress >= 50 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute top-8 right-24 w-24 h-24 rounded-full z-10"
                    style={{
                        background: "radial-gradient(circle, #FFF59D 0%, #FFEE58 50%, #FFCA28 100%)",
                        boxShadow: "0 0 80px 20px rgba(255, 235, 59, 0.4)",
                    }}
                />
            )}

            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-200 to-transparent" />

            {/* Tree container - full screen */}
            <div className="absolute inset-0 flex items-end justify-center pb-8">
                <div className="w-full max-w-4xl h-[85vh]">
                    <TreeRenderer config={treeConfig} progress={progress} />
                </div>
            </div>

            {/* Header overlay */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 left-4 z-20"
            >
                <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:border-white/10 px-5 py-3">
                    <h2 className="text-xl font-bold text-green-900 dark:text-green-100">{title}</h2>
                    <p className="text-sm text-green-600 dark:text-green-300">{description}</p>
                </div>
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={() => {
                            playPop();
                            onReset();
                        }}
                        className="text-xs text-white/80 hover:text-white bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors"
                    >
                        ← Start Over
                    </button>
                    <button
                        onClick={() => {
                            playPop();
                            handleShare();
                        }}
                        className="text-xs text-white/90 hover:text-white bg-bloom-primary/80 hover:bg-bloom-primary px-3 py-1.5 rounded-lg backdrop-blur-sm transition-colors font-medium flex items-center gap-1 shadow-lg shadow-bloom-primary/20"
                    >
                        Share Progress 📤
                    </button>
                </div>
            </motion.div>

            {/* Task Checklist Panel - Replaces FloatingTaskPanel */}
            <div className="absolute top-4 right-4 z-20 w-[420px]">
                <TaskChecklist
                    tasks={tasks}
                    onToggle={handleToggle}
                />
            </div>

            {/* Bottom progress indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
            >
                <div className="bg-white/90 dark:bg-black/70 backdrop-blur-xl rounded-full shadow-xl border border-white/50 dark:border-white/10 px-6 py-3 flex items-center gap-4">
                    <div className="text-2xl">
                        {progress < 25 ? "🌱" : progress < 50 ? "🌿" : progress < 75 ? "🌳" : progress < 100 ? "🌲" : "🎉"}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-green-900 dark:text-green-100">
                            {progress < 25 ? "Just Planted" : progress < 50 ? "Growing" : progress < 75 ? "Thriving" : progress < 100 ? "Almost There" : "Fully Grown!"}
                        </div>
                        <div className="w-32 h-2 bg-bloom-primary/20 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-bloom-primary to-bloom-text rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", stiffness: 60 }}
                            />
                        </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                        {Math.round(progress)}%
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
