"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export interface SucculentConfig {
    skinColor: string;
    spineColor: string;
    flowerColor?: string;
}

interface SucculentTreeProps {
    progress: number;
    config: SucculentConfig;
}

export const SucculentTree = ({ progress, config }: SucculentTreeProps) => {
    const stage = Math.min(4, Math.floor(progress / 20));

    // Cactus growth logic - main stem + arms
    const height = [40, 90, 160, 240, 320][stage];
    const width = [20, 35, 50, 70, 90][stage];
    const arms = [0, 0, 1, 2, 3][stage];

    const generateSpines = (w: number, h: number) => {
        const spines = [];
        const rows = Math.floor(h / 20);
        const cols = Math.floor(w / 15);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (Math.random() > 0.5) {
                    spines.push({ x: -w / 2 + 5 + c * 15, y: -h + 10 + r * 20 });
                }
            }
        }
        return spines;
    };

    const mainSpines = useMemo(() => generateSpines(width, height), [width, height]);

    // Dynamic viewBox
    const viewBoxHeight = Math.max(400, height + 100);
    const viewBoxY = -(viewBoxHeight - 50);

    return (
        <svg
            viewBox={`-400 ${viewBoxY} 800 ${viewBoxHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMax meet"
        >
            {/* Ground */}
            <ellipse cx="0" cy="30" rx="350" ry="50" fill="#E0E0E0" opacity="0.4" /> {/* Desert sand */}

            {/* Main Stem */}
            <motion.rect
                x={-width / 2}
                y={-height}
                width={width}
                height={height}
                rx={width / 2}
                fill={config.skinColor}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{ transformOrigin: "center bottom" }}
            />

            {/* Spines */}
            {mainSpines.map((s, i) => (
                <motion.circle
                    key={`spine-${i}`}
                    cx={s.x}
                    cy={s.y}
                    r={1}
                    fill={config.spineColor}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.01 }}
                />
            ))}

            {/* Arms */}
            {arms > 0 && [-1].map(dir => ( // Simplify to one arm for now or dynamic
                <g key="arm-left" transform={`translate(${-width / 2}, ${-height * 0.6})`}>
                    <motion.path
                        d={`M 0 0 Q ${-50} 0 ${-50} -50 L ${-50} -100 Q ${-50} -120 ${-30} -120 L ${-width / 2} -120`}
                        stroke={config.skinColor}
                        strokeWidth={width * 0.7}
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1 }}
                    />
                </g>
            ))}

            {arms > 1 && [1].map(dir => (
                <g key="arm-right" transform={`translate(${width / 2}, ${-height * 0.4})`}>
                    <motion.path
                        d={`M 0 0 Q ${50} 0 ${50} -50 L ${50} -80`}
                        stroke={config.skinColor}
                        strokeWidth={width * 0.7}
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 1.2 }}
                    />
                </g>
            ))}

            {/* Flower */}
            {progress >= 100 && config.flowerColor && (
                <motion.circle
                    cx={0}
                    cy={-height - 5}
                    r={15}
                    fill={config.flowerColor}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2, type: "spring" }}
                />
            )}

        </svg>
    );
};
