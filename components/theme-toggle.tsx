"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Leaf } from "lucide-react";

type Theme = "light" | "dark" | "autumn";

const themes: { id: Theme; icon: React.ReactNode; label: string }[] = [
    { id: "light", icon: <Sun className="w-4 h-4" />, label: "Light" },
    { id: "dark", icon: <Moon className="w-4 h-4" />, label: "Dark" },
    { id: "autumn", icon: <Leaf className="w-4 h-4" />, label: "Autumn" },
];

export const ThemeToggle = () => {
    const [theme, setTheme] = useState<Theme>("light");
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Load theme from localStorage on mount
    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("theme") as Theme;
        if (saved && ["light", "dark", "autumn"].includes(saved)) {
            setTheme(saved);
            document.documentElement.classList.remove("light", "dark", "autumn");
            document.documentElement.classList.add(saved);
        }
    }, []);

    // Prevent hydration mismatch by rendering placeholder until mounted
    if (!mounted) {
        return (
            <div className="p-2.5 rounded-xl bg-white/70 backdrop-blur-sm border border-green-100 shadow-sm w-9 h-9" />
        );
    }

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.remove("light", "dark", "autumn");
        document.documentElement.classList.add(newTheme);
        setIsOpen(false);
    };

    const currentTheme = themes.find((t) => t.id === theme) || themes[0];

    return (
        <div className="relative">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-green-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Current theme: ${currentTheme.label}. Click to change.`}
            >
                <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    className="text-green-600 dark:text-green-400"
                >
                    {currentTheme.icon}
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-green-100 dark:border-gray-700 overflow-hidden"
                        >
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => handleThemeChange(t.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${theme === t.id
                                        ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                        : "text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <span className="text-green-500">{t.icon}</span>
                                    {t.label}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
