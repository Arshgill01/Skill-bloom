"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Zap, Trophy } from "lucide-react";

interface XpBarProps {
    level: number;
    xp: number;
    levelProgress: number;
    xpToNextLevel: number;
    streak: number;
    isCompact?: boolean;
}

export const XpBar = ({
    level,
    xp,
    levelProgress,
    xpToNextLevel,
    streak,
    isCompact = false,
}: XpBarProps) => {
    if (isCompact) {
        return (
            <div className="flex items-center gap-3 bg-bloom-card/95 border border-bloom-border rounded-full px-4 py-2 shadow-lg">
                {/* Level Badge */}
                <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-full bg-bloom-primary/20 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-bloom-primary" />
                    </div>
                    <span className="text-sm font-bold text-bloom-text">Lv.{level}</span>
                </div>

                {/* XP Bar */}
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <div className="w-20 h-2 bg-bloom-muted rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${levelProgress}%` }}
                            transition={{ type: "spring", stiffness: 50 }}
                        />
                    </div>
                </div>

                {/* Streak */}
                {streak > 0 && (
                    <div className="flex items-center gap-1 text-orange-400">
                        <Flame className="w-4 h-4" />
                        <span className="text-sm font-bold">{streak}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-bloom-card/95 border border-bloom-border rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
                {/* Level Badge */}
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bloom-primary to-bloom-accent flex items-center justify-center shadow-lg shadow-bloom-primary/30">
                        <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="text-xs text-bloom-text-muted">Level</div>
                        <div className="text-xl font-bold text-bloom-text">{level}</div>
                    </div>
                </div>

                {/* Streak */}
                {streak > 0 && (
                    <div className="flex items-center gap-2 bg-orange-500/10 px-3 py-1.5 rounded-full">
                        <Flame className="w-5 h-5 text-orange-400" />
                        <span className="text-lg font-bold text-orange-400">{streak} day{streak > 1 ? "s" : ""}</span>
                    </div>
                )}
            </div>

            {/* XP Progress */}
            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-bloom-text-muted flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        {xp.toLocaleString()} XP
                    </span>
                    <span className="text-bloom-text-muted">{xpToNextLevel.toLocaleString()} to level {level + 1}</span>
                </div>
                <div className="w-full h-3 bg-bloom-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${levelProgress}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />
                </div>
            </div>
        </div>
    );
};

// Toast for XP gain
interface XpGainToastProps {
    xp: number;
    streakBonus?: number;
}

export const XpGainIndicator = ({ xp, streakBonus = 0 }: XpGainToastProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-bold px-4 py-2 rounded-full shadow-lg shadow-yellow-500/30"
        >
            <Zap className="w-5 h-5" />
            <span>+{xp} XP</span>
            {streakBonus > 0 && (
                <span className="text-orange-700 text-sm">(+{streakBonus} streak bonus!)</span>
            )}
        </motion.div>
    );
};
