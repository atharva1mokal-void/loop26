'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, RefreshCw, Layers, Brain, Zap, Clock, ChevronRight, Shield } from 'lucide-react';
import { Insight } from '@/lib/types';
import { LiveBackground } from '@/components/LiveBackground';
import Link from 'next/link';

export default function InsightsPage() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchInsights() {
        setLoading(true);
        try {
            const res = await fetch('/api/insights');
            if (res.ok) {
                const data = await res.json();
                setInsights(data.insights || []);
            }
        } catch (error) {
            console.error('Failed to fetch insights:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInsights();
    }, []);

    return (
        <main className="min-h-screen bg-[#050510] text-slate-200 p-8 relative overflow-hidden selection:bg-purple-500/30">
            <LiveBackground />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,0,255,0.1)_0%,transparent_50%)]" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-16 flex items-end justify-between">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 mb-4"
                        >
                            <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-500/20">
                                <Activity size={24} className="text-white" />
                            </div>
                            <span className="text-[10px] font-black text-purple-400 tracking-[0.4em] uppercase">Intelligence Node</span>
                        </motion.div>
                        <h1 className="text-5xl font-black text-white tracking-tight mb-2">Systems Insights</h1>
                        <p className="text-slate-500 font-medium text-lg italic">Real-time heuristic analysis of the engineering ecosystem.</p>
                    </div>
                    <button
                        onClick={fetchInsights}
                        disabled={loading}
                        className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 text-slate-400 hover:text-white hover:border-purple-500/50 transition-all active:scale-95"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Insights List */}
                    <div className="lg:col-span-8 space-y-6">
                        <AnimatePresence mode='wait'>
                            {loading ? (
                                <div className="py-20 flex flex-col items-center gap-4 opacity-50">
                                    <div className="w-12 h-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                                    <p className="text-xs font-black tracking-widest text-slate-500 uppercase">Synchronizing Data Stream...</p>
                                </div>
                            ) : insights.length === 0 ? (
                                <div className="text-center py-20 text-slate-600 font-bold uppercase tracking-widest bg-white/2 rounded-[2.5rem] border border-dashed border-white/5">
                                    No heuristic reports detected.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {insights.map((insight, idx) => (
                                        <motion.div
                                            key={insight.id}
                                            initial={{ opacity: 0, y: 10, x: -10 }}
                                            animate={{ opacity: 1, y: 0, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] hover:border-purple-500/30 transition-all"
                                        >
                                            <div className="flex gap-8 items-start">
                                                <div className="pt-2">
                                                    <div className="w-1 h-12 bg-slate-800 rounded-full relative overflow-hidden">
                                                        <motion.div
                                                            className="absolute inset-0 bg-purple-500"
                                                            initial={{ height: 0 }}
                                                            animate={{ height: '100%' }}
                                                            transition={{ duration: 1, delay: idx * 0.1 }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mark: {idx + 1}</span>
                                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                {new Date(insight.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] font-black group-hover:text-purple-400 transition-colors text-slate-600 uppercase tracking-widest flex items-center gap-1 cursor-pointer">
                                                            Trace Source <ChevronRight size={12} />
                                                        </span>
                                                    </div>
                                                    <p className="text-lg text-slate-300 font-medium leading-relaxed group-hover:text-white transition-colors">
                                                        {insight.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Meta Info Side */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="bg-slate-900/30 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Brain size={80} />
                            </div>
                            <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.4em] mb-6">Neural Status</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Zap size={16} className="text-yellow-500" />
                                        <span className="text-sm font-bold text-slate-300">Sync Fidelity</span>
                                    </div>
                                    <span className="text-sm font-black text-white">99.8%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Shield size={16} className="text-blue-500" />
                                        <span className="text-sm font-bold text-slate-300">Integrity Check</span>
                                    </div>
                                    <span className="text-sm font-black text-white uppercase">Nominal</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Clock size={16} className="text-purple-500" />
                                        <span className="text-sm font-bold text-slate-300">Pulse Rate</span>
                                    </div>
                                    <span className="text-sm font-black text-white uppercase">Constant</span>
                                </div>
                            </div>
                        </section>

                        <section className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem]">
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] mb-4">Command Directive</h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                System analysis suggests a 15% increase in deployment velocity. Maintain observer status and confirm all protocol validations.
                            </p>
                            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                                <Link href="/" className="text-[10px] font-black text-purple-400 uppercase tracking-widest hover:text-white transition-colors">
                                    Return to Core
                                </Link>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
