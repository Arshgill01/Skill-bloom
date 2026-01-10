"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Sprout, TreeDeciduous } from "lucide-react";
import { UserData, Roadmap } from "@/types";

interface GardenManagerProps {
    isOpen: boolean;
    onClose: () => void;
    userData: UserData | null;
    onSelect: (id: string) => void;
    onCreate: () => void;
    onDelete: (id: string) => void;
}

export const GardenManager = ({
    isOpen,
    onClose,
    userData,
    onSelect,
    onCreate,
    onDelete
}: GardenManagerProps) => {
    if (!userData) return null;

    const roadmaps = Object.values(userData.roadmaps).sort((a, b) => b.lastActive - a.lastActive);

    const calculateProgress = (roadmap: Roadmap) => {
        if (!roadmap.tasks || roadmap.tasks.length === 0) return 0;
        const completed = roadmap.tasks.filter(t => t.completed).length;
        return Math.round((completed / roadmap.tasks.length) * 100);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-bloom-primary/20"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-bloom-primary/10 flex items-center justify-between bg-white/50 dark:bg-black/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-bloom-primary/10 rounded-xl">
                                        <TreeDeciduous className="w-6 h-6 text-bloom-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-bloom-text">My Gardens</h2>
                                        <p className="text-sm text-bloom-text/60">Manage your growing collection of skills</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-bloom-text/50" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto flex-1 bg-stone-50/50 dark:bg-black/20">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Create New Card */}
                                    <button
                                        onClick={() => {
                                            onCreate();
                                            onClose();
                                        }}
                                        className="group flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed border-bloom-primary/30 hover:border-bloom-primary/60 hover:bg-bloom-primary/5 transition-all text-bloom-primary/60 hover:text-bloom-primary min-h-[220px]"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-bloom-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Plus className="w-8 h-8" />
                                        </div>
                                        <span className="font-bold text-lg">Plant New Seed</span>
                                    </button>

                                    {/* Existing Gardens */}
                                    {roadmaps.map((roadmap) => {
                                        const progress = calculateProgress(roadmap);
                                        const isActive = userData.activeRoadmapId === roadmap.id;

                                        return (
                                            <div
                                                key={roadmap.id}
                                                className={`relative group p-5 rounded-2xl border transition-all hover:shadow-lg flex flex-col justify-between min-h-[220px] ${isActive
                                                        ? "bg-bloom-primary/5 border-bloom-primary ring-1 ring-bloom-primary"
                                                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-bloom-primary/50"
                                                    }`}
                                            >
                                                <div
                                                    onClick={() => {
                                                        onSelect(roadmap.id);
                                                        onClose();
                                                    }}
                                                    className="cursor-pointer flex-1"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className={`p-2 rounded-lg ${isActive ? "bg-bloom-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>
                                                            <Sprout className="w-5 h-5" />
                                                        </div>
                                                        {isActive && (
                                                            <span className="text-xs font-bold px-2 py-1 bg-bloom-primary/20 text-bloom-primary rounded-full">
                                                                Active
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="font-bold text-lg text-bloom-text mb-1 line-clamp-1">
                                                        {roadmap.title}
                                                    </h3>
                                                    <p className="text-sm text-bloom-text/60 line-clamp-2 mb-4 h-10">
                                                        {roadmap.description}
                                                    </p>

                                                    <div className="mt-auto">
                                                        <div className="flex justify-between text-xs font-medium text-bloom-text/60 mb-1">
                                                            <span>Growth</span>
                                                            <span>{progress}%</span>
                                                        </div>
                                                        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-bloom-primary transition-all duration-500"
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm("Are you sure you want to delete this garden? This cannot be undone.")) {
                                                                onDelete(roadmap.id);
                                                            }
                                                        }}
                                                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                                                        title="Delete Garden"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
