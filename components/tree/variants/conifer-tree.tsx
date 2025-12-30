"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";

export interface ConiferConfig {
    foliageColor: string[]; // Gradient top to bottom
    trunkColor: string;
    widthScale?: number;
    snow?: boolean;
}

interface ConiferTreeProps {
    progress: number;
    config: ConiferConfig;
}

export const ConiferTree = ({ progress, config }: ConiferTreeProps) => {
    const stage = Math.min(4, Math.floor(progress / 20));

    // Dimensions
    const treeHeight = [60, 140, 260, 400, 520][stage];
    const trunkWidth = ([10, 20, 34, 50, 70][stage]) * (config.widthScale || 1);
    const layers = [1, 3, 5, 7, 9][stage]; // Number of foliage layers

    const foliageLayers = useMemo(() => {
        const result = [];
        for (let i = 0; i < layers; i++) {
            const relHeight = i / layers; // 0 (top) to 1 (bottom)
            const width = 40 + (i * 40 * (config.widthScale || 1));
            // y position: top is -treeHeight, bottom is -treeHeight * 0.2
            // We stack them from top down
            const y = -treeHeight + (i * (treeHeight * 0.8 / layers));

            result.push({
                y,
                width,
                height: treeHeight / layers * 1.5,
                color: config.foliageColor[Math.floor(relHeight * config.foliageColor.length)] || config.foliageColor[0],
                delay: i * 0.1
            });
        }
        return result;
    }, [layers, treeHeight, config.widthScale, config.foliageColor]);

    // Dynamic viewBox
    const viewBoxHeight = Math.max(400, treeHeight + 100);
    const viewBoxY = -(viewBoxHeight - 50);

    return (
        <svg
            viewBox={`-400 ${viewBoxY} 800 ${viewBoxHeight}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMax meet"
        >
            <defs>
                <linearGradient id="trunkGradPine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={config.trunkColor} />
                    <stop offset="50%" stopColor="#3E2723" />
                    <stop offset="100%" stopColor={config.trunkColor} />
                </linearGradient>
            </defs>

            {/* Ground */}
            <ellipse cx="0" cy="30" rx="350" ry="50" fill="#5D4037" opacity="0.2" />

            {/* Trunk */}
            <motion.rect
                x={-trunkWidth / 2}
                y={-treeHeight}
                width={trunkWidth}
                height={treeHeight + 20}
                rx={4}
                fill="url(#trunkGradPine)"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{ transformOrigin: "center bottom" }}
                transition={{ type: "spring", stiffness: 80 }}
            />

            {/* Foliage Layers */}
            {foliageLayers.map((layer, i) => (
                <motion.path
                    key={`layer-${i}`}
                    d={`M 0 ${layer.y - layer.height * 0.2} 
                       L ${layer.width / 2} ${layer.y + layer.height} 
                       L ${-layer.width / 2} ${layer.y + layer.height} Z`}
                    fill={layer.color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ transformOrigin: `0px ${layer.y + layer.height}px` }}
                    transition={{ delay: 0.2 + layer.delay, type: "spring" }}
                />
            ))}

            {/* Snow decoration if enabled */}
            {config.snow && progress > 50 && foliageLayers.map((layer, i) => (
                <motion.path
                    key={`snow-${i}`}
                    d={`M 0 ${layer.y - layer.height * 0.2} 
                       L ${layer.width * 0.2} ${layer.y + layer.height * 0.4}
                       L ${-layer.width * 0.2} ${layer.y + layer.height * 0.4} Z`}
                    fill="white"
                    opacity={0.8}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                />
            ))}

        </svg>
    );
};
