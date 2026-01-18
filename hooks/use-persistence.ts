"use client";

import { useState, useEffect, useCallback } from "react";
import { UserData, Roadmap } from "@/types";
import { useToast } from "@/components/toast";

const STORAGE_KEY = "skill-bloom-user-data";
const LEGACY_STORAGE_KEY = "skill-bloom-data";

export const usePersistence = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);
    const { showToast } = useToast();

    // Initial Load & Migration
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                setUserData(JSON.parse(saved));
            } else {
                // Check for legacy data
                const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
                if (legacy) {
                    try {
                        const legacyData = JSON.parse(legacy);
                        const newId = crypto.randomUUID();
                        const migratedRoadmap: Roadmap = {
                            ...legacyData,
                            id: newId,
                            createdAt: Date.now(),
                            lastActive: Date.now(),
                        };

                        const newUserData: UserData = {
                            activeRoadmapId: newId,
                            roadmaps: {
                                [newId]: migratedRoadmap,
                            },
                        };

                        setUserData(newUserData);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUserData));
                        localStorage.removeItem(LEGACY_STORAGE_KEY);
                        showToast("✨ Migrated your garden to the new system!", "success");
                    } catch (e) {
                        console.error("Migration failed", e);
                        // Fallback to empty if migration fails
                        setUserData({ activeRoadmapId: null, roadmaps: {} });
                    }
                } else {
                    // New user
                    setUserData({ activeRoadmapId: null, roadmaps: {} });
                }
            }
        } catch (e) {
            console.error("Failed to load data", e);
            setUserData({ activeRoadmapId: null, roadmaps: {} });
        } finally {
            setIsHydrated(true);
        }
    }, [showToast]);

    // Persist changes
    const saveUserData = useCallback((newData: UserData) => {
        setUserData(newData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    }, []);

    const addRoadmap = useCallback((roadmap: Roadmap) => {
        if (!userData) return;
        const newData = {
            ...userData,
            activeRoadmapId: roadmap.id,
            roadmaps: {
                ...userData.roadmaps,
                [roadmap.id]: roadmap
            }
        };
        saveUserData(newData);
    }, [userData, saveUserData]);

    const updateRoadmap = useCallback((updatedRoadmap: Roadmap) => {
        if (!userData) return;
        const newData = {
            ...userData,
            roadmaps: {
                ...userData.roadmaps,
                [updatedRoadmap.id]: {
                    ...updatedRoadmap,
                    lastActive: Date.now()
                }
            }
        };
        saveUserData(newData);
    }, [userData, saveUserData]);

    const deleteRoadmap = useCallback((id: string) => {
        if (!userData) return;
        const { [id]: _deleted, ...remaining } = userData.roadmaps;
        const remainingIds = Object.keys(remaining);

        const newData = {
            activeRoadmapId: userData.activeRoadmapId === id
                ? (remainingIds.length > 0 ? remainingIds[0] : null)
                : userData.activeRoadmapId,
            roadmaps: remaining
        };
        saveUserData(newData);
    }, [userData, saveUserData]);

    const setActiveRoadmap = useCallback((id: string) => {
        if (!userData) return;
        saveUserData({ ...userData, activeRoadmapId: id });
    }, [userData, saveUserData]);

    return {
        userData,
        isHydrated,
        addRoadmap,
        updateRoadmap,
        deleteRoadmap,
        setActiveRoadmap
    };
};
