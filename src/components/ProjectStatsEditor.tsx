'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/types';
import { updateProjectStats } from '@/app/actions';
import { Settings, X, Save, BarChart } from 'lucide-react';

interface ProjectStatsEditorProps {
    project: Project;
}

export function ProjectStatsEditor({ project }: ProjectStatsEditorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [stats, setStats] = useState(project.stats || {
        efficiency: 85,
        codeQuality: 90,
        testCoverage: 50
    });

    const handleSave = async () => {
        await updateProjectStats(project.id, stats);
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 bg-[var(--surface-1)] hover:bg-[var(--surface-2)] rounded-lg text-[var(--text-secondary)] hover:text-white transition-colors"
                title="Edit Statistics"
            >
                <Settings className="w-4 h-4" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[#0a0a0a] border border-[var(--glass-border)] w-full max-w-sm rounded-xl p-6 relative z-10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold flex items-center gap-2">
                                    <BarChart className="w-5 h-5 text-[var(--neon-blue)]" />
                                    Project Statistics
                                </h3>
                                <button onClick={() => setIsOpen(false)}><X className="w-5 h-5 text-[var(--text-secondary)]" /></button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-[var(--text-secondary)] uppercase flex justify-between">
                                        Efficiency <span>{stats.efficiency}%</span>
                                    </label>
                                    <input
                                        type="range" min="0" max="100"
                                        value={stats.efficiency}
                                        onChange={(e) => setStats({ ...stats, efficiency: parseInt(e.target.value) })}
                                        className="w-full mt-1 accent-[var(--neon-purple)]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--text-secondary)] uppercase flex justify-between">
                                        Code Quality <span>{stats.codeQuality}%</span>
                                    </label>
                                    <input
                                        type="range" min="0" max="100"
                                        value={stats.codeQuality}
                                        onChange={(e) => setStats({ ...stats, codeQuality: parseInt(e.target.value) })}
                                        className="w-full mt-1 accent-[var(--neon-blue)]"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--text-secondary)] uppercase flex justify-between">
                                        Test Coverage <span>{stats.testCoverage}%</span>
                                    </label>
                                    <input
                                        type="range" min="0" max="100"
                                        value={stats.testCoverage}
                                        onChange={(e) => setStats({ ...stats, testCoverage: parseInt(e.target.value) })}
                                        className="w-full mt-1 accent-[var(--neon-cyan)]"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full mt-6 bg-[var(--neon-blue)] text-white font-bold py-2 rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Save Metrics
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
