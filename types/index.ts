/**
 * Shared type definitions for SkillBloom
 */

export interface Task {
    id: string;
    label: string;
    description: string;
    completed: boolean;
    searchQuery?: string;
}

export interface Roadmap {
    title: string;
    description: string;
    tasks: Task[];
}

export type TaskState = "locked" | "active" | "completed";
