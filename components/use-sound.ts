"use client";

import { useCallback } from "react";

export const useSound = () => {
    const playPop = useCallback(() => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = "sine";
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch {
            // Ignore audio errors
        }
    }, []);

    const playSuccess = useCallback(() => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();

            // Arpeggio
            [440, 554, 659, 880].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.connect(gain);
                gain.connect(ctx.destination);

                const startTime = ctx.currentTime + i * 0.1;

                osc.type = "triangle";
                osc.frequency.setValueAtTime(freq, startTime);

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.1, startTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

                osc.start(startTime);
                osc.stop(startTime + 0.4);
            });
        } catch {
            // Ignore audio errors
        }
    }, []);

    // Triumphant fanfare for level-ups
    const playLevelUp = useCallback(() => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();

            // Triumphant chord progression (C major -> G major -> C major high)
            const chords = [
                [261.63, 329.63, 392.00], // C major
                [392.00, 493.88, 587.33], // G major
                [523.25, 659.25, 783.99], // C major (high)
            ];

            chords.forEach((chord, chordIndex) => {
                chord.forEach((freq) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    const startTime = ctx.currentTime + chordIndex * 0.25;

                    osc.type = "triangle";
                    osc.frequency.setValueAtTime(freq, startTime);

                    gain.gain.setValueAtTime(0, startTime);
                    gain.gain.linearRampToValueAtTime(0.08, startTime + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

                    osc.start(startTime);
                    osc.stop(startTime + 0.5);
                });
            });
        } catch {
            // Ignore audio errors
        }
    }, []);

    return { playPop, playSuccess, playLevelUp };
};
