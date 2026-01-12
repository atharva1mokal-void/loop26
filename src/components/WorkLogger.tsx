'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Package, FileText, Save, X } from 'lucide-react';
import { Project, Resource } from '@/lib/types';

interface WorkLoggerProps {
    project: Project;
    onClose: () => void;
}

export function WorkLogger({ project, onClose }: WorkLoggerProps) {
    const [hoursWorked, setHoursWorked] = useState(0);
    const [tasksCompleted, setTasksCompleted] = useState('');
    const [notes, setNotes] = useState('');
    const [materialsUsed, setMaterialsUsed] = useState<{ resourceId: string; quantity: number }[]>([]);

    const handleSubmit = async () => {
        const workLog = {
            id: Math.random().toString(36).substr(2, 9),
            userId: 'current-user',
            projectId: project.id,
            date: new Date().toISOString(),
            hoursWorked,
            tasksCompleted: tasksCompleted.split(',').map(t => t.trim()).filter(Boolean),
            materialsUsed: materialsUsed.length > 0 ? materialsUsed : undefined,
            notes: notes || undefined,
            progressPercentage: Math.min(100, (hoursWorked / 8) * 10) // Simple calculation
        };

        // In real app, call server action
        console.log('Work Log:', workLog);
        alert('Work logged successfully! AI will calculate progress.');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#0a0a0a] border border-[var(--glass-border)] w-full max-w-2xl rounded-xl p-6 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-bold text-xl flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[var(--neon-cyan)]" />
                            Log Work - {project.name}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                            {new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </p>
                    </div>
                    <button onClick={onClose}><X className="w-5 h-5 text-[var(--text-secondary)]" /></button>
                </div>

                <div className="space-y-6">
                    {/* Hours Worked */}
                    <div>
                        <label className="text-sm text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Hours Worked Today
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="24"
                            step="0.5"
                            value={hoursWorked}
                            onChange={(e) => setHoursWorked(parseFloat(e.target.value))}
                            className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-cyan)]"
                        />
                    </div>

                    {/* Tasks Completed */}
                    <div>
                        <label className="text-sm text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Tasks Completed (comma-separated)
                        </label>
                        <textarea
                            value={tasksCompleted}
                            onChange={(e) => setTasksCompleted(e.target.value)}
                            rows={3}
                            className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-cyan)]"
                            placeholder="Foundation work, Wiring installation, Code review"
                        />
                    </div>

                    {/* Materials Used (if project has resources) */}
                    {project.resources && project.resources.length > 0 && (
                        <div>
                            <label className="text-sm text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                                <Package className="w-4 h-4" /> Materials Used
                            </label>
                            <div className="space-y-2">
                                {project.resources.map(resource => (
                                    <div key={resource.id} className="flex items-center gap-3 bg-[var(--surface-2)] p-3 rounded-lg">
                                        <span className="flex-1 text-sm">{resource.name} ({resource.unit})</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            placeholder="0"
                                            className="w-24 bg-[var(--surface-1)] border border-[var(--glass-border)] rounded p-2 text-white text-sm"
                                            onChange={(e) => {
                                                const qty = parseFloat(e.target.value) || 0;
                                                setMaterialsUsed(prev => {
                                                    const existing = prev.find(m => m.resourceId === resource.id);
                                                    if (existing) {
                                                        return prev.map(m => m.resourceId === resource.id ? { ...m, quantity: qty } : m);
                                                    }
                                                    return [...prev, { resourceId: resource.id, quantity: qty }];
                                                });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="text-sm text-[var(--text-secondary)] mb-2 block">Additional Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-purple)]"
                            placeholder="Any observations, challenges, or updates..."
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white font-bold py-3 rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" /> Submit Work Log
                    </button>

                    <p className="text-xs text-[var(--text-secondary)] text-center">
                        AI will analyze your input and update project progress automatically
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
