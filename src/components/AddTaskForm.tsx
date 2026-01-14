'use client';

import { useState } from 'react';
import { addTask } from '@/app/actions';
import { motion } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AddTaskForm({ projectId }: { projectId: string }) {
    const [title, setTitle] = useState('');
    const [assignee, setAssignee] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title || !assignee) return;

        setLoading(true);
        try {
            await addTask(projectId, title, assignee);
            setTitle('');
            setAssignee('');
            router.refresh();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-4 items-end bg-[var(--surface-1)] p-4 rounded-xl border border-[var(--glass-border)]">
            <div className="flex-1">
                <label className="block text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Task Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Optimize Database"
                    className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--neon-blue)] transition-colors"
                />
            </div>
            <div className="w-48">
                <label className="block text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wider">Assignee</label>
                <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="Name"
                    className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[var(--neon-blue)] transition-colors"
                />
            </div>
            <button
                disabled={loading}
                type="submit"
                className="bg-[var(--neon-blue)] text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                Add
            </button>
        </form>
    );
}
