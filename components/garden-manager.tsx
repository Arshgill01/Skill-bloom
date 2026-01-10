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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                            style={{
                                backgroundColor: 'var(--bloom-card)',
                                borderColor: 'var(--bloom-border)',
                                borderWidth: '1px',
                                borderStyle: 'solid'
                            }}
                        >
                            {/* Header */}
                            <div
                                className="p-6 flex items-center justify-between"
                                style={{
                                    borderBottom: '1px solid var(--bloom-border)',
                                    backgroundColor: 'var(--bloom-card)'
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="p-2 rounded-xl"
                                        style={{ backgroundColor: 'var(--bloom-primary)', opacity: 0.15 }}
                                    >
                                        <TreeDeciduous className="w-6 h-6" style={{ color: 'var(--bloom-primary)' }} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold" style={{ color: 'var(--bloom-text)' }}>My Gardens</h2>
                                        <p className="text-sm" style={{ color: 'var(--bloom-text-muted)' }}>Manage your growing collection of skills</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full transition-colors hover:opacity-70"
                                    style={{ color: 'var(--bloom-text-muted)' }}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div
                                className="p-6 overflow-y-auto flex-1"
                                style={{ backgroundColor: 'var(--bloom-bg)' }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Create New Card */}
                                    <button
                                        onClick={() => {
                                            onCreate();
                                            onClose();
                                        }}
                                        className="group flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-2 border-dashed transition-all min-h-[220px] hover:scale-[1.02]"
                                        style={{
                                            borderColor: 'var(--bloom-border)',
                                            color: 'var(--bloom-text-muted)'
                                        }}
                                    >
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                                            style={{ backgroundColor: 'var(--bloom-card-hover)' }}
                                        >
                                            <Plus className="w-8 h-8" style={{ color: 'var(--bloom-primary)' }} />
                                        </div>
                                        <span className="font-bold text-lg" style={{ color: 'var(--bloom-text)' }}>Plant New Seed</span>
                                    </button>

                                    {/* Existing Gardens */}
                                    {roadmaps.map((roadmap) => {
                                        const progress = calculateProgress(roadmap);
                                        const isActive = userData.activeRoadmapId === roadmap.id;

                                        return (
                                            <div
                                                key={roadmap.id}
                                                className="relative group p-5 rounded-xl transition-all hover:scale-[1.02] flex flex-col justify-between min-h-[220px]"
                                                style={{
                                                    backgroundColor: isActive ? 'var(--bloom-card-hover)' : 'var(--bloom-card)',
                                                    borderWidth: '1px',
                                                    borderStyle: 'solid',
                                                    borderColor: isActive ? 'var(--bloom-primary)' : 'var(--bloom-border)',
                                                    boxShadow: isActive ? '0 0 0 1px var(--bloom-primary)' : 'none'
                                                }}
                                            >
                                                <div
                                                    onClick={() => {
                                                        onSelect(roadmap.id);
                                                        onClose();
                                                    }}
                                                    className="cursor-pointer flex-1"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div
                                                            className="p-2 rounded-lg"
                                                            style={{
                                                                backgroundColor: isActive ? 'var(--bloom-primary)' : 'var(--bloom-card-hover)',
                                                                color: isActive ? 'white' : 'var(--bloom-text-muted)'
                                                            }}
                                                        >
                                                            <Sprout className="w-5 h-5" />
                                                        </div>
                                                        {isActive && (
                                                            <span
                                                                className="text-xs font-bold px-2 py-1 rounded-full"
                                                                style={{
                                                                    backgroundColor: 'var(--bloom-primary)',
                                                                    color: 'white',
                                                                    opacity: 0.9
                                                                }}
                                                            >
                                                                Active
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3
                                                        className="font-bold text-lg mb-1 line-clamp-1"
                                                        style={{ color: 'var(--bloom-text)' }}
                                                    >
                                                        {roadmap.title}
                                                    </h3>
                                                    <p
                                                        className="text-sm line-clamp-2 mb-4 h-10"
                                                        style={{ color: 'var(--bloom-text-muted)' }}
                                                    >
                                                        {roadmap.description}
                                                    </p>

                                                    <div className="mt-auto">
                                                        <div className="flex justify-between text-xs font-medium mb-1" style={{ color: 'var(--bloom-text-muted)' }}>
                                                            <span>Growth</span>
                                                            <span className="font-mono">{progress}%</span>
                                                        </div>
                                                        <div
                                                            className="h-2 rounded-full overflow-hidden"
                                                            style={{ backgroundColor: 'var(--bloom-card-hover)' }}
                                                        >
                                                            <div
                                                                className="h-full transition-all duration-500"
                                                                style={{
                                                                    width: `${progress}%`,
                                                                    backgroundColor: 'var(--bloom-primary)'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div
                                                    className="flex justify-end mt-4 pt-4"
                                                    style={{ borderTop: '1px solid var(--bloom-border)' }}
                                                >
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm("Are you sure you want to delete this garden? This cannot be undone.")) {
                                                                onDelete(roadmap.id);
                                                            }
                                                        }}
                                                        className="p-2 rounded-lg transition-colors hover:bg-red-500/20 hover:text-red-400"
                                                        title="Delete Garden"
                                                        style={{ color: 'var(--bloom-text-muted)' }}
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
