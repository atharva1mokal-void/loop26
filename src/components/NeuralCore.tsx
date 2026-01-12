'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/types';
import { useState, useEffect } from 'react';

interface NeuralCoreProps {
    projects: Project[];
}

export function NeuralCore({ projects }: NeuralCoreProps) {
    const [currentScan, setCurrentScan] = useState('');
    const [activeAngle, setActiveAngle] = useState(0);

    useEffect(() => {
        if (projects.length === 0) return;
        const interval = setInterval(() => {
            const randomProject = projects[Math.floor(Math.random() * projects.length)];
            setCurrentScan(randomProject.name);
        }, 4000);
        return () => clearInterval(interval);
    }, [projects]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveAngle(prev => (prev + 90) % 360);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col items-center justify-center text-center group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(147,51,234,0.1)_0%,transparent_70%)]" />

            <div className="relative w-48 h-48 mb-8">
                {/* Outer Scanning Ring */}
                <motion.div
                    className="absolute inset-0 border-t-2 border-l-2 border-purple-500/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />

                {/* Secondary Fast Pulse */}
                <motion.div
                    className="absolute inset-4 border border-blue-500/20 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />

                {/* Core Sphere */}
                <div className="absolute inset-10 flex items-center justify-center">
                    <motion.div
                        className="w-full h-full bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-900 rounded-full shadow-[0_0_50px_rgba(147,51,234,0.4)] relative overflow-hidden"
                        animate={{
                            scale: [1, 1.05, 1],
                            boxShadow: [
                                "0 0 50px rgba(147,51,234,0.4)",
                                "0 0 70px rgba(147,51,234,0.6)",
                                "0 0 50px rgba(147,51,234,0.4)"
                            ]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                        <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                            <motion.div
                                className="w-4 h-4 rounded-full bg-white opacity-40 blur-sm"
                                animate={{ scale: [1, 2, 1], opacity: [0.4, 0.1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Floating Orbitals */}
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 pointer-events-none"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8 + i * 4, repeat: Infinity, ease: "linear" }}
                    >
                        <div
                            className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"
                            style={{
                                marginLeft: '50%',
                                marginTop: -1,
                                transform: `translate(${24 + i * 8}px, 0)`
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10">
                <h3 className="text-[10px] font-black text-purple-400 tracking-[0.4em] uppercase mb-1">
                    Neural Intelligence
                </h3>
                <p className="text-xl font-black text-white tracking-tight mb-4">
                    Cognitive System Active
                </p>

                <div className="h-10">
                    <AnimatePresence mode='wait'>
                        {currentScan ? (
                            <motion.div
                                key={currentScan}
                                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest"
                            >
                                <span className="text-purple-400">ANALYZING:</span> {currentScan}
                            </motion.div>
                        ) : (
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest animate-pulse">
                                Initializing Core Data Stream...
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Interaction Indicators */}
            <div className="flex gap-1.5 mt-8">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-1 rounded-full bg-purple-500/30"
                        animate={{ height: ["4px", "16px", "4px"], backgroundColor: ["rgba(147,51,234,0.3)", "rgba(147,51,234,1)", "rgba(147,51,234,0.3)"] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
