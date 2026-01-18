"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Sparkles, Trophy, Keyboard, TreeDeciduous } from "lucide-react";

const ONBOARDING_KEY = "skill-bloom-onboarding-completed";

interface OnboardingStep {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const steps: OnboardingStep[] = [
    {
        title: "Welcome to SkillBloom 🌱",
        description: "Turn any skill into a visual journey. Watch your knowledge tree grow as you complete milestones!",
        icon: <TreeDeciduous className="w-12 h-12 text-bloom-primary" />,
    },
    {
        title: "Gamified Learning",
        description: "Earn XP for every task you complete. Level up, maintain streaks, and celebrate with confetti! 🎊",
        icon: <Trophy className="w-12 h-12 text-yellow-400" />,
    },
    {
        title: "Vim-Style Navigation",
        description: "Power users love this! Use j/k to navigate, x to toggle, and ? for all keyboard shortcuts.",
        icon: <Keyboard className="w-12 h-12 text-bloom-accent" />,
    },
    {
        title: "Ready to Grow?",
        description: "Pick a demo roadmap or type any skill to generate your personalized learning path with AI.",
        icon: <Sparkles className="w-12 h-12 text-bloom-primary" />,
    },
];

export const OnboardingTour = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Check if onboarding has been completed
        const completed = localStorage.getItem(ONBOARDING_KEY);
        if (!completed) {
            // Small delay to let the page render first
            const timer = setTimeout(() => setIsOpen(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        localStorage.setItem(ONBOARDING_KEY, "true");
        setIsOpen(false);
    };

    const handleSkip = () => {
        localStorage.setItem(ONBOARDING_KEY, "true");
        setIsOpen(false);
    };

    if (!isOpen) return null;

    const step = steps[currentStep];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-bloom-card border border-bloom-border rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-bloom-border">
                        <div className="flex gap-2">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-colors ${i === currentStep
                                            ? "bg-bloom-primary"
                                            : i < currentStep
                                                ? "bg-bloom-primary/50"
                                                : "bg-bloom-muted"
                                        }`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={handleSkip}
                            className="text-bloom-text-muted hover:text-bloom-text transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 text-center">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-bloom-muted/50 rounded-2xl">
                                    {step.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-bloom-text">
                                {step.title}
                            </h3>
                            <p className="text-bloom-text-muted leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-bloom-border flex items-center justify-between">
                        <button
                            onClick={handleSkip}
                            className="text-sm text-bloom-text-muted hover:text-bloom-text transition-colors"
                        >
                            Skip tour
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNext}
                            className="flex items-center gap-2 bg-bloom-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-bloom-accent transition-colors"
                        >
                            {currentStep < steps.length - 1 ? (
                                <>
                                    Next
                                    <ChevronRight size={18} />
                                </>
                            ) : (
                                <>
                                    Get Started
                                    <Sparkles size={18} />
                                </>
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Hook to reset onboarding (useful for demo)
export const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
};
