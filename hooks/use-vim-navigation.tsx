"use client";

import { useEffect, useCallback, useState } from "react";
import { Task } from "@/types";

interface UseVimNavigationOptions {
    tasks: Task[];
    onToggle: (id: string) => void;
    onUndo?: () => void;
    enabled?: boolean;
}

interface UseVimNavigationReturn {
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
    vimEnabled: boolean;
    toggleVimMode: () => void;
    showHelp: boolean;
    setShowHelp: (show: boolean) => void;
}

/**
 * Vim-style keyboard navigation for the task list
 * 
 * Keybindings:
 * - j / ↓: Move selection down
 * - k / ↑: Move selection up
 * - gg: Jump to first task
 * - G: Jump to last task
 * - x / Enter: Toggle selected task (if unlocked)
 * - u: Undo last action
 * - ?: Toggle help modal
 */
export const useVimNavigation = ({
    tasks,
    onToggle,
    onUndo,
    enabled = true,
}: UseVimNavigationOptions): UseVimNavigationReturn => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [vimEnabled, setVimEnabled] = useState(true);
    const [showHelp, setShowHelp] = useState(false);
    const [gPressed, setGPressed] = useState(false);

    const toggleVimMode = useCallback(() => {
        setVimEnabled((prev) => !prev);
    }, []);

    // Find first unlocked incomplete task
    const findFirstUnlockedIndex = useCallback(() => {
        for (let i = 0; i < tasks.length; i++) {
            const isLocked = i > 0 && !tasks[i - 1].completed;
            if (!isLocked && !tasks[i].completed) {
                return i;
            }
        }
        return 0;
    }, [tasks]);

    // Check if a task is actionable (unlocked)
    const isTaskUnlocked = useCallback((index: number) => {
        if (index === 0) return true;
        return tasks[index - 1]?.completed ?? false;
    }, [tasks]);

    useEffect(() => {
        if (!enabled || !vimEnabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            if (
                e.target instanceof HTMLElement &&
                (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
            ) {
                return;
            }

            const key = e.key.toLowerCase();

            // Handle gg (go to first)
            if (gPressed && key === "g") {
                e.preventDefault();
                setSelectedIndex(0);
                setGPressed(false);
                return;
            }

            // Reset g state if different key pressed
            if (gPressed && key !== "g") {
                setGPressed(false);
            }

            switch (key) {
                case "j":
                case "arrowdown":
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.min(prev + 1, tasks.length - 1));
                    break;

                case "k":
                case "arrowup":
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.max(prev - 1, 0));
                    break;

                case "g":
                    if (!gPressed) {
                        setGPressed(true);
                        // Reset after 1 second if no second g
                        setTimeout(() => setGPressed(false), 1000);
                    }
                    break;

                case "G": // Shift+G
                    e.preventDefault();
                    setSelectedIndex(tasks.length - 1);
                    break;

                case "x":
                case "enter":
                    e.preventDefault();
                    if (isTaskUnlocked(selectedIndex)) {
                        onToggle(tasks[selectedIndex].id);
                    }
                    break;

                case "u":
                    e.preventDefault();
                    onUndo?.();
                    break;

                case "?":
                    e.preventDefault();
                    setShowHelp((prev) => !prev);
                    break;

                case "escape":
                    e.preventDefault();
                    setShowHelp(false);
                    break;

                case "n":
                    // Jump to next unlocked task
                    e.preventDefault();
                    setSelectedIndex(findFirstUnlockedIndex());
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [enabled, vimEnabled, tasks, selectedIndex, onToggle, onUndo, gPressed, isTaskUnlocked, findFirstUnlockedIndex]);

    // Keep selected index in bounds when tasks change
    useEffect(() => {
        if (selectedIndex >= tasks.length) {
            setSelectedIndex(Math.max(0, tasks.length - 1));
        }
    }, [tasks.length, selectedIndex]);

    return {
        selectedIndex,
        setSelectedIndex,
        vimEnabled,
        toggleVimMode,
        showHelp,
        setShowHelp,
    };
};

// Help modal component
export const VimHelpModal = ({ onClose }: { onClose: () => void }) => {
    const bindings = [
        { key: "j / ↓", action: "Move down" },
        { key: "k / ↑", action: "Move up" },
        { key: "gg", action: "Jump to first" },
        { key: "G", action: "Jump to last" },
        { key: "n", action: "Next unlocked task" },
        { key: "x / Enter", action: "Toggle task" },
        { key: "u", action: "Undo" },
        { key: "Space", action: "Complete next" },
        { key: "?", action: "Toggle help" },
        { key: "Esc", action: "Close help" },
    ];

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-bloom-card border border-bloom-border rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-bloom-text">Keyboard Shortcuts</h3>
                    <span className="text-xs text-bloom-text-muted font-mono">vim mode</span>
                </div>
                <div className="space-y-2">
                    {bindings.map(({ key, action }) => (
                        <div key={key} className="flex items-center justify-between">
                            <span className="kbd">{key}</span>
                            <span className="text-sm text-bloom-text-muted">{action}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t border-bloom-border">
                    <p className="text-xs text-bloom-text-muted text-center">
                        Press <span className="kbd">?</span> to toggle this help
                    </p>
                </div>
            </div>
        </div>
    );
};
