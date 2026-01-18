"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Check, ChevronDown, Sparkles, Trophy, Lock } from "lucide-react";
import clsx from "clsx";
import { useSound } from "@/components/use-sound";
import { Task } from "@/types";

interface TaskChecklistProps {
    tasks: Task[];
    onToggle: (id: string) => void;
    selectedIndex?: number;  // For vim navigation highlighting
}

export const TaskChecklist = ({ tasks, onToggle, selectedIndex = -1 }: TaskChecklistProps) => {
    const completedCount = tasks.filter((t) => t.completed).length;
    const progress = (completedCount / tasks.length) * 100;
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const { playPop, playSuccess } = useSound();

    // Effect to play success sound on 100% completion
    React.useEffect(() => {
        if (progress === 100) {
            playSuccess();
        }
    }, [progress, playSuccess]);

    // Calculate task state (locked/active/completed)
    const getTaskState = (index: number) => {
        if (tasks[index].completed) return "completed";
        const allPreviousCompleted = tasks.slice(0, index).every((t) => t.completed);
        return allPreviousCompleted ? "active" : "locked";
    };

    return (
        <div className="bg-bloom-card/95 border border-bloom-border rounded-xl shadow-lg p-5 w-full max-w-xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-end justify-between mb-4 px-1">
                <div>
                    <h3 className="text-lg font-bold text-bloom-text tracking-tight flex items-center gap-2">
                        Quest Log <Trophy className="text-bloom-accent" size={18} />
                    </h3>
                    <p className="text-xs text-bloom-text-muted mt-0.5 flex items-center gap-2">
                        Complete tasks in order
                        <span className="kbd text-[10px] px-1 py-0 h-4">?</span>
                        <span className="text-bloom-text-muted/60">for keys</span>
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-bloom-primary font-mono">
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="relative h-2 bg-bloom-muted rounded-full mb-4 overflow-hidden mx-1">
                <motion.div
                    className="h-full bg-gradient-to-r from-bloom-primary to-bloom-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                />
            </div>

            {/* Task list container */}
            <LayoutGroup>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-bloom-muted scrollbar-track-transparent pb-2">
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
                                playPop={playPop}
                                isSelected={index === selectedIndex}
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
                        className="absolute inset-0 flex items-center justify-center backdrop-blur-md z-10 rounded-xl"
                        style={{ backgroundColor: 'var(--bloom-card)' }}
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
                            <h4 className="text-2xl font-bold mb-2" style={{ color: 'var(--bloom-text)' }}>Quest Complete!</h4>
                            <p className="mb-6" style={{ color: 'var(--bloom-text-muted)' }}>You&apos;ve mastered this skill tree.</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2 text-white rounded-full font-bold shadow-lg transition-shadow"
                                style={{ backgroundColor: 'var(--bloom-primary)' }}
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
    state,
    playPop,
    isSelected = false
}: {
    task: Task;
    index: number;
    onToggle: () => void;
    isExpanded: boolean;
    setExpanded: () => void;
    state: "locked" | "active" | "completed";
    playPop: () => void;
    isSelected?: boolean;
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
                "relative group rounded-lg border transition-all duration-200",
                isSelected && "ring-2 ring-bloom-primary ring-offset-1 ring-offset-bloom-card",
                isCompleted
                    ? "bg-bloom-primary/5 border-bloom-primary/20"
                    : isLocked
                        ? "bg-bloom-muted/30 border-bloom-border/50"
                        : "bg-bloom-card border-bloom-border hover:border-bloom-primary/30"
            )}
        >
            {/* Pulsing Glow for Active Task */}
            {isActive && (
                <motion.div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    animate={{
                        boxShadow: [
                            "0 0 0 0 rgba(16, 185, 129, 0)",
                            "0 0 20px 4px rgba(16, 185, 129, 0.3)",
                            "0 0 0 0 rgba(16, 185, 129, 0)",
                        ],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            )}
            <div className="p-3">
                <div className="flex gap-3">
                    {/* Checkbox Area */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isLocked) {
                                onToggle();
                                if (!isCompleted) playPop(); // Play pop when checking (not unchecking)
                            }
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
                                    ? "border-transparent shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                    : isActive
                                        ? "border-bloom-primary animate-pulse"
                                        : "border-bloom-border"
                            )}
                            style={{
                                backgroundColor: isCompleted
                                    ? 'var(--bloom-primary)'
                                    : isActive
                                        ? 'var(--bloom-card)'
                                        : 'var(--bloom-card-hover)'
                            }}
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
                                        <Lock size={12} style={{ color: 'var(--bloom-text-muted)' }} />
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
                                className="font-bold text-sm leading-tight transition-colors"
                                style={{
                                    color: isCompleted
                                        ? 'var(--bloom-primary)'
                                        : isLocked
                                            ? 'var(--bloom-text-muted)'
                                            : 'var(--bloom-text)'
                                }}
                            >
                                {task.label}
                            </motion.h4>

                            {!isLocked && (
                                <motion.div
                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                    style={{ color: 'var(--bloom-text-muted)' }}
                                >
                                    <ChevronDown size={16} />
                                </motion.div>
                            )}
                        </div>

                        <motion.div layout="position" className="relative mt-1">
                            <p
                                className={clsx(
                                    "text-xs leading-relaxed transition-all duration-300",
                                    !isExpanded && "line-clamp-2"
                                )}
                                style={{
                                    color: isLocked
                                        ? 'var(--bloom-text-muted)'
                                        : 'var(--bloom-text-muted)',
                                    opacity: isLocked ? 0.6 : 1
                                }}
                            >
                                {task.description}
                            </p>

                            {/* Fade out gradient for collapsed text */}
                            {!isExpanded && !isLocked && (
                                <div
                                    className="absolute bottom-0 left-0 right-0 h-6"
                                    style={{
                                        background: isCompleted
                                            ? 'linear-gradient(to top, rgba(var(--bloom-primary-rgb, 16, 185, 129), 0.05), transparent)'
                                            : 'linear-gradient(to top, var(--bloom-card), transparent)'
                                    }}
                                />
                            )}
                        </motion.div>

                        {/* Learn Button (Smart Resource) */}
                        {isExpanded && !isLocked && task.searchQuery && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50"
                            >
                                <a
                                    href={`https://www.google.com/search?q=${encodeURIComponent(task.searchQuery)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-xs font-semibold text-bloom-primary hover:text-green-600 dark:hover:text-green-300 transition-colors bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900/40"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Sparkles size={12} />
                                    Learn: {task.searchQuery}
                                </a>
                            </motion.div>
                        )}
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
