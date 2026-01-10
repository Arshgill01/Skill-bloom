"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Sparkles, Lock } from "lucide-react";
import clsx from "clsx";
import { Task } from "@/types";

interface FloatingTaskPanelProps {
    tasks: Task[];
    onToggle: (id: string) => void;
    progress: number;
}

export const FloatingTaskPanel = ({ tasks, onToggle, progress }: FloatingTaskPanelProps) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const completedCount = tasks.filter((t) => t.completed).length;

    // Find the index of the next unlocked task (first uncompleted task where all previous are completed)
    const getTaskState = (index: number): "completed" | "active" | "locked" => {
        if (tasks[index].completed) return "completed";

        // Check if all previous tasks are completed
        const allPreviousCompleted = tasks.slice(0, index).every((t) => t.completed);
        return allPreviousCompleted ? "active" : "locked";
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 right-4 w-80 max-h-[calc(100vh-120px)] z-20"
        >
            {/* Header - Always visible */}
            <motion.div
                onClick={() => setIsExpanded(!isExpanded)}
                className="bg-white/90 dark:bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 dark:border-white/10 cursor-pointer overflow-hidden"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-bloom-primary to-bloom-text flex items-center justify-center text-white dark:text-bloom-text font-bold text-sm shadow-lg">
                            {completedCount}/{tasks.length}
                        </div>
                        <div>
                            <div className="font-bold text-bloom-text text-sm">Your Progress</div>
                            <div className="text-xs text-bloom-text/70">{Math.round(progress)}% Complete</div>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-green-600"
                    >
                        <ChevronDown size={20} />
                    </motion.div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-bloom-primary/20">
                    <motion.div
                        className="h-full bg-gradient-to-r from-bloom-primary to-bloom-text"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 80 }}
                    />
                </div>
            </motion.div>

            {/* Expanded task list */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="bg-white/85 dark:bg-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 dark:border-white/10 overflow-hidden"
                    >
                        <div className="max-h-[400px] overflow-y-auto p-2">
                            {tasks.map((task, index) => {
                                const state = getTaskState(index);
                                const isLocked = state === "locked";
                                const isActive = state === "active";
                                const isCompleted = state === "completed";

                                return (
                                    <motion.button
                                        key={task.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!isLocked) {
                                                onToggle(task.id);
                                            }
                                        }}
                                        disabled={isLocked}
                                        className={clsx(
                                            "w-full text-left p-3 rounded-xl transition-all duration-200 group mb-1 last:mb-0 relative overflow-hidden",
                                            isCompleted && "bg-bloom-primary/10",
                                            isActive && "bg-white dark:bg-white/10 hover:bg-bloom-primary/5 ring-2 ring-bloom-primary ring-offset-1 dark:ring-offset-black",
                                            isLocked && "bg-gray-50/50 dark:bg-white/5 opacity-60 cursor-not-allowed"
                                        )}
                                        whileTap={!isLocked ? { scale: 0.98 } : undefined}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Checkbox / Lock */}
                                            <motion.div
                                                className={clsx(
                                                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                                                    isCompleted && "bg-bloom-primary text-bloom-text shadow-md shadow-bloom-primary/30",
                                                    isActive && "border-2 border-bloom-primary bg-bloom-primary/10",
                                                    isLocked && "bg-gray-200 dark:bg-gray-700 text-gray-400"
                                                )}
                                                whileTap={!isLocked ? { scale: 0.8 } : undefined}
                                                layout
                                            >
                                                <AnimatePresence mode="wait">
                                                    {isCompleted && (
                                                        <motion.div
                                                            key="check"
                                                            initial={{ scale: 0, rotate: -180 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            exit={{ scale: 0 }}
                                                            transition={{ type: "spring", stiffness: 300 }}
                                                        >
                                                            <Check size={14} strokeWidth={3} />
                                                        </motion.div>
                                                    )}
                                                    {isActive && (
                                                        <motion.div
                                                            key="active"
                                                            className="w-2 h-2 rounded-full bg-bloom-primary"
                                                            animate={{ scale: [1, 1.3, 1] }}
                                                            transition={{ duration: 1, repeat: Infinity }}
                                                        />
                                                    )}
                                                    {isLocked && (
                                                        <motion.div
                                                            key="lock"
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                        >
                                                            <Lock size={12} />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div
                                                    className={clsx(
                                                        "font-medium text-sm transition-colors truncate",
                                                        isCompleted && "text-bloom-text/70 line-through opacity-70",
                                                        isActive && "text-bloom-text font-bold",
                                                        isLocked && "text-gray-400"
                                                    )}
                                                >
                                                    {task.label}
                                                </div>
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        className="text-xs text-bloom-text/80 mt-0.5"
                                                    >
                                                        {task.description}
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Step number / Sparkle */}
                                            {isCompleted && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-yellow-400 flex-shrink-0"
                                                >
                                                    <Sparkles size={14} />
                                                </motion.div>
                                            )}
                                            {isLocked && (
                                                <span className="text-xs text-gray-400 font-medium">
                                                    #{index + 1}
                                                </span>
                                            )}
                                        </div>

                                        {/* Unlock animation overlay */}
                                        <AnimatePresence>
                                            {isActive && !isCompleted && index > 0 && (
                                                <motion.div
                                                    className="absolute inset-0 border-2 border-bloom-primary rounded-xl pointer-events-none"
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: [0, 1, 0], scale: 1 }}
                                                    transition={{ duration: 0.6 }}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Completion message */}
                        {completedCount === tasks.length && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100 text-center"
                            >
                                <div className="text-2xl mb-1">🎉</div>
                                <div className="font-bold text-bloom-text text-sm">Tree Fully Grown!</div>
                                <div className="text-xs text-bloom-text/80">All milestones completed</div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
