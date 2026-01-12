'use client';

import { Insight } from '@/lib/types';
import { motion } from 'framer-motion';
import { Zap, AlertTriangle, CheckCircle } from 'lucide-react';

export function InsightList({ insights }: { insights: Insight[] }) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'alert': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
            default: return <Zap className="w-5 h-5 text-[var(--neon-cyan)]" />;
        }
    };

    return (
        <div className="space-y-4">
            {insights.map((insight, index) => (
                <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-panel p-6 rounded-2xl flex gap-4 border-l-4 border-l-[var(--neon-blue)] hover:bg-[var(--surface-2)] transition-colors group"
                >
                    <div className="mt-1 p-2 rounded-lg bg-[var(--surface-1)] group-hover:bg-black transition-colors">
                        {getIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-mono text-[var(--text-secondary)] mb-1 block">
                                {new Date(insight.timestamp).toLocaleString()}
                            </span>
                            <span className="text-[var(--neon-blue)] text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                AI GENERATED
                            </span>
                        </div>
                        <p className="text-lg text-white leading-relaxed">
                            {insight.message}
                        </p>
                    </div>
                </motion.div>
            ))}

            {insights.length === 0 && (
                <div className="text-center text-[var(--text-secondary)] py-12">
                    No intelligence gathered yet. Start adding tasks.
                </div>
            )}
        </div>
    );
}
