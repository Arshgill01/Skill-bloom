"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DeciduousConfig {
    leafColor: string[]; // Gradient/random options
    trunkColor: string[]; // Gradient
    trunkTexture?: string; // Color for bark lines
    trunkWidthScale?: number; // 1.0 is standard
    canopyShape?: "round" | "oval" | "spread";
    flowerColor?: string;
    hasFruits?: boolean;
}

interface DeciduousTreeProps {
    progress: number;
    config: DeciduousConfig;
}

export const DeciduousTree = ({ progress, config }: DeciduousTreeProps) => {
    // Determine growth stage (0-4)
    const stage = Math.min(4, Math.floor(progress / 20));

    // Tree dimensions based on stage
    const treeHeight = [80, 180, 320, 460, 580][stage];
    const trunkWidth = ([12, 24, 40, 60, 80][stage]) * (config.trunkWidthScale || 1);
    const canopySize = [0, 60, 130, 200, 280][stage];
    const leafCount = [0, 8, 20, 40, 70][stage];
    const branchCount = [0, 2, 4, 6, 8][stage];

    // Generate leaf positions
    const leaves = useMemo(() => {
        const result = [];
        for (let i = 0; i < leafCount; i++) {
            const angle = (i / leafCount) * Math.PI * 2 + Math.random() * 0.3;
            // Adjust radius based on canopy shape
            let radiusX = canopySize * 0.3 + Math.random() * canopySize * 0.5;
            let radiusY = radiusX;

            if (config.canopyShape === "oval") {
                radiusY *= 1.2;
            } else if (config.canopyShape === "spread") {
                radiusX *= 1.4;
            }

            const x = Math.cos(angle) * radiusX;
            const y = Math.sin(angle) * radiusY * 0.6 - canopySize * 0.2;
            const colorIndex = Math.floor(Math.random() * config.leafColor.length);

            result.push({
                x, y,
                size: 12 + Math.random() * 25,
                delay: i * 0.03,
                color: config.leafColor[colorIndex]
            });
        }
        return result;
    }, [leafCount, canopySize, config.leafColor, config.canopyShape]);

    // Generate branch positions
    const branches = useMemo(() => {
        const result = [];
        for (let i = 0; i < branchCount; i++) {
            const heightRatio = 0.3 + (i / branchCount) * 0.5;
            const y = -treeHeight * heightRatio;
            const dir = i % 2 === 0 ? 1 : -1;
            const length = (40 + (i % 3) * 30) * (config.trunkWidthScale || 1);
            result.push({ y, dir, length, delay: 0.2 + i * 0.1 });
        }
        return result;
    }, [branchCount, treeHeight, config.trunkWidthScale]);

    // Dynamic viewBox
    const totalHeight = treeHeight + canopySize + 100;
    const viewBoxHeight = Math.max(400, totalHeight + 50);
    const viewBoxY = -(viewBoxHeight - 50);

    return (
        <svg
            viewBox={`-400 ${viewBoxY} 800 ${viewBoxHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMax meet"
        >
            <defs>
                <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={config.trunkColor[0]} />
                    <stop offset="30%" stopColor={config.trunkColor[1] || config.trunkColor[0]} />
                    <stop offset="50%" stopColor={config.trunkColor[2] || config.trunkColor[0]} />
                    <stop offset="70%" stopColor={config.trunkColor[1] || config.trunkColor[0]} />
                    <stop offset="100%" stopColor={config.trunkColor[0]} />
                </linearGradient>

                <filter id="canopyShadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="8" stdDeviation="15" floodColor="rgba(0,0,0,0.2)" />
                </filter>
            </defs>

            {/* Ground */}
            <ellipse cx="0" cy="30" rx="350" ry="50" fill="#5D4037" opacity="0.2" />

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

            {/* Bark texture */}
            {stage >= 2 && config.trunkTexture && [...Array(Math.min(stage * 3, 10))].map((_, i) => (
                <motion.line
                    key={`bark-${i}`}
                    x1={-trunkWidth / 4 + (i % 3) * trunkWidth / 4}
                    y1={-treeHeight * (0.2 + (i * 0.08))}
                    x2={-trunkWidth / 4 + (i % 3) * trunkWidth / 4 + 3}
                    y2={-treeHeight * (0.2 + (i * 0.08)) - 20}
                    stroke={config.trunkTexture}
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
                    strokeWidth={Math.max(2, (10 - i) * (config.trunkWidthScale || 1))}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: branch.delay, duration: 0.5 }}
                />
            ))}

            {/* Canopy */}
            {canopySize > 0 && (
                <motion.g filter="url(#canopyShadow)">
                    {/* Simplified layers for generic deciduous */}
                    {[0.9, 1.0, 0.8].map((s, i) => (
                        <motion.ellipse
                            key={i}
                            cx={0}
                            cy={-treeHeight - canopySize * (0.1 + i * 0.1)}
                            rx={canopySize * s * (config.canopyShape === "spread" ? 1.3 : 1)}
                            ry={canopySize * s * 0.8 * (config.canopyShape === "oval" ? 1.2 : 1)}
                            fill={config.leafColor[i % config.leafColor.length]}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1, type: "spring", stiffness: 60 }}
                        />
                    ))}

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

            {/* Flowers/Fruits for final stage */}
            {progress >= 100 && config.flowerColor && (
                <motion.g>
                    {[...Array(12)].map((_, i) => {
                        const angle = (i / 12) * Math.PI * 2;
                        const r = canopySize * 0.7;
                        const x = Math.cos(angle) * r;
                        const y = -treeHeight - canopySize * 0.2 + Math.sin(angle) * r * 0.5;
                        return (
                            <motion.circle
                                key={`flower-${i}`}
                                cx={x}
                                cy={y}
                                r={6}
                                fill={config.flowerColor}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8 + i * 0.05 }}
                            />
                        );
                    })}
                </motion.g>
            )}
        </svg>
    );
};
