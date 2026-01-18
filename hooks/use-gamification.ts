"use client";

import { useState, useEffect, useCallback } from "react";

interface StreakData {
    currentStreak: number;
    lastActiveDate: string; // ISO date string YYYY-MM-DD
    totalTasksCompleted: number;
    xp: number;
    level: number;
}

const STORAGE_KEY = "skill-bloom-gamification";
const XP_PER_TASK = 25;
const XP_STREAK_BONUS = 10; // Extra XP per task for active streak
const LEVEL_XP_MULTIPLIER = 100; // XP needed per level = level * 100

const getToday = () => new Date().toISOString().split("T")[0];

const calculateLevel = (xp: number): number => {
    // Level formula: level = floor(sqrt(xp / 100))
    // This means: level 1 = 100 XP, level 2 = 400 XP, level 3 = 900 XP, etc.
    return Math.floor(Math.sqrt(xp / LEVEL_XP_MULTIPLIER)) + 1;
};

const xpForLevel = (level: number): number => {
    return (level - 1) * (level - 1) * LEVEL_XP_MULTIPLIER;
};

const xpForNextLevel = (level: number): number => {
    return level * level * LEVEL_XP_MULTIPLIER;
};

export const useGamification = () => {
    const [data, setData] = useState<StreakData>({
        currentStreak: 0,
        lastActiveDate: "",
        totalTasksCompleted: 0,
        xp: 0,
        level: 1,
    });
    const [isHydrated, setIsHydrated] = useState(false);

    // Load from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Check and update streak
                const today = getToday();
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split("T")[0];

                let updatedStreak = parsed.currentStreak;

                // If last active wasn't today or yesterday, reset streak
                if (parsed.lastActiveDate !== today && parsed.lastActiveDate !== yesterdayStr) {
                    updatedStreak = 0;
                }

                setData({
                    ...parsed,
                    currentStreak: updatedStreak,
                    level: calculateLevel(parsed.xp),
                });
            }
        } catch (e) {
            console.error("Failed to load gamification data", e);
        } finally {
            setIsHydrated(true);
        }
    }, []);

    // Save to localStorage
    const saveData = useCallback((newData: StreakData) => {
        setData(newData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    }, []);

    // Record task completion
    const recordTaskCompletion = useCallback(() => {
        const today = getToday();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        let newStreak = data.currentStreak;

        // Update streak logic
        if (data.lastActiveDate === today) {
            // Already active today, streak stays same
        } else if (data.lastActiveDate === yesterdayStr) {
            // Consecutive day, increment streak
            newStreak = data.currentStreak + 1;
        } else {
            // Streak broken or first activity
            newStreak = 1;
        }

        // Calculate XP with streak bonus
        const streakBonus = newStreak > 1 ? XP_STREAK_BONUS * (newStreak - 1) : 0;
        const earnedXp = XP_PER_TASK + streakBonus;
        const newXp = data.xp + earnedXp;
        const newLevel = calculateLevel(newXp);

        const newData: StreakData = {
            currentStreak: newStreak,
            lastActiveDate: today,
            totalTasksCompleted: data.totalTasksCompleted + 1,
            xp: newXp,
            level: newLevel,
        };

        saveData(newData);

        return {
            earnedXp,
            streakBonus,
            leveledUp: newLevel > data.level,
            newLevel,
        };
    }, [data, saveData]);

    // Get progress to next level (0-100%)
    const levelProgress = useCallback(() => {
        const currentLevelXp = xpForLevel(data.level);
        const nextLevelXp = xpForNextLevel(data.level);
        const progress = ((data.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
        return Math.min(100, Math.max(0, progress));
    }, [data.xp, data.level]);

    return {
        streak: data.currentStreak,
        totalTasks: data.totalTasksCompleted,
        xp: data.xp,
        level: data.level,
        levelProgress: levelProgress(),
        xpToNextLevel: xpForNextLevel(data.level) - data.xp,
        isHydrated,
        recordTaskCompletion,
    };
};
