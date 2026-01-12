'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, GitBranch, X, Edit3, Check } from 'lucide-react';
import { Project } from '@/lib/types';
import { updateProjectStatus, simulateGitSync } from '@/app/actions';

interface ProjectUpdaterProps {
    projects: Project[];
}

export function ProjectUpdater({ projects }: ProjectUpdaterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<string>(projects[0]?.id || '');

    const handleSync = async () => {
        if (!selectedProject) return;
        await simulateGitSync(selectedProject);
    };

    const handleStatusChange = async (status: 'active' | 'archived') => {
        if (!selectedProject) return;
        await updateProjectStatus(selectedProject, status);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-[var(--neon-blue)] text-white p-4 rounded-full shadow-[0_0_20px_rgba(47,116,255,0.5)] hover:scale-110 transition-transform z-40 group"
            >
                <Edit3 className="w-6 h-6" />
                <span className="absolute right-full mr-4 bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Manage Projects
                </span>
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
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0a0a0a] border border-[var(--glass-border)] w-full max-w-md rounded-xl p-6 relative z-10 shadow-2xl"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Edit3 className="w-5 h-5 text-[var(--neon-purple)]" />
                                Project Controls
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm text-[var(--text-secondary)] mb-2">Select Project</label>
                                    <select
                                        value={selectedProject}
                                        onChange={(e) => setSelectedProject(e.target.value)}
                                        className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-blue)]"
                                    >
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={handleSync}
                                        className="flex flex-col items-center justify-center gap-2 p-4 bg-[var(--surface-1)] border border-[var(--glass-border)] rounded-xl hover:bg-[var(--surface-2)] hover:border-[var(--neon-blue)] transition-all group"
                                    >
                                        <GitBranch className="w-8 h-8 text-[var(--neon-cyan)] group-hover:scale-110 transition-transform" />
                                        <span className="text-sm font-medium">Simulate Git Sync</span>
                                    </button>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => handleStatusChange('active')}
                                            className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm font-bold uppercase transition-colors"
                                        >
                                            Mark Active
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('archived')}
                                            className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-bold uppercase transition-colors"
                                        >
                                            Archive
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-[var(--surface-1)] rounded-lg border border-[var(--glass-border)]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <RefreshCw className="w-4 h-4 text-[var(--text-secondary)]" />
                                        <span className="text-xs text-[var(--text-secondary)]">Automated Actions</span>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        Syncing will automatically update task completion based on commit history simulation.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
