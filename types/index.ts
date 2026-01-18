/**
 * Shared type definitions for SkillBloom
 */

export interface TaskResource {
    docs?: { title: string; url: string };
    video?: { title: string; channel: string; url: string };
    tip?: string;
}

export interface Task {
    id: string;
    label: string;
    description: string;
    completed: boolean;
    searchQuery?: string;
    resources?: TaskResource;
}

export interface Roadmap {
    id: string;
    title: string;
    description: string;
    tasks: Task[];
    createdAt: number;
    lastActive: number;
}

export interface UserData {
    activeRoadmapId: string | null;
    roadmaps: Record<string, Roadmap>;
}

export type TaskState = "locked" | "active" | "completed";
