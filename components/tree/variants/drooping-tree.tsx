"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export interface DroopingConfig {
    trunkColor: string;
    branchColor: string;
    leafColor: string;
}

interface DroopingTreeProps {
    progress: number;
    config: DroopingConfig;
}

export const DroopingTree = ({ progress, config }: DroopingTreeProps) => {
    const stage = Math.min(4, Math.floor(progress / 20));

    // Dimensions
    const treeHeight = [60, 120, 200, 300, 380][stage];
    const trunkWidth = [10, 20, 35, 50, 70][stage];
    const canopyRadius = [20, 50, 90, 130, 170][stage];

    const droopingBranches = useMemo(() => {
        const count = Math.floor(canopyRadius / 5);
        const result = [];
        for (let i = 0; i < count; i++) {
            // Angle around the canopy
            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * canopyRadius;
            const z = Math.sin(angle) * canopyRadius; // Simulated depth
            // Higher probability of long branches on sides
            const length = treeHeight * 0.8 + Math.random() * treeHeight * 0.4;

            result.push({
                x,
                z, // Used for layering
                length,
                delay: i * 0.05
            });
        }
        return result.sort((a, b) => a.z - b.z); // Sort by depth
    }, [canopyRadius, treeHeight]);

    // Dynamic viewBox
    const viewBoxHeight = Math.max(400, treeHeight + 100);
    const viewBoxY = -(viewBoxHeight - 50);

    return (
        <svg
            viewBox={`-400 ${viewBoxY} 800 ${viewBoxHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMax meet"
        >
            {/* Ground */}
            <ellipse cx="0" cy="30" rx="350" ry="50" fill="#5D4037" opacity="0.2" />

            {/* Trunk */}
            <motion.rect
                x={-trunkWidth / 2}
                y={-treeHeight}
                width={trunkWidth}
                height={treeHeight}
                fill={config.trunkColor}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{ transformOrigin: "center bottom" }}
            />

            {/* Drooping Branches */}
            <g transform={`translate(0, ${-treeHeight})`}>
                {droopingBranches.map((branch, i) => (
                    <motion.path
                        key={`branch-${i}`}
                        d={`M ${branch.x * 0.2} 0 Q ${branch.x} -20 ${branch.x} ${branch.length}`}
                        stroke={config.branchColor}
                        strokeWidth={1.5}
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5 + branch.delay, type: "spring" }}
                    />
                ))}

                {/* Leaves on branches */}
                {progress > 40 && droopingBranches.map((branch, i) => (
                    <motion.path
                        key={`leaf-cluster-${i}`}
                        d={`M ${branch.x} ${branch.length} L ${branch.x - 5} ${branch.length + 10} L ${branch.x + 5} ${branch.length + 10} Z`}
                        fill={config.leafColor}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 + branch.delay }}
                    />
                ))}
            </g>

        </svg>
    );
};
