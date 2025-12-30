"use client";

import React from "react";
import { TreeConfig } from "./tree-types";
import { DeciduousTree, DeciduousConfig } from "./variants/deciduous-tree";
import { ConiferTree, ConiferConfig } from "./variants/conifer-tree";
import { TropicalTree, TropicalConfig } from "./variants/tropical-tree";
import { StalkTree, StalkConfig } from "./variants/stalk-tree";
import { DroopingTree, DroopingConfig } from "./variants/drooping-tree";
import { SucculentTree, SucculentConfig } from "./variants/succulent-tree";

interface TreeRendererProps {
    config: TreeConfig;
    progress: number;
}

export const TreeRenderer = ({ config, progress }: TreeRendererProps) => {
    switch (config.architecture) {
        case "deciduous":
            return <DeciduousTree progress={progress} config={config.config as DeciduousConfig} />;
        case "conifer":
            return <ConiferTree progress={progress} config={config.config as ConiferConfig} />;
        case "tropical":
            return <TropicalTree progress={progress} config={config.config as TropicalConfig} />;
        case "stalk":
            return <StalkTree progress={progress} config={config.config as StalkConfig} />;
        case "drooping":
            return <DroopingTree progress={progress} config={config.config as DroopingConfig} />;
        case "succulent":
            return <SucculentTree progress={progress} config={config.config as SucculentConfig} />;
        default:
            return <DeciduousTree progress={progress} config={config.config as DeciduousConfig} />;
    }
};

interface MiniTreeProps {
    config: TreeConfig;
    size?: number;
    className?: string;
}

export const MiniTree = ({ config, size = 60, className = "" }: MiniTreeProps) => {
    return (
        <div style={{ width: size, height: size }} className={className}>
            <TreeRenderer config={config} progress={100} />
        </div>
    );
};
