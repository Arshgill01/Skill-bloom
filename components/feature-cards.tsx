"use client";

import React from "react";
import { motion } from "framer-motion";
import { History, Flame, TrendingUp, ChevronRight } from "lucide-react";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    highlight: string;
    highlightColor: string;
    delay: number;
}

const FeatureCard = ({
    icon,
    title,
    description,
    highlight,
    highlightColor,
    delay,
}: FeatureCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="group relative flex-1 min-w-[280px] p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
    >
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl ${highlightColor} flex items-center justify-center mb-4 shadow-sm`}>
                {icon}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-green-900 mb-2">{title}</h3>

            {/* Description */}
            <p className="text-stone-500 text-sm mb-4 leading-relaxed">{description}</p>

            {/* Highlight stat/info */}
            <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${highlightColor.includes('green') ? 'text-green-600' : highlightColor.includes('orange') ? 'text-orange-600' : 'text-pink-600'}`}>
                    {highlight}
                </span>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    </motion.div>
);

// Mock data for the cards
const mockHistory = [
    { skill: "React Basics", progress: 75 },
    { skill: "Python Fundamentals", progress: 40 },
    { skill: "Chess Openings", progress: 90 },
];

export const FeatureCards = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-4xl mt-16"
        >
            {/* Section Header */}
            <div className="text-center mb-8">
                <p className="text-stone-400 text-sm uppercase tracking-wider font-medium">
                    Your Growth Dashboard
                </p>
            </div>

            {/* Cards Container */}
            <div className="flex flex-wrap gap-4 justify-center">
                {/* Learning History Card */}
                <FeatureCard
                    icon={<History className="w-6 h-6 text-green-600" />}
                    title="Learning History"
                    description="Pick up where you left off. Your skill trees are saved and waiting to bloom."
                    highlight={`${mockHistory.length} skills in progress`}
                    highlightColor="bg-green-100"
                    delay={0.4}
                />

                {/* Daily Streak Card */}
                <FeatureCard
                    icon={<Flame className="w-6 h-6 text-orange-500" />}
                    title="Daily Streak"
                    description="Keep the momentum going! Consistent learning builds lasting skills."
                    highlight="🔥 7 day streak"
                    highlightColor="bg-orange-100"
                    delay={0.5}
                />

                {/* Trending Skills Card */}
                <FeatureCard
                    icon={<TrendingUp className="w-6 h-6 text-pink-500" />}
                    title="Trending Skills"
                    description="See what others are learning. Get inspired by popular skill paths."
                    highlight="AI & Machine Learning"
                    highlightColor="bg-pink-100"
                    delay={0.6}
                />
            </div>
        </motion.div>
    );
};
