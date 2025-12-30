
"use client";

import React, { useEffect, useCallback } from "react";
import ReactFlow, {
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    MarkerType,
    Background,
    Controls,
    useReactFlow,
    ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import BloomingNode from "@/components/blooming-node";

const nodeTypes = {
    blooming: BloomingNode,
};

// Dagre Layouting Logic
const getLayoutedElements = (nodes: any[], edges: any[], direction = "TB") => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        // Width/Height must match the approximate size of BloomingNode
        dagreGraph.setNode(node.id, { width: 300, height: 150 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - 150, // Center offset
                y: nodeWithPosition.y - 75,
            },
            targetPosition: "top",
            sourcePosition: "bottom",
        };
    });

    return { nodes: layoutedNodes, edges };
};

interface RoadmapGraphProps {
    initialNodes: any[];
    initialEdges: any[];
}

const RoadmapGraphInner = ({ initialNodes, initialEdges }: RoadmapGraphProps) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { fitView } = useReactFlow();

    // Layout Effect
    useEffect(() => {
        // Transform nodes to have proper React Flow structure
        const transformedNodes = initialNodes.map((node) => ({
            id: String(node.id),
            type: "blooming",
            data: {
                label: node.label,
                description: node.description,
                status: node.type === "flower" ? "completed" : node.type === "seed" ? "unlocked" : "unlocked",
            },
            position: { x: 0, y: 0 }, // Will be set by dagre
        }));

        // Transform edges to have proper IDs (React requires unique keys)
        const transformedEdges = initialEdges.map((edge, index) => ({
            id: `edge-${edge.source}-${edge.target}-${index}`,
            source: String(edge.source),
            target: String(edge.target),
            animated: true,
            style: { stroke: "#A5D6A7", strokeWidth: 2 },
        }));

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            transformedNodes,
            transformedEdges
        );
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);

        // Slight delay to allow render before fitting view
        setTimeout(() => fitView({ padding: 0.2 }), 100);
    }, [initialNodes, initialEdges, setNodes, setEdges, fitView]);

    return (
        <div className="w-full h-[700px] bg-white/50 rounded-[2rem] border border-white/60 shadow-xl shadow-bloom-primary/5 overflow-hidden relative backdrop-blur-sm">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-right"
                proOptions={{ hideAttribution: true }}
                minZoom={0.5}
                maxZoom={1.5}
            >
                <Background gap={40} size={2} color="#A5D6A7" className="opacity-10" />
                <Controls className="!bg-white !border-black/5 !shadow-lg !fill-bloom-text !rounded-xl overflow-hidden m-4" />
            </ReactFlow>

            {/* Decorative Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/30 via-transparent to-bloom-primary/5" />
        </div>
    );
};

export const RoadmapGraph = (props: RoadmapGraphProps) => {
    return (
        <ReactFlowProvider>
            <RoadmapGraphInner {...props} />
        </ReactFlowProvider>
    );
};
