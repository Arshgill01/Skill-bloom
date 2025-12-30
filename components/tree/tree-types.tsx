"use client";

import React from "react";
import { DeciduousConfig } from "./variants/deciduous-tree";
import { ConiferConfig } from "./variants/conifer-tree";
import { TropicalConfig } from "./variants/tropical-tree";
import { StalkConfig } from "./variants/stalk-tree";
import { DroopingConfig } from "./variants/drooping-tree";
import { SucculentConfig } from "./variants/succulent-tree";

// ============== TREE TYPE DEFINITIONS ==============

export type TreeArchitecture = "deciduous" | "conifer" | "tropical" | "stalk" | "drooping" | "succulent";

export type TreeVariant =
    | "oak" | "maple" | "birch" | "cherry" | "baobab" // Deciduous
    | "pine" | "spruce" // Conifer
    | "palm" | "coconut" // Tropical
    | "bamboo" // Stalk
    | "willow" // Drooping
    | "cactus" | "agave"; // Succulent

export interface TreeConfig {
    name: string;
    emoji: string;
    architecture: TreeArchitecture;
    config: DeciduousConfig | ConiferConfig | TropicalConfig | StalkConfig | DroopingConfig | SucculentConfig;
}

// ============== VARIANT CONFIGURATIONS ==============

export const TREE_VARIANTS: Record<string, TreeConfig> = {
    // --- Deciduous Variants ---
    oak: {
        name: "Oak",
        emoji: "🌳",
        architecture: "deciduous",
        config: {
            leafColor: ["#4CAF50", "#66BB6A", "#81C784"],
            trunkColor: ["#4E342E", "#6D4C41", "#8D6E63"],
            canopyShape: "round",
            trunkWidthScale: 1.0,
        } as DeciduousConfig
    },
    maple: {
        name: "Maple",
        emoji: "🍁",
        architecture: "deciduous",
        config: {
            leafColor: ["#FF5722", "#E64A19", "#BF360C", "#FFAB91"], // Fall colors
            trunkColor: ["#3E2723", "#4E342E", "#5D4037"],
            trunkTexture: "#3E2723",
            canopyShape: "round",
            trunkWidthScale: 0.9,
        } as DeciduousConfig
    },
    birch: {
        name: "Birch",
        emoji: "🌳",
        architecture: "deciduous",
        config: {
            leafColor: ["#FFEB3B", "#FDD835", "#FBC02D"], // Yellow/Gold leaves
            trunkColor: ["#F5F5F5", "#EEEEEE", "#E0E0E0"], // White trunk
            trunkTexture: "#212121", // Dark markings
            canopyShape: "oval",
            trunkWidthScale: 0.7, // Slender
        } as DeciduousConfig
    },
    cherry: {
        name: "Cherry Blossom",
        emoji: "🌸",
        architecture: "deciduous",
        config: {
            leafColor: ["#F8BBD0", "#F48FB1", "#EC407A"], // Pink
            trunkColor: ["#5D4037", "#6D4C41", "#795548"],
            canopyShape: "spread",
            trunkWidthScale: 0.8,
            flowerColor: "#FFF",
        } as DeciduousConfig
    },
    baobab: {
        name: "Baobab",
        emoji: "🌳", // No better emoji
        architecture: "deciduous",
        config: {
            leafColor: ["#33691E", "#558B2F", "#689F38"],
            trunkColor: ["#8D6E63", "#A1887F", "#BCAAA4"],
            canopyShape: "spread",
            trunkWidthScale: 2.0, // Thicc
        } as DeciduousConfig
    },

    // --- Conifer Variants ---
    pine: {
        name: "Pine",
        emoji: "🌲",
        architecture: "conifer",
        config: {
            foliageColor: ["#1B5E20", "#2E7D32", "#388E3C"],
            trunkColor: "#3E2723",
            widthScale: 1.0,
        } as ConiferConfig
    },
    spruce: {
        name: "Blue Spruce",
        emoji: "🌲",
        architecture: "conifer",
        config: {
            foliageColor: ["#546E7A", "#607D8B", "#78909C"], // Blue-ish
            trunkColor: "#455A64",
            widthScale: 1.2,
            snow: true,
        } as ConiferConfig
    },

    // --- Tropical Variants ---
    palm: {
        name: "Palm",
        emoji: "🌴",
        architecture: "tropical",
        config: {
            trunkColor: "#795548",
            frondColor: ["#64DD17", "#76FF03", "#B2FF59"],
            curveDirection: 1,
            hasCoconuts: false
        } as TropicalConfig
    },
    coconut: {
        name: "Coconut Palm",
        emoji: "🥥",
        architecture: "tropical",
        config: {
            trunkColor: "#5D4037",
            frondColor: ["#33691E", "#558B2F", "#689F38"],
            curveDirection: -1,
            hasCoconuts: true
        } as TropicalConfig
    },

    // --- Stalk Variants ---
    bamboo: {
        name: "Bamboo",
        emoji: "🎋",
        architecture: "stalk",
        config: {
            stalkColor: "#8BC34A",
            segmentColor: "#689F38",
            leafColor: "#558B2F"
        } as StalkConfig
    },

    // --- Drooping Variants ---
    willow: {
        name: "Willow",
        emoji: "🌿",
        architecture: "drooping",
        config: {
            trunkColor: "#4E342E",
            branchColor: "#8BC34A",
            leafColor: "#9CCC65"
        } as DroopingConfig
    },

    // --- Succulent Variants ---
    cactus: {
        name: "Cactus",
        emoji: "🌵",
        architecture: "succulent",
        config: {
            skinColor: "#43A047",
            spineColor: "#FFF",
            flowerColor: "#F48FB1"
        } as SucculentConfig
    },
    agave: { // Re-using cactus logic roughly or just mapping to cactus for now
        name: "Desert Blooms",
        emoji: "🌵",
        architecture: "succulent",
        config: {
            skinColor: "#00897B",
            spineColor: "#E0F2F1",
            flowerColor: "#FFEB3B"
        } as SucculentConfig
    },
};

// ============== SELECTION LOGIC ==============

export const getTreeConfig = (skill: string): TreeConfig => {
    const normalized = skill.toLowerCase().trim();
    const variantKeys = Object.keys(TREE_VARIANTS);

    // 1. Direct/Partial Keyword Mapping
    if (normalized.includes("pine") || normalized.includes("linux") || normalized.includes("rust") || normalized.includes("c++")) return TREE_VARIANTS.pine;
    if (normalized.includes("spruce") || normalized.includes("snow") || normalized.includes("cold")) return TREE_VARIANTS.spruce;
    if (normalized.includes("palm") || normalized.includes("beach") || normalized.includes("ui") || normalized.includes("design") || normalized.includes("figma")) return TREE_VARIANTS.palm;
    if (normalized.includes("coconut")) return TREE_VARIANTS.coconut;
    if (normalized.includes("cherry") || normalized.includes("japan") || normalized.includes("language") || normalized.includes("ruby")) return TREE_VARIANTS.cherry;
    if (normalized.includes("maple") || normalized.includes("game") || normalized.includes("canada")) return TREE_VARIANTS.maple;
    if (normalized.includes("birch") || normalized.includes("paper") || normalized.includes("doc")) return TREE_VARIANTS.birch;
    if (normalized.includes("bamboo") || normalized.includes("zen") || normalized.includes("yoga") || normalized.includes("meditation")) return TREE_VARIANTS.bamboo;
    if (normalized.includes("willow") || normalized.includes("cry") || normalized.includes("sad") || normalized.includes("py")) return TREE_VARIANTS.willow; // Python could be willow (snake like) or pine? 'py' matches python
    if (normalized.includes("cactus") || normalized.includes("desert") || normalized.includes("hot") || normalized.includes("dry")) return TREE_VARIANTS.cactus;
    if (normalized.includes("baobab")) return TREE_VARIANTS.baobab;
    if (normalized.includes("oak") || normalized.includes("react") || normalized.includes("web") || normalized.includes("js")) return TREE_VARIANTS.oak;
    if (normalized.includes("agave")) return TREE_VARIANTS.agave;

    // 2. Generic fallback groups
    if (normalized.includes("script") || normalized.includes("java")) return TREE_VARIANTS.oak;

    // 3. Deterministic Hash
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
        hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % variantKeys.length;
    return TREE_VARIANTS[variantKeys[index]];
};
