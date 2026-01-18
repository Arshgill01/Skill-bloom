"use client";

import confetti from "canvas-confetti";
import { useCallback } from "react";

/**
 * Hook for celebration effects
 */
export const useConfetti = () => {
    const fireCelebration = useCallback(() => {
        // Multiple bursts for epic effect
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            // Burst from left
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ["#22c55e", "#10b981", "#4ade80", "#86efac", "#fbbf24"],
            });

            // Burst from right
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ["#22c55e", "#10b981", "#4ade80", "#86efac", "#fbbf24"],
            });
        }, 250);
    }, []);

    const fireSmallBurst = useCallback(() => {
        confetti({
            particleCount: 30,
            spread: 60,
            origin: { y: 0.7 },
            colors: ["#22c55e", "#10b981", "#4ade80"],
            zIndex: 9999,
        });
    }, []);

    return { fireCelebration, fireSmallBurst };
};
