"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export interface TropicalConfig {
    trunkColor: string;
    frondColor: string[];
    hasCoconuts?: boolean;
    curveDirection?: number; // 0 = straight, 1 = right, -1 = left
}

interface TropicalTreeProps {
    progress: number;
    config: TropicalConfig;
}

export const TropicalTree = ({ progress, config }: TropicalTreeProps) => {
    const stage = Math.min(4, Math.floor(progress / 20));

    // Dimensions
    const treeHeight = [70, 160, 280, 500, 600][stage];
    const trunkWidth = [15, 25, 40, 55, 65][stage];
    const frondCount = [0, 3, 5, 7, 9][stage];
    const frondLength = [30, 60, 100, 150, 200][stage];

    // Curve
    const curve = (config.curveDirection || 0) * 100;

    const fronds = useMemo(() => {
        const result = [];
        for (let i = 0; i < frondCount; i++) {
            // Distribute angles in a fan shape at the top (from -30 to 210 degrees)
            // But actually palms have 360 spread? Let's do a fan.
            const angleDeg = (i / frondCount) * 360;
            const angleRad = (angleDeg * Math.PI) / 180;
            result.push({
                angle: angleRad,
                length: frondLength + Math.random() * 20,
                delay: i * 0.05,
                color: config.frondColor[i % config.frondColor.length]
            });
        }
        return result;
    }, [frondCount, frondLength, config.frondColor]);

    // Dynamic viewBox
    const viewBoxHeight = Math.max(400, treeHeight + 150);
    const viewBoxY = -(viewBoxHeight - 50);

    return (
        <svg
            viewBox={`-400 ${viewBoxY} 800 ${viewBoxHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMax meet"
        >
            {/* Ground */}
            <ellipse cx="0" cy="30" rx="350" ry="50" fill="#E6DAB2" opacity="0.4" /> {/* Sand color */}

            {/* Trunk */}
            {/* Using a quadratic bezier for curved trunk */}
            <motion.path
                d={`M 0 0 Q ${curve} ${-treeHeight / 2} ${curve / 2} ${-treeHeight}`}
                stroke={config.trunkColor}
                strokeWidth={trunkWidth}
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, type: "spring" }}
            />

            {/* Trunk Segments (Palm texture) */}
            {stage >= 2 && [...Array(Math.floor(treeHeight / 30))].map((_, i) => (
                <motion.circle
                    key={`seg-${i}`}
                    cx={0} /* Needs advanced math for point on Q curve, simplifying by just rendering on top */
                    cy={-i * 30}
                    r={trunkWidth / 2}
                    fill={config.trunkColor}
                    opacity={0} // Placeholder for texture logic improvement
                />
            ))}

            {/* Fronds */}
            <g transform={`translate(${curve / 2}, ${-treeHeight})`}>
                {fronds.map((frond, i) => (
                    <motion.path
                        key={`frond-${i}`}
                        d={`M 0 0 Q ${Math.cos(frond.angle) * frond.length / 2} ${Math.sin(frond.angle) * frond.length / 2 - 20} 
                        ${Math.cos(frond.angle) * frond.length} ${Math.sin(frond.angle) * frond.length}`}
                        stroke={frond.color}
                        strokeWidth={Math.max(2, trunkWidth / 4)}
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5 + frond.delay, type: "spring" }}
                    />
                ))}

                {/* Coconuts */}
                {config.hasCoconuts && progress >= 80 && [-1, 1].map((dir, i) => (
                    <motion.circle
                        key={`coconut-${i}`}
                        cx={dir * 15}
                        cy={10}
                        r={12}
                        fill="#5D4037"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5 + i * 0.1 }}
                    />
                ))}
            </g>

        </svg>
    );
};
