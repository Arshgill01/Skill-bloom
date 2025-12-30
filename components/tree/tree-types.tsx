"use client";

import React from "react";
import { motion } from "framer-motion";

// ============== TREE TYPE DEFINITIONS ==============

export type TreeType = "oak" | "pine" | "palm" | "cherry" | "bamboo" | "willow";

// ============== SKILL TO TREE MAPPING ==============

const skillTreeMap: Record<string, TreeType> = {
    // Oak - Web/Frontend Technologies
    "react": "oak",
    "angular": "oak",
    "vue": "oak",
    "typescript": "oak",
    "javascript": "oak",
    "html": "oak",
    "css": "oak",
    "nextjs": "oak",
    "svelte": "oak",
    "tailwind": "oak",

    // Pine - Backend/Systems Languages
    "python": "pine",
    "go": "pine",
    "rust": "pine",
    "c++": "pine",
    "java": "pine",
    "c#": "pine",
    "kotlin": "pine",
    "scala": "pine",
    "ruby": "pine",
    "php": "pine",

    // Palm - Design/Creative
    "design": "palm",
    "ui/ux": "palm",
    "ux": "palm",
    "ui": "palm",
    "figma": "palm",
    "photoshop": "palm",
    "illustrator": "palm",
    "sketch": "palm",
    "graphic design": "palm",
    "web design": "palm",

    // Cherry Blossom - Languages
    "japanese": "cherry",
    "korean": "cherry",
    "mandarin": "cherry",
    "chinese": "cherry",
    "spanish": "cherry",
    "french": "cherry",
    "german": "cherry",
    "italian": "cherry",
    "portuguese": "cherry",
    "arabic": "cherry",

    // Bamboo - Physical/Wellness
    "yoga": "bamboo",
    "meditation": "bamboo",
    "martial arts": "bamboo",
    "dance": "bamboo",
    "music": "bamboo",
    "guitar": "bamboo",
    "piano": "bamboo",
    "fitness": "bamboo",
    "cooking": "bamboo",
    "chess": "bamboo",

    // Willow - Humanities/Soft Skills
    "writing": "willow",
    "poetry": "willow",
    "philosophy": "willow",
    "history": "willow",
    "psychology": "willow",
    "leadership": "willow",
    "communication": "willow",
    "public speaking": "willow",
    "marketing": "willow",
    "economics": "willow",
};

export const getTreeType = (skill: string): TreeType => {
    const normalized = skill.toLowerCase().trim();

    // Direct match
    if (skillTreeMap[normalized]) {
        return skillTreeMap[normalized];
    }

    // Partial match - check if skill contains a keyword
    for (const [key, treeType] of Object.entries(skillTreeMap)) {
        if (normalized.includes(key) || key.includes(normalized)) {
            return treeType;
        }
    }

    // Default to oak
    return "oak";
};

// ============== TREE COLORS ==============

export const treeColors: Record<TreeType, { primary: string; secondary: string; accent: string }> = {
    oak: { primary: "#4CAF50", secondary: "#81C784", accent: "#2E7D32" },
    pine: { primary: "#1B5E20", secondary: "#388E3C", accent: "#0D3F0D" },
    palm: { primary: "#8BC34A", secondary: "#AED581", accent: "#689F38" },
    cherry: { primary: "#F8BBD0", secondary: "#F48FB1", accent: "#EC407A" },
    bamboo: { primary: "#66BB6A", secondary: "#A5D6A7", accent: "#43A047" },
    willow: { primary: "#9CCC65", secondary: "#C5E1A5", accent: "#7CB342" },
};

// ============== MINI TREE COMPONENTS ==============

interface MiniTreeProps {
    size?: number;
    className?: string;
}

// Oak Tree - Rounded canopy
export const OakMini = ({ size = 60, className = "" }: MiniTreeProps) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        className={className}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
        {/* Trunk */}
        <motion.rect
            x="26" y="35" width="8" height="20" rx="2"
            fill="#6D4C41"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            style={{ transformOrigin: "center bottom" }}
        />
        {/* Canopy */}
        <motion.ellipse
            cx="30" cy="25" rx="22" ry="18"
            fill="#4CAF50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
        />
        <motion.ellipse
            cx="30" cy="22" rx="16" ry="13"
            fill="#66BB6A"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15 }}
        />
    </motion.svg>
);

// Pine Tree - Triangular conifer
export const PineMini = ({ size = 60, className = "" }: MiniTreeProps) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        className={className}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
        {/* Trunk */}
        <motion.rect
            x="26" y="45" width="8" height="12" rx="1"
            fill="#5D4037"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            style={{ transformOrigin: "center bottom" }}
        />
        {/* Layers */}
        <motion.polygon
            points="30,5 50,25 10,25"
            fill="#1B5E20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ transformOrigin: "center bottom" }}
            transition={{ delay: 0.2 }}
        />
        <motion.polygon
            points="30,15 52,35 8,35"
            fill="#2E7D32"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ transformOrigin: "center bottom" }}
            transition={{ delay: 0.1 }}
        />
        <motion.polygon
            points="30,25 54,48 6,48"
            fill="#388E3C"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ transformOrigin: "center bottom" }}
        />
    </motion.svg>
);

// Palm Tree - Tropical fronds
export const PalmMini = ({ size = 60, className = "" }: MiniTreeProps) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        className={className}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
        {/* Trunk - curved */}
        <motion.path
            d="M30 55 Q 28 40, 30 25"
            stroke="#8D6E63"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
        />
        {/* Fronds */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <motion.ellipse
                key={i}
                cx="30"
                cy="18"
                rx="3"
                ry="15"
                fill="#8BC34A"
                transform={`rotate(${angle} 30 25)`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.03 }}
            />
        ))}
        <motion.circle cx="30" cy="25" r="4" fill="#AED581" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} />
    </motion.svg>
);

// Cherry Blossom - Pink flowers
export const CherryMini = ({ size = 60, className = "" }: MiniTreeProps) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        className={className}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
        {/* Trunk */}
        <motion.path
            d="M30 55 Q 28 45, 25 35 Q 22 30, 20 25"
            stroke="#5D4037"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
        />
        <motion.path
            d="M30 35 Q 35 30, 40 25"
            stroke="#5D4037"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.1 }}
        />
        {/* Blossoms */}
        {[[18, 20], [25, 15], [35, 18], [42, 22], [20, 28], [38, 12]].map(([cx, cy], i) => (
            <motion.g key={i}>
                <motion.circle
                    cx={cx}
                    cy={cy}
                    r="6"
                    fill="#F8BBD0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.05, type: "spring" }}
                />
                <motion.circle
                    cx={cx}
                    cy={cy}
                    r="2"
                    fill="#FFEB3B"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                />
            </motion.g>
        ))}
    </motion.svg>
);

// Bamboo - Tall stalks
export const BambooMini = ({ size = 60, className = "" }: MiniTreeProps) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        className={className}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
        {/* Stalks */}
        {[18, 30, 42].map((x, i) => (
            <motion.g key={i}>
                <motion.rect
                    x={x - 3}
                    y="10"
                    width="6"
                    height="48"
                    rx="3"
                    fill="#66BB6A"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    style={{ transformOrigin: "center bottom" }}
                    transition={{ delay: i * 0.1 }}
                />
                {/* Segments */}
                {[20, 32, 44].map((y, j) => (
                    <motion.line
                        key={j}
                        x1={x - 3}
                        y1={y}
                        x2={x + 3}
                        y2={y}
                        stroke="#43A047"
                        strokeWidth="2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                    />
                ))}
                {/* Leaves */}
                <motion.ellipse
                    cx={x + 8}
                    cy={15 + i * 3}
                    rx="8"
                    ry="3"
                    fill="#A5D6A7"
                    transform={`rotate(-30 ${x + 8} ${15 + i * 3})`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                />
            </motion.g>
        ))}
    </motion.svg>
);

// Willow - Drooping branches
export const WillowMini = ({ size = 60, className = "" }: MiniTreeProps) => (
    <motion.svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        className={className}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
        {/* Trunk */}
        <motion.rect
            x="27" y="30" width="6" height="28" rx="2"
            fill="#8D6E63"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            style={{ transformOrigin: "center bottom" }}
        />
        {/* Canopy base */}
        <motion.ellipse
            cx="30" cy="25" rx="18" ry="12"
            fill="#9CCC65"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
        />
        {/* Drooping branches */}
        {[-20, -10, 0, 10, 20].map((offset, i) => (
            <motion.path
                key={i}
                d={`M ${30 + offset} 28 Q ${30 + offset + offset / 4} 42, ${30 + offset + offset / 2} 52`}
                stroke="#C5E1A5"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
            />
        ))}
    </motion.svg>
);

// ============== TREE COMPONENT SELECTOR ==============

export const MiniTree = ({ type, size = 60, className = "" }: { type: TreeType } & MiniTreeProps) => {
    const trees = {
        oak: OakMini,
        pine: PineMini,
        palm: PalmMini,
        cherry: CherryMini,
        bamboo: BambooMini,
        willow: WillowMini,
    };

    const TreeComponent = trees[type];
    return <TreeComponent size={size} className={className} />;
};

// ============== TREE INFO ==============

export const treeInfo: Record<TreeType, { name: string; emoji: string }> = {
    oak: { name: "Oak", emoji: "🌳" },
    pine: { name: "Pine", emoji: "🌲" },
    palm: { name: "Palm", emoji: "🌴" },
    cherry: { name: "Cherry Blossom", emoji: "🌸" },
    bamboo: { name: "Bamboo", emoji: "🎋" },
    willow: { name: "Willow", emoji: "🌿" },
};
