"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle, Sparkles } from "lucide-react";
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

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-green-100 p-6 w-full max-w-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-green-900">Your Journey</h3>
                <span className="text-sm text-green-600 font-medium">
                    {completedCount}/{tasks.length}
                </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-green-100 rounded-full mb-6 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                />
            </div>

            {/* Task list */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {tasks.map((task, index) => (
                    <motion.button
                        key={task.id}
                        onClick={() => onToggle(task.id)}
                        className={clsx(
                            "w-full text-left p-4 rounded-2xl transition-all duration-200 group relative overflow-hidden",
                            task.completed
                                ? "bg-green-50 border-2 border-green-300"
                                : "bg-white border-2 border-gray-100 hover:border-green-200 hover:shadow-md"
                        )}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <div className="flex items-start gap-3">
                            {/* Checkbox */}
                            <div
                                className={clsx(
                                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                                    task.completed
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100 text-gray-400 group-hover:bg-green-100 group-hover:text-green-500"
                                )}
                            >
                                <AnimatePresence mode="wait">
                                    {task.completed ? (
                                        <motion.div
                                            key="check"
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <Check size={14} strokeWidth={3} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="circle"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <Circle size={14} strokeWidth={2} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div
                                    className={clsx(
                                        "font-semibold text-sm mb-1 transition-colors",
                                        task.completed ? "text-green-700 line-through" : "text-gray-800"
                                    )}
                                >
                                    {task.label}
                                </div>
                                <div
                                    className={clsx(
                                        "text-xs leading-relaxed",
                                        task.completed ? "text-green-600/70" : "text-gray-500"
                                    )}
                                >
                                    {task.description}
                                </div>
                            </div>

                            {/* Sparkle on complete */}
                            {task.completed && (
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="text-yellow-400"
                                >
                                    <Sparkles size={16} />
                                </motion.div>
                            )}
                        </div>

                        {/* Ripple effect on click */}
                        {task.completed && (
                            <motion.div
                                className="absolute inset-0 bg-green-400/10 rounded-2xl"
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 0.6 }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* 100% message */}
            <AnimatePresence>
                {completedCount === tasks.length && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl text-center"
                    >
                        <div className="text-2xl mb-1">🎉</div>
                        <div className="font-bold text-green-800">Congratulations!</div>
                        <div className="text-sm text-green-600">Your tree is fully grown!</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
