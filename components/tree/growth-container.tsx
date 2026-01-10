"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { TreeRenderer } from "./tree-renderer";
import { getTreeConfig } from "./tree-types";

import { TaskChecklist } from "./task-checklist";
import { useSound } from "@/components/use-sound";
import { useToast } from "@/components/toast";
import { Task } from "@/types";
import { useVimNavigation, VimHelpModal } from "@/hooks/use-vim-navigation";

const copyToClipboard = async (text: string, showToast: (msg: string, type: "success" | "error" | "info") => void) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast("Copied to clipboard! Share your progress with friends.", "success");
    } catch (err) {
        console.error("Failed to copy:", err);
        showToast("Failed to copy to clipboard", "error");
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
    // History stack for Undo
    const [history, setHistory] = useState<Task[][]>([]);

    // Reset history when initialTasks changes (e.g., switching gardens)
    React.useEffect(() => {
        setTasks(initialTasks);
        setHistory([]);
    }, [initialTasks]);

    const treeConfig = getTreeConfig(title);
    const { playPop } = useSound();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleToggle = useCallback((id: string) => {
        // specific check to prevent undoing if task is locked? handled in UI but good to know
        setHistory(prev => [...prev, tasks]); // Push current state to history
        const newTasks = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(newTasks);
        onUpdate(newTasks);
    }, [tasks, onUpdate]);

    const handleUndo = useCallback(() => {
        if (history.length === 0) return;
        const previousTasks = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));
        setTasks(previousTasks);
        onUpdate(previousTasks);
        showToast("Undid last action", "info");
    }, [history, onUpdate, showToast]);

    // Keyboard Shortcuts
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (e.target instanceof HTMLElement && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) {
                return;
            }

            // Undo: Cmd+Z or Ctrl+Z
            if ((e.metaKey || e.ctrlKey) && e.key === "z") {
                e.preventDefault();
                handleUndo();
            }

            // Next Task: Space
            if (e.code === "Space") {
                e.preventDefault();
                // Find first incomplete task
                const nextTaskIndex = tasks.findIndex(t => !t.completed);
                if (nextTaskIndex !== -1) {
                    // Check if locked (index > 0 and prev not completed)
                    const isLocked = nextTaskIndex > 0 && !tasks[nextTaskIndex - 1].completed;
                    if (!isLocked) {
                        handleToggle(tasks[nextTaskIndex].id);
                        playPop();
                    }
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleUndo, tasks, handleToggle, playPop]);

    // Calculate progress
    const completedCount = tasks.filter((t) => t.completed).length;
    const progress = (completedCount / tasks.length) * 100;
    const canUndo = history.length > 0;

    const handleShare = () => {
        const completedTasks = tasks.filter(t => t.completed).map(t => `✅ ${t.label}`).join("\n");
        const nextTask = tasks.find(t => !t.completed);
        const nextTaskText = nextTask ? `👉 Next: ${nextTask.label}` : "🎉 All Complete!";

        const emoji = progress < 25 ? "🌱" : progress < 50 ? "🌿" : progress < 75 ? "🌳" : "🌲";

        const shareText = `🌳 SkillBloom Update: ${title}\n${emoji} Progress: ${Math.round(progress)}%\n\n${completedTasks}\n${nextTaskText}\n\nGrow your own skills at using SkillBloom!`;

        copyToClipboard(shareText, showToast);
    };

    const handleExport = () => {
        const exportData = { title, description, tasks };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `skillbloom-${title.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("Progress exported! Keep this file to restore later.", "success");
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target?.result as string);
                if (imported.tasks && Array.isArray(imported.tasks)) {
                    setTasks(imported.tasks);
                    onUpdate(imported.tasks);
                    showToast("Progress imported successfully!", "success");
                } else {
                    showToast("Invalid file format", "error");
                }
            } catch {
                showToast("Failed to parse import file", "error");
            }
        };
        reader.readAsText(file);
        // Reset input so same file can be selected again
        e.target.value = "";
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
                <div className="bg-bloom-card/95 border border-bloom-border rounded-xl shadow-lg px-5 py-3">
                    <h2 className="text-xl font-bold text-bloom-text">{title}</h2>
                    <p className="text-sm text-bloom-text-muted">{description}</p>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                    <button
                        onClick={() => {
                            playPop();
                            onReset();
                        }}
                        className="text-xs text-bloom-text-muted hover:text-bloom-text bg-bloom-card hover:bg-bloom-card-hover px-3 py-1.5 rounded-lg border border-bloom-border transition-colors"
                    >
                        ← Back
                    </button>
                    {canUndo && (
                        <button
                            onClick={() => {
                                playPop();
                                handleUndo();
                            }}
                            className="text-xs text-bloom-text-muted hover:text-bloom-text bg-bloom-card hover:bg-bloom-card-hover px-3 py-1.5 rounded-lg border border-bloom-border transition-colors flex items-center gap-1"
                        >
                            <span className="kbd text-[10px] py-0 px-1 h-4">⌘Z</span> Undo
                        </button>
                    )}
                    <button
                        onClick={() => {
                            playPop();
                            handleShare();
                        }}
                        className="text-xs text-bloom-primary hover:text-bloom-accent bg-bloom-card hover:bg-bloom-card-hover px-3 py-1.5 rounded-lg border border-bloom-primary/30 transition-colors font-medium"
                    >
                        Share
                    </button>

                    <button
                        onClick={() => {
                            playPop();
                            handleExport();
                        }}
                        className="text-xs text-bloom-text-muted hover:text-bloom-text bg-bloom-card hover:bg-bloom-card-hover px-3 py-1.5 rounded-lg border border-bloom-border transition-colors"
                    >
                        Export
                    </button>
                    <label className="text-xs text-bloom-text-muted hover:text-bloom-text bg-bloom-card hover:bg-bloom-card-hover px-3 py-1.5 rounded-lg border border-bloom-border transition-colors cursor-pointer">
                        Import
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="hidden"
                        />
                    </label>
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
                <div className="bg-bloom-card/95 border border-bloom-border rounded-full shadow-lg px-6 py-3 flex items-center gap-4">
                    <div className="text-2xl">
                        {progress < 25 ? "🌱" : progress < 50 ? "🌿" : progress < 75 ? "🌳" : progress < 100 ? "🌲" : "🎉"}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-bloom-text">
                            {progress < 25 ? "Just Planted" : progress < 50 ? "Growing" : progress < 75 ? "Thriving" : progress < 100 ? "Almost There" : "Fully Grown!"}
                        </div>
                        <div className="w-32 h-2 bg-bloom-muted rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-bloom-primary to-bloom-accent rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", stiffness: 60 }}
                            />
                        </div>
                    </div>
                    <div className="text-lg font-bold text-bloom-primary font-mono">
                        {Math.round(progress)}%
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
