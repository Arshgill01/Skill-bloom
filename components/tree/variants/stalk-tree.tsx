"use client";

import React from "react";
import { motion } from "framer-motion";

export interface StalkConfig {
    stalkColor: string;
    segmentColor: string;
    leafColor: string;
}

interface StalkTreeProps {
    progress: number;
    config: StalkConfig;
}

export const StalkTree = ({ progress, config }: StalkTreeProps) => {
    const stage = Math.min(4, Math.floor(progress / 20));

    // Stalk configuration
    const stalkCount = [1, 2, 3, 4, 5][stage];
    const stalkHeight = [100, 200, 300, 400, 500][stage];

    // Generate stalks
    const stalks = React.useMemo(() => {
        return [...Array(stalkCount)].map((_, i) => ({
            x: (i - (stalkCount - 1) / 2) * 50, // Horizontally distributed
            height: stalkHeight * (0.8 + ((i * 12.34) % 1) * 0.4),
            lean: (((i * 56.78) % 1) - 0.5) * 20, // Slight random lean
            width: 15 + ((i * 90.12) % 1) * 10
        }));
    }, [stalkCount, stalkHeight]);

    // Dynamic viewBox
    const viewBoxHeight = Math.max(400, stalkHeight + 100);
    const viewBoxY = -(viewBoxHeight - 50);

    return (
        <svg
            viewBox={`-400 ${viewBoxY} 800 ${viewBoxHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMax meet"
        >
            {/* Ground */}
            <ellipse cx="0" cy="30" rx="350" ry="50" fill="#5D4037" opacity="0.2" />

            {/* Stalks */}
            {stalks.map((stalk, i) => {
                const segmentCount = Math.floor(stalk.height / 50);
                return (
                    <g key={`stalk-${i}`} transform={`translate(${stalk.x}, 0) rotate(${stalk.lean})`}>
                        {/* Segments */}
                        {[...Array(segmentCount)].map((_, j) => (
                            <motion.g key={j}
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                style={{ transformOrigin: "center bottom" }}
                                transition={{ delay: i * 0.2 + j * 0.1 }}
                            >
                                <rect
                                    x={-stalk.width / 2}
                                    y={-(j + 1) * 50}
                                    width={stalk.width}
                                    height={48} // Leave 2px gap for joint
                                    rx={2}
                                    fill={config.stalkColor}
                                />
                                {/* Joint */}
                                <rect
                                    x={-stalk.width / 2 - 2}
                                    y={-(j + 1) * 50 + 48}
                                    width={stalk.width + 4}
                                    height={2}
                                    fill={config.segmentColor}
                                />

                                {/* Leaves at joints */}
                                {(j > segmentCount / 3) && (j % 2 === i % 2) && (
                                    <motion.path
                                        d={`M ${stalk.width / 2} ${-(j + 1) * 50} Q ${stalk.width / 2 + 20} ${-(j + 1) * 50 - 10} ${stalk.width / 2 + 30} ${-(j + 1) * 50 + 10}`}
                                        stroke={config.leafColor}
                                        strokeWidth={1}
                                        fill={config.leafColor}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5 + i * 0.2 + j * 0.1 }}
                                    />
                                )}
                            </motion.g>
                        ))}
                    </g>
                );
            })}
        </svg>
    );
};
