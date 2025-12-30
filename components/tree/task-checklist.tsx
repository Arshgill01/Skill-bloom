"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Check, ChevronDown, Sparkles, Trophy, Lock } from "lucide-react";
import clsx from "clsx";

interface Task {
    id: string;
    label: string;
    description: string;
    completed: boolean;
}

interface TaskChecklistProps {
    tasks: Task[];
    onToggle: (id: string) => void;
}

export const TaskChecklist = ({ tasks, onToggle }: TaskChecklistProps) => {
    const completedCount = tasks.filter((t) => t.completed).length;
    const progress = (completedCount / tasks.length) * 100;
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Calculate task state (locked/active/completed)
    const getTaskState = (index: number) => {
        if (tasks[index].completed) return "completed";
        const allPreviousCompleted = tasks.slice(0, index).every((t) => t.completed);
        return allPreviousCompleted ? "active" : "locked";
    };

    return (
        <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 dark:border-white/10 p-6 w-full max-w-xl relative overflow-hidden transition-colors duration-300">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/20 dark:bg-green-900/20 rounded-full blur-3xl -z-10 -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/20 dark:bg-blue-900/20 rounded-full blur-3xl -z-10 -ml-16 -mb-16 pointer-events-none" />

            {/* Header */}
            <div className="flex items-end justify-between mb-8 px-2">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight flex items-center gap-2">
                        Quest Log <Trophy className="text-yellow-500" size={20} />
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">
                        Your path to mastery
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-black text-green-600 dark:text-green-400">
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>

            {/* Enhanced Progress bar */}
            <div className="relative h-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-8 overflow-hidden shadow-inner border border-gray-200/50 dark:border-gray-700/50 mx-1">
                {/* Shimmer effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent w-full h-full -translate-x-full animate-[shimmer_2s_infinite]" />

                <motion.div
                    className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 rounded-full shadow-[0_2px_10px_rgba(16,185,129,0.3)] relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                >
                    {/* Glossy shine on progress bar */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-black/5" />
                </motion.div>
            </div>

            {/* Task list container */}
            <LayoutGroup>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent pb-4">
                    {tasks.map((task, index) => {
                        const state = getTaskState(index);
                        return (
                            <Card
                                key={task.id}
                                task={task}
                                index={index}
                                onToggle={() => onToggle(task.id)}
                                isExpanded={expandedId === task.id}
                                setExpanded={() => setExpandedId(expandedId === task.id ? null : task.id)}
                                state={state}
                            />
                        );
                    })}
                </div>
            </LayoutGroup>

            {/* Completion Message */}
            <AnimatePresence>
                {completedCount === tasks.length && tasks.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute inset-0 flex items-center justify-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-10 rounded-[2rem]"
                    >
                        <div className="text-center p-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                                transition={{ delay: 0.2 }}
                                className="text-6xl mb-4"
                            >
                                🏆
                            </motion.div>
                            <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Quest Complete!</h4>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">You've mastered this skill tree.</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 bg-green-500 text-white rounded-full font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-shadow"
                                onClick={() => {/* Optional: Reset or Navigate */ }}
                            >
                                Continue Journey
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Card = ({
    task,
    index,
    onToggle,
    isExpanded,
    setExpanded,
    state
}: {
    task: Task;
    index: number;
    onToggle: () => void;
    isExpanded: boolean;
    setExpanded: () => void;
    state: "locked" | "active" | "completed";
}) => {
    const isLocked = state === "locked";
    const isActive = state === "active";
    const isCompleted = state === "completed";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLocked ? 0.6 : 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={clsx(
                "relative group rounded-xl border transition-all duration-300",
                isCompleted
                    ? "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                    : isLocked
                        ? "bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800"
                        : "bg-white dark:bg-gray-800/80 border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700 hover:shadow-lg dark:hover:shadow-green-900/20 shadow-sm"
            )}
        >
            <div className="p-4">
                <div className="flex gap-4">
                    {/* Checkbox Area */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isLocked) onToggle();
                        }}
                        disabled={isLocked}
                        className={clsx(
                            "flex-shrink-0 pt-1 focus:outline-none",
                            isLocked && "cursor-not-allowed"
                        )}
                    >
                        <div
                            className={clsx(
                                "w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300",
                                isCompleted
                                    ? "bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                                    : isActive
                                        ? "bg-white dark:bg-gray-700 border-green-400 dark:border-green-500 animate-pulse"
                                        : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                            )}
                        >
                            <AnimatePresence mode="wait">
                                {isCompleted && (
                                    <motion.div
                                        key="check"
                                        initial={{ scale: 0, rotate: -90 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0 }}
                                    >
                                        <Check size={14} className="text-white" strokeWidth={3} />
                                    </motion.div>
                                )}
                                {isLocked && (
                                    <motion.div
                                        key="lock"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <Lock size={12} className="text-gray-400" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </button>

                    {/* Content Area */}
                    <div
                        className={clsx(
                            "flex-1 min-w-0",
                            !isLocked && "cursor-pointer"
                        )}
                        onClick={() => !isLocked && setExpanded()}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <motion.h4
                                layout="position"
                                className={clsx(
                                    "font-bold text-sm leading-tight transition-colors",
                                    isCompleted
                                        ? "text-green-800/70 dark:text-green-200/70"
                                        : isLocked
                                            ? "text-gray-400 dark:text-gray-500"
                                            : "text-gray-800 dark:text-gray-200"
                                )}
                            >
                                {task.label}
                            </motion.h4>

                            {!isLocked && (
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    className="text-gray-400 dark:text-gray-500"
                                >
                                    <ChevronDown size={16} />
                                </motion.div>
                            )}
                        </div>

                        <motion.div layout="position" className="relative mt-1">
                            <p
                                className={clsx(
                                    "text-xs leading-relaxed transition-all duration-300",
                                    isCompleted
                                        ? "text-green-800/80 dark:text-green-300/60"
                                        : isLocked
                                            ? "text-gray-500 dark:text-gray-600"
                                            : "text-gray-700 dark:text-gray-300",
                                    !isExpanded && "line-clamp-2"
                                )}
                            >
                                {task.description}
                            </p>

                            {/* Fade out gradient for collapsed text */}
                            {!isExpanded && !isLocked && (
                                <div className={clsx(
                                    "absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t",
                                    isCompleted
                                        ? "from-green-50/50 dark:from-green-900/10"
                                        : "from-white dark:from-gray-800"
                                )} />
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Active/Completed Indicators */}
            {isCompleted && (
                <motion.div
                    layoutId={`sparkle-${task.id}`}
                    className="absolute -top-1 -right-1 text-yellow-400 pointer-events-none"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                >
                    <Sparkles size={20} fill="currentColor" />
                </motion.div>
            )}

            {/* Selection/Hover Glow (only if not locked) */}
            {!isLocked && (
                <div className={clsx(
                    "absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none",
                    isCompleted ? "opacity-0" : "opacity-0 group-hover:opacity-100",
                    "bg-gradient-to-r from-green-400/5 via-transparent to-blue-400/5 dark:from-green-400/10 dark:to-blue-400/10"
                )} />
            )}
        </motion.div>
    );
};
