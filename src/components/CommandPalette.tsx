'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Layout, FileText, Settings, X } from 'lucide-react';

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const commands = [
        { title: 'Create new task', icon: <Zap className="w-4 h-4" />, shortcut: 'C' },
        { title: 'Go to Projects', icon: <Layout className="w-4 h-4" />, shortcut: 'P' },
        { title: 'Search Insights', icon: <Search className="w-4 h-4" />, shortcut: 'S' },
        { title: 'View Reports', icon: <FileText className="w-4 h-4" />, shortcut: 'R' },
        { title: 'Settings', icon: <Settings className="w-4 h-4" />, shortcut: ',' },
    ];

    const filtered = commands.filter(c =>
        c.title.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="w-full max-w-lg bg-[#0a0a0a] border border-[var(--glass-border)] rounded-xl shadow-2xl overflow-hidden relative z-10 ring-1 ring-white/10"
                    >
                        <div className="flex items-center px-4 border-b border-white/5">
                            <Search className="w-5 h-5 text-[var(--text-secondary)]" />
                            <input
                                className="w-full bg-transparent border-0 p-4 text-white placeholder-[var(--text-secondary)] focus:ring-0 outline-none"
                                placeholder="Type a command or search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                            <button onClick={() => setIsOpen(false)}>
                                <X className="w-5 h-5 text-[var(--text-secondary)] hover:text-white" />
                            </button>
                        </div>

                        <div className="py-2 p-2">
                            {filtered.length === 0 && (
                                <div className="p-4 text-center text-[var(--text-secondary)]">
                                    No commands found.
                                </div>
                            )}
                            {filtered.map((command, i) => (
                                <button
                                    key={i}
                                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 text-left text-sm group transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-[var(--text-secondary)] group-hover:text-[var(--neon-blue)] transition-colors">
                                            {command.icon}
                                        </div>
                                        <span className="text-white">{command.title}</span>
                                    </div>
                                    {command.shortcut && (
                                        <span className="text-xs text-[var(--text-muted)] border border-white/10 px-1.5 py-0.5 rounded">
                                            {command.shortcut}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="px-4 py-2 bg-white/5 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] text-[var(--text-secondary)]">Navigate with arrows</span>
                            <div className="flex gap-2">
                                <span className="w-2 h-2 rounded-full bg-[var(--neon-blue)]"></span>
                                <span className="text-[10px] text-[var(--text-secondary)]">System Online</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
