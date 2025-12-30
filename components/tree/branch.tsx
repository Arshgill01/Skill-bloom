"use client";

import React from "react";
import { motion } from "framer-motion";

interface BranchProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    delay?: number;
}

export const Branch = ({ x1, y1, x2, y2, delay = 0 }: BranchProps) => {
    // Calculate control points for a natural curve
    const midY = (y1 + y2) / 2;
    const curveStrength = Math.abs(x2 - x1) * 0.3;

    // Create organic bezier curve
    const path = `M ${x1} ${y1} C ${x1} ${midY - curveStrength}, ${x2} ${midY + curveStrength}, ${x2} ${y2}`;

    return (
        <motion.path
            d={path}
            stroke="url(#branchGradient)"
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
                pathLength: { delay, duration: 0.8, ease: "easeOut" },
                opacity: { delay, duration: 0.2 },
            }}
        />
    );
};
