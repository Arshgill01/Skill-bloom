"use client";

import React from "react";
import { motion } from "framer-motion";

export type NodeStatus = "seed" | "bud" | "flower";

interface BloomNodeProps {
    x: number;
    y: number;
    label: string;
    status: NodeStatus;
    onClick?: () => void;
    delay?: number;
}

export const BloomNode = ({ x, y, label, status, onClick, delay = 0 }: BloomNodeProps) => {
    const isSeed = status === "seed";
    const isBud = status === "bud";
    const isFlower = status === "flower";

    // Petal positions (5 petals around center)
    const petalAngles = [0, 72, 144, 216, 288];

    return (
        <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay, type: "spring", stiffness: 200, damping: 15 }}
            style={{ cursor: "pointer" }}
            onClick={onClick}
        >
            {/* Glow effect for flowers */}
            {isFlower && (
                <motion.circle
                    cx={x}
                    cy={y}
                    r={35}
                    fill="url(#flowerGlow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}

            {/* Petals (only for flowers) */}
            {isFlower && petalAngles.map((angle, i) => {
                const petalX = x + Math.cos((angle * Math.PI) / 180) * 18;
                const petalY = y + Math.sin((angle * Math.PI) / 180) * 18;
                return (
                    <motion.ellipse
                        key={angle}
                        cx={petalX}
                        cy={petalY}
                        rx={12}
                        ry={8}
                        fill="#F8BBD0"
                        stroke="#F48FB1"
                        strokeWidth={1}
                        transform={`rotate(${angle + 90}, ${petalX}, ${petalY})`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: delay + 0.1 * i, type: "spring" }}
                    />
                );
            })}

            {/* Center circle */}
            <motion.circle
                cx={x}
                cy={y}
                r={isSeed ? 20 : isBud ? 16 : 14}
                fill={isSeed ? "#8D6E63" : isBud ? "#A5D6A7" : "#FFEB3B"}
                stroke={isSeed ? "#5D4037" : isBud ? "#66BB6A" : "#FBC02D"}
                strokeWidth={3}
                animate={isBud ? { scale: [1, 1.1, 1] } : {}}
                transition={isBud ? { duration: 1.5, repeat: Infinity } : {}}
            />

            {/* Seed sprout lines */}
            {isSeed && (
                <>
                    <motion.path
                        d={`M ${x} ${y - 20} Q ${x + 5} ${y - 30}, ${x + 3} ${y - 38}`}
                        stroke="#66BB6A"
                        strokeWidth={3}
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: delay + 0.3, duration: 0.5 }}
                    />
                    <motion.ellipse
                        cx={x + 8}
                        cy={y - 42}
                        rx={6}
                        ry={4}
                        fill="#81C784"
                        transform={`rotate(-30, ${x + 8}, ${y - 42})`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: delay + 0.6 }}
                    />
                </>
            )}

            {/* Label */}
            <motion.text
                x={x}
                y={y + (isSeed ? 45 : 40)}
                textAnchor="middle"
                fill="#1B5E20"
                fontSize={12}
                fontWeight={600}
                fontFamily="system-ui, sans-serif"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.2 }}
            >
                {label}
            </motion.text>
        </motion.g>
    );
};
