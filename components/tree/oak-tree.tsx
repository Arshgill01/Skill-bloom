"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OakTreeProps {
    progress: number; // 0 to 100
}

export const OakTree = ({ progress }: OakTreeProps) => {
    // Determine growth stage (0-4)
    const stage = Math.min(4, Math.floor(progress / 20));

    // Tree dimensions based on stage - now larger for full-screen
    const treeHeight = [80, 180, 320, 460, 580][stage];
    const trunkWidth = [12, 24, 40, 60, 80][stage];
    const canopySize = [0, 60, 130, 200, 280][stage];
    const leafCount = [0, 8, 20, 40, 70][stage];
    const branchCount = [0, 2, 4, 6, 8][stage];

    // Generate leaf positions
    const leaves = useMemo(() => {
        const result = [];
        for (let i = 0; i < leafCount; i++) {
            const angle = (i / leafCount) * Math.PI * 2 + Math.random() * 0.3;
            const radius = canopySize * 0.3 + Math.random() * canopySize * 0.5;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius * 0.6 - canopySize * 0.2;
            const shade = Math.random();
            result.push({
                x, y,
                size: 12 + Math.random() * 25,
                delay: i * 0.03,
                color: shade > 0.6 ? "#81C784" : shade > 0.3 ? "#66BB6A" : "#4CAF50"
            });
        }
        return result;
    }, [leafCount, canopySize]);

    // Generate branch positions
    const branches = useMemo(() => {
        const result = [];
        for (let i = 0; i < branchCount; i++) {
            const heightRatio = 0.3 + (i / branchCount) * 0.5;
            const y = -treeHeight * heightRatio;
            const dir = i % 2 === 0 ? 1 : -1;
            const length = 40 + (i % 3) * 30;
            result.push({ y, dir, length, delay: 0.2 + i * 0.1 });
        }
        return result;
    }, [branchCount, treeHeight]);

    // Dynamic viewBox to always contain the tree
    const totalHeight = treeHeight + canopySize + 100; // tree + canopy + padding
    const viewBoxHeight = Math.max(400, totalHeight + 50);
    const viewBoxY = -(viewBoxHeight - 50);

    return (
        <svg
            viewBox={`-400 ${viewBoxY} 800 ${viewBoxHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMax meet"
        >
            <defs>
                {/* Trunk gradient with bark texture */}
                <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4E342E" />
                    <stop offset="30%" stopColor="#6D4C41" />
                    <stop offset="50%" stopColor="#8D6E63" />
                    <stop offset="70%" stopColor="#6D4C41" />
                    <stop offset="100%" stopColor="#4E342E" />
                </linearGradient>

                {/* Canopy shadow */}
                <filter id="canopyShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="8" stdDeviation="15" floodColor="#1B5E20" floodOpacity="0.25" />
                </filter>

                {/* Glow for flowers */}
                <filter id="flowerGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Ground with grass */}
            <ellipse cx="0" cy="30" rx="350" ry="50" fill="#5D4037" opacity="0.2" />
            {stage >= 1 && [...Array(20)].map((_, i) => (
                <motion.path
                    key={`grass-${i}`}
                    d={`M ${-250 + i * 25 + Math.random() * 10} 20 Q ${-250 + i * 25 + 5} -10, ${-250 + i * 25 + 3} -20`}
                    stroke="#66BB6A"
                    strokeWidth={2}
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.3 }}
                />
            ))}

            {/* Roots */}
            {stage >= 2 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {[-2, -1, 0, 1, 2].map((dir, i) => (
                        <motion.path
                            key={`root-${i}`}
                            d={`M 0 10 Q ${dir * 40} 30, ${dir * 80 + dir * 20} 25`}
                            stroke="#5D4037"
                            strokeWidth={6 + stage * 2}
                            fill="none"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                        />
                    ))}
                </motion.g>
            )}

            {/* Main trunk */}
            <motion.path
                d={`M ${-trunkWidth / 2} 0 
            L ${-trunkWidth / 2 - trunkWidth * 0.1} ${-treeHeight * 0.5}
            L ${-trunkWidth / 3} ${-treeHeight}
            L ${trunkWidth / 3} ${-treeHeight}
            L ${trunkWidth / 2 + trunkWidth * 0.1} ${-treeHeight * 0.5}
            L ${trunkWidth / 2} 0 Z`}
                fill="url(#trunkGrad)"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{ transformOrigin: "center bottom" }}
                transition={{ type: "spring", stiffness: 80, damping: 12 }}
            />

            {/* Bark texture lines */}
            {stage >= 2 && [...Array(Math.min(stage * 3, 10))].map((_, i) => (
                <motion.line
                    key={`bark-${i}`}
                    x1={-trunkWidth / 4 + (i % 3) * trunkWidth / 4}
                    y1={-treeHeight * (0.2 + (i * 0.08))}
                    x2={-trunkWidth / 4 + (i % 3) * trunkWidth / 4 + 3}
                    y2={-treeHeight * (0.2 + (i * 0.08)) - 20}
                    stroke="#3E2723"
                    strokeWidth={2}
                    opacity={0.3}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                />
            ))}

            {/* Branches */}
            {branches.map((branch, i) => (
                <motion.path
                    key={`branch-${i}`}
                    d={`M 0 ${branch.y} 
              Q ${branch.dir * branch.length * 0.5} ${branch.y - 15}, 
                ${branch.dir * branch.length} ${branch.y - 30}
              Q ${branch.dir * branch.length * 1.2} ${branch.y - 45},
                ${branch.dir * branch.length * 1.1} ${branch.y - 60}`}
                    stroke="url(#trunkGrad)"
                    strokeWidth={10 - i}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: branch.delay, duration: 0.5 }}
                />
            ))}

            {/* Canopy layers */}
            {canopySize > 0 && (
                <motion.g filter="url(#canopyShadow)">
                    {/* Back layer */}
                    <motion.ellipse
                        cx="0"
                        cy={-treeHeight - canopySize * 0.1}
                        rx={canopySize * 1.1}
                        ry={canopySize * 0.8}
                        fill="#388E3C"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 60, damping: 12 }}
                    />

                    {/* Middle layer */}
                    <motion.ellipse
                        cx="0"
                        cy={-treeHeight - canopySize * 0.2}
                        rx={canopySize * 0.9}
                        ry={canopySize * 0.65}
                        fill="#43A047"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 60 }}
                    />

                    {/* Front layer */}
                    <motion.ellipse
                        cx="0"
                        cy={-treeHeight - canopySize * 0.3}
                        rx={canopySize * 0.7}
                        ry={canopySize * 0.5}
                        fill="#4CAF50"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 60 }}
                    />

                    {/* Individual leaves */}
                    <AnimatePresence>
                        {leaves.map((leaf, i) => (
                            <motion.ellipse
                                key={`leaf-${i}`}
                                cx={leaf.x}
                                cy={-treeHeight - canopySize * 0.2 + leaf.y}
                                rx={leaf.size}
                                ry={leaf.size * 0.6}
                                fill={leaf.color}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0.9 }}
                                transition={{ delay: 0.3 + leaf.delay, type: "spring" }}
                            />
                        ))}
                    </AnimatePresence>
                </motion.g>
            )}

            {/* Stage 0: Tiny sprout */}
            {stage === 0 && (
                <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <ellipse cx="0" cy="-15" rx="12" ry="18" fill="#81C784" />
                    <ellipse cx="-10" cy="-10" rx="10" ry="14" fill="#A5D6A7" transform="rotate(-40, -10, -10)" />
                    <ellipse cx="8" cy="-8" rx="8" ry="12" fill="#A5D6A7" transform="rotate(30, 8, -8)" />
                </motion.g>
            )}

            {/* Flowers at 100% */}
            {progress >= 100 && (
                <motion.g filter="url(#flowerGlow)">
                    {[...Array(12)].map((_, i) => {
                        const angle = (i / 12) * Math.PI * 2;
                        const r = canopySize * 0.7;
                        const x = Math.cos(angle) * r;
                        const y = -treeHeight - canopySize * 0.2 + Math.sin(angle) * r * 0.5;
                        return (
                            <motion.g key={`flower-${i}`}>
                                {/* Petals */}
                                {[0, 72, 144, 216, 288].map((pAngle, j) => (
                                    <motion.ellipse
                                        key={`petal-${i}-${j}`}
                                        cx={x + Math.cos((pAngle * Math.PI) / 180) * 8}
                                        cy={y + Math.sin((pAngle * Math.PI) / 180) * 8}
                                        rx={6}
                                        ry={10}
                                        fill="#F8BBD0"
                                        transform={`rotate(${pAngle}, ${x + Math.cos((pAngle * Math.PI) / 180) * 8}, ${y + Math.sin((pAngle * Math.PI) / 180) * 8})`}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.8 + i * 0.1 + j * 0.03 }}
                                    />
                                ))}
                                {/* Center */}
                                <motion.circle
                                    cx={x}
                                    cy={y}
                                    r={5}
                                    fill="#FFEB3B"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.9 + i * 0.1 }}
                                />
                            </motion.g>
                        );
                    })}
                </motion.g>
            )}

            {/* Birds at high progress */}
            {progress >= 75 && (
                <motion.g
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                >
                    {[1, -1].map((dir, i) => (
                        <motion.path
                            key={`bird-${i}`}
                            d={`M ${dir * 150 + dir * i * 30} ${-treeHeight - canopySize - 50 - i * 20}
                  q ${dir * 15} -10, ${dir * 30} 0
                  q ${dir * 15} 10, ${dir * 30} 0`}
                            stroke="#5D4037"
                            strokeWidth={2}
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 1.2 + i * 0.2, duration: 0.5 }}
                        />
                    ))}
                </motion.g>
            )}
        </svg>
    );
};
