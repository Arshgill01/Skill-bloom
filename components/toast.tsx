"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const getIcon = (type: ToastType) => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5" style={{ color: 'var(--bloom-primary)' }} />;
            case "error":
                return <AlertCircle className="w-5 h-5 text-red-400" />;
            default:
                return <Info className="w-5 h-5" style={{ color: 'var(--bloom-primary)' }} />;
        }
    };

    const getAccentColor = (type: ToastType) => {
        switch (type) {
            case "success":
                return 'var(--bloom-primary)';
            case "error":
                return '#ef4444';
            default:
                return 'var(--bloom-primary)';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
                            style={{
                                backgroundColor: 'var(--bloom-card)',
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderColor: getAccentColor(toast.type),
                                borderLeftWidth: '4px'
                            }}
                        >
                            {getIcon(toast.type)}
                            <p className="text-sm font-medium" style={{ color: 'var(--bloom-text)' }}>{toast.message}</p>
                            <button
                                onClick={() => dismissToast(toast.id)}
                                className="ml-2 p-1 rounded-lg transition-colors hover:opacity-70"
                                style={{ color: 'var(--bloom-text-muted)' }}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
