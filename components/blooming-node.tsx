"use client";

import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { motion, Variants } from "framer-motion";
import { Check, Lock } from "lucide-react";
import clsx from "clsx";

export type NodeStatus = "locked" | "unlocked" | "completed" | "generating";

interface BloomingNodeProps {
    data: {
        label: string;
        description?: string;
        status: NodeStatus;
        onToggle?: () => void;
    };
}

const BloomingNode = ({ data }: BloomingNodeProps) => {
    const { status, label, description, onToggle } = data;

    const isLocked = status === "locked";
    const isCompleted = status === "completed";
    const isUnlocked = status === "unlocked";

    // Framer Motion Variants for the "Bloom" effect
    const flowerVariants: Variants = {
        initial: { scale: 0.8, opacity: 0.9 },
        bloom: {
            scale: 1.1,
            opacity: 1,
            transition: { type: "spring" as const, stiffness: 200, damping: 10 }
        },
        hover: { scale: 1.15 }
    };

    return (
        <div className="relative group">
            {/* Invisible Handles for connections */}
            <Handle type="target" position={Position.Top} className="!bg-transparent !border-none" />
            <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-none" />

            <motion.div
                variants={flowerVariants}
                initial="initial"
                animate={isCompleted ? "bloom" : "initial"}
                whileHover={!isLocked ? "hover" : undefined}
                onClick={() => !isLocked && onToggle && onToggle()}
                className={clsx(
                    "w-72 p-5 rounded-3xl cursor-pointer transition-all duration-300 shadow-sm backdrop-blur-md border",
                    {
                        // Locked State: Gray/Brown, dormant
                        "bg-stone-50/80 border-stone-200 text-stone-400 grayscale": isLocked,

                        // Unlocked State: Green/Bud, ready to grow
                        "bg-white/90 border-bloom-primary/50 text-bloom-text shadow-bloom-primary/10 hover:shadow-xl hover:scale-[1.02] hover:border-bloom-primary": isUnlocked,

                        // Completed State: Pink/Flower, fully bloomed
                        "bg-gradient-to-br from-white to-pink-50 border-bloom-secondary/60 text-pink-900 shadow-lg shadow-pink-100/50": isCompleted,
                    }
                )}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-serif font-bold text-lg tracking-tight">{label}</span>
                        </div>

                        {description && (
                            <p className={clsx("text-sm leading-relaxed", isLocked ? "text-stone-400" : "text-stone-500")}>
                                {description}
                            </p>
                        )}
                    </div>

                    <div className={clsx("flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-colors", {
                        "bg-stone-100": isLocked,
                        "bg-bloom-primary/10 text-bloom-primary": isUnlocked,
                        "bg-pink-100 text-pink-600 shadow-inner": isCompleted
                    })}>
                        {isLocked && <Lock size={14} />}
                        {isUnlocked && <div className="w-2.5 h-2.5 rounded-full bg-bloom-primary animate-pulse" />}
                        {isCompleted && <Check size={16} strokeWidth={2.5} />}
                    </div>
                </div>
                {/* Decorative Petals (Only show when completed) */}
                {isCompleted && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-4 h-4 bg-pink-300 rounded-full opacity-50 blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-200 rounded-full opacity-50 blur-sm"
                        />
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default memo(BloomingNode);
