"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface Leaf {
    id: number;
    x: number;
    size: number;
    duration: number;
    delay: number;
    rotation: number;
    type: "leaf" | "petal";
}

export const FloatingLeaves = () => {
    const leaves = useMemo<Leaf[]>(() => {
        const items: Leaf[] = [];
        for (let i = 0; i < 12; i++) {
            items.push({
                id: i,
                x: 5 + Math.random() * 90, // Random horizontal position (%)
                size: 12 + Math.random() * 16, // 12-28px
                duration: 15 + Math.random() * 20, // 15-35s per cycle
                delay: Math.random() * -20, // Stagger start
                rotation: Math.random() * 360,
                type: Math.random() > 0.3 ? "leaf" : "petal",
            });
        }
        return items;
    }, []);

    return (
        <div
            className="fixed inset-0 pointer-events-none overflow-hidden z-0"
            aria-hidden="true"
        >
            {leaves.map((leaf) => (
                <motion.div
                    key={leaf.id}
                    className="absolute"
                    style={{
                        left: `${leaf.x}%`,
                        top: "-5%",
                    }}
                    animate={{
                        y: ["0vh", "110vh"],
                        x: [
                            "0px",
                            `${Math.sin(leaf.id) * 50}px`,
                            `${Math.sin(leaf.id + 1) * -30}px`,
                            `${Math.sin(leaf.id + 2) * 40}px`,
                            "0px",
                        ],
                        rotate: [leaf.rotation, leaf.rotation + 360],
                    }}
                    transition={{
                        duration: leaf.duration,
                        delay: leaf.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {leaf.type === "leaf" ? (
                        <svg
                            width={leaf.size}
                            height={leaf.size * 1.4}
                            viewBox="0 0 24 34"
                            fill="none"
                            className="opacity-40"
                        >
                            <path
                                d="M12 0C12 0 24 10 24 22C24 28 19 34 12 34C5 34 0 28 0 22C0 10 12 0 12 0Z"
                                fill="#81C784"
                            />
                            <path
                                d="M12 8V28M12 12L8 16M12 18L16 22"
                                stroke="#4CAF50"
                                strokeWidth="1"
                                opacity="0.5"
                            />
                        </svg>
                    ) : (
                        <svg
                            width={leaf.size}
                            height={leaf.size}
                            viewBox="0 0 24 24"
                            fill="none"
                            className="opacity-30"
                        >
                            <ellipse
                                cx="12"
                                cy="12"
                                rx="10"
                                ry="6"
                                fill="#F8BBD0"
                                transform="rotate(45 12 12)"
                            />
                        </svg>
                    )}
                </motion.div>
            ))}
        </div>
    );
};
