"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Branch } from "./branch";
import { BloomNode, NodeStatus } from "./bloom-node";

interface TreeNode {
    id: string;
    label: string;
    type: string;
    description?: string;
}

interface TreeEdge {
    source: string;
    target: string;
}

interface TreeCanvasProps {
    nodes: TreeNode[];
    edges: TreeEdge[];
}

interface LayoutNode extends TreeNode {
    x: number;
    y: number;
    depth: number;
    status: NodeStatus;
}

export const TreeCanvas = ({ nodes, edges }: TreeCanvasProps) => {
    const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set(["1"])); // Seed starts complete

    // Calculate tree layout
    const { layoutNodes, layoutEdges } = useMemo(() => {
        // Build adjacency list
        const children: Record<string, string[]> = {};
        const parents: Record<string, string> = {};

        edges.forEach((edge) => {
            if (!children[edge.source]) children[edge.source] = [];
            children[edge.source].push(edge.target);
            parents[edge.target] = edge.source;
        });

        // Find root (node with no parent)
        const root = nodes.find((n) => !parents[n.id])?.id || "1";

        // BFS to assign depths
        const depths: Record<string, number> = { [root]: 0 };
        const queue = [root];
        while (queue.length > 0) {
            const current = queue.shift()!;
            (children[current] || []).forEach((child) => {
                depths[child] = depths[current] + 1;
                queue.push(child);
            });
        }

        // Group by depth
        const byDepth: Record<number, string[]> = {};
        Object.entries(depths).forEach(([id, depth]) => {
            if (!byDepth[depth]) byDepth[depth] = [];
            byDepth[depth].push(id);
        });

        // Calculate positions
        const CANVAS_WIDTH = 800;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const CANVAS_HEIGHT = 800;
        const VERTICAL_SPACING = 120;
        const START_Y = 80;

        const positions: Record<string, { x: number; y: number }> = {};

        Object.entries(byDepth).forEach(([depthStr, nodeIds]) => {
            const depth = parseInt(depthStr);
            const y = START_Y + depth * VERTICAL_SPACING;
            const totalWidth = CANVAS_WIDTH - 100;
            const spacing = totalWidth / (nodeIds.length + 1);

            nodeIds.forEach((id, index) => {
                positions[id] = {
                    x: 50 + spacing * (index + 1),
                    y,
                };
            });
        });

        // Build layout nodes
        const layoutNodes: LayoutNode[] = nodes.map((node) => {
            const pos = positions[node.id] || { x: 400, y: 300 };
            const depth = depths[node.id] || 0;

            // Determine status based on type and completion
            let status: NodeStatus = "bud";
            if (node.type === "seed") status = "seed";
            else if (node.type === "flower") status = "flower";

            return {
                ...node,
                x: pos.x,
                y: pos.y,
                depth,
                status,
            };
        });

        // Build layout edges with positions
        const layoutEdges = edges.map((edge) => ({
            ...edge,
            x1: positions[edge.source]?.x || 0,
            y1: positions[edge.source]?.y || 0,
            x2: positions[edge.target]?.x || 0,
            y2: positions[edge.target]?.y || 0,
        }));

        return { layoutNodes, layoutEdges };
    }, [nodes, edges]);

    const handleNodeClick = (nodeId: string) => {
        setCompletedNodes((prev) => {
            const next = new Set(prev);
            if (next.has(nodeId)) {
                next.delete(nodeId);
            } else {
                next.add(nodeId);
            }
            return next;
        });
    };

    return (
        <div className="w-full h-[650px] bg-gradient-to-b from-sky-50 to-green-50 rounded-3xl border border-green-100 shadow-xl overflow-hidden relative">
            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-100 to-transparent" />

            <svg
                viewBox="0 0 800 600"
                className="w-full h-full"
                style={{ overflow: "visible" }}
            >
                {/* Definitions for gradients */}
                <defs>
                    <linearGradient id="branchGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8D6E63" />
                        <stop offset="100%" stopColor="#6D4C41" />
                    </linearGradient>
                    <radialGradient id="flowerGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#F8BBD0" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#F8BBD0" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* Trunk */}
                <motion.rect
                    x={395}
                    y={layoutNodes.find((n) => n.type === "seed")?.y || 80}
                    width={10}
                    height={40}
                    rx={3}
                    fill="url(#branchGradient)"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    style={{ transformOrigin: "center top" }}
                    transition={{ duration: 0.5 }}
                />

                {/* Branches */}
                {layoutEdges.map((edge, index) => (
                    <Branch
                        key={`${edge.source}-${edge.target}`}
                        x1={edge.x1}
                        y1={edge.y1 + 20}
                        x2={edge.x2}
                        y2={edge.y2 - 20}
                        delay={0.3 + index * 0.15}
                    />
                ))}

                {/* Nodes */}
                {layoutNodes.map((node, index) => (
                    <BloomNode
                        key={node.id}
                        x={node.x}
                        y={node.y}
                        label={node.label}
                        status={completedNodes.has(node.id) && node.status !== "seed" ? "flower" : node.status}
                        onClick={() => handleNodeClick(node.id)}
                        delay={0.5 + node.depth * 0.3}
                    />
                ))}
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 text-xs text-stone-600 shadow-sm">
                Click nodes to bloom 🌸
            </div>
        </div>
    );
};
