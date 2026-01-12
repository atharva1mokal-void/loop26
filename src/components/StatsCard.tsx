'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    trend?: string;
    icon?: ReactNode;
    delay?: number;
}

export function StatsCard({ title, value, trend, icon, delay = 0 }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px -20px rgba(139, 92, 246, 0.3)' }}
            className="relative p-8 rounded-[2rem] bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 backdrop-blur-3xl overflow-hidden group"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
                    {icon}
                </div>
                {trend && (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest uppercase border border-emerald-500/20">
                        {trend}
                    </span>
                )}
            </div>

            <div>
                <p className="text-slate-500 text-xs font-black tracking-[0.2em] uppercase mb-1">
                    {title}
                </p>
                <h3 className="text-4xl font-bold text-white tracking-tighter">
                    {value}
                </h3>
            </div>

            {/* Background Decorative Element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />
        </motion.div>
    );
}
