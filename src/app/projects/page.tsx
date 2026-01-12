'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers, Plus, Search, GitBranch, Star, RefreshCw,
    ChevronRight, ExternalLink, Github, CheckCircle2, Circle
} from 'lucide-react';
import { Project } from '@/lib/types';
import { LiveBackground } from '@/components/LiveBackground';
import Link from 'next/link';
import { AddTaskForm } from '@/components/AddTaskForm';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    async function fetchProjects() {
        setLoading(true);
        try {
            const res = await fetch('/api/projects');
            if (res.ok) {
                const data = await res.json();
                setProjects(data.projects || []);
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.githubRepo?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-[#050510] text-slate-200 p-8 relative overflow-hidden selection:bg-purple-500/30">
            <LiveBackground />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.1)_0%,transparent_50%)]" />

            <div className="max-w-6xl mx-auto relative z-10">
                <header className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 mb-4"
                            >
                                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                                    <Layers size={24} className="text-white" />
                                </div>
                                <span className="text-[10px] font-black text-blue-400 tracking-[0.4em] uppercase">Operations Matrix</span>
                            </motion.div>
                            <h1 className="text-5xl font-black text-white tracking-tight mb-2">Active Protocols</h1>
                            <p className="text-slate-500 font-medium text-lg italic">Command and control for your engineering initiatives.</p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/projects/new" className="px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5 flex items-center gap-2">
                                <Plus size={16} strokeWidth={4} /> Initialize New
                            </Link>
                            <button
                                onClick={fetchProjects}
                                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-blue-500/50 transition-all"
                            >
                                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                            </button>
                        </div>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter active protocols..."
                            className="w-full bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-3xl pl-16 pr-8 py-6 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/30 transition-all"
                        />
                    </div>
                </header>

                <div className="space-y-8">
                    <AnimatePresence mode='wait'>
                        {loading ? (
                            <div className="py-40 flex flex-col items-center gap-4">
                                <RefreshCw size={32} className="animate-spin text-blue-500" />
                                <p className="text-xs font-black tracking-widest text-slate-500 uppercase">Accessing Core Databases...</p>
                            </div>
                        ) : filteredProjects.length === 0 ? (
                            <div className="py-40 text-center bg-white/2 border border-dashed border-white/5 rounded-[3rem]">
                                <p className="text-slate-500 font-black uppercase tracking-[0.2em]">No protocols matching your query.</p>
                            </div>
                        ) : (
                            filteredProjects.map((project, idx) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem] group hover:border-blue-500/30 transition-all"
                                >
                                    <div className="flex flex-col lg:flex-row gap-12">
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-8">
                                                <div>
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <h3 className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">
                                                            {project.name}
                                                        </h3>
                                                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black tracking-widest uppercase rounded-full border border-blue-500/20">
                                                            {project.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">
                                                        {project.description || 'System resource allocated for undisclosed mission parameters.'}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {project.githubUrl && (
                                                        <Link href={project.githubUrl} target="_blank" className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-blue-500/50 transition-all">
                                                            <Github size={20} />
                                                        </Link>
                                                    )}
                                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 group-hover:text-white transition-all">
                                                        <ExternalLink size={20} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                                                <div className="p-6 bg-white/2 rounded-[2rem] border border-white/5">
                                                    <Star className="text-yellow-500 mb-2" size={16} />
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Priority</p>
                                                    <p className="text-lg font-black text-white uppercase">Critical</p>
                                                </div>
                                                <div className="p-6 bg-white/2 rounded-[2rem] border border-white/5">
                                                    <GitBranch className="text-blue-500 mb-2" size={16} />
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Source</p>
                                                    <p className="text-lg font-black text-white uppercase truncate">GitHub</p>
                                                </div>
                                                <div className="p-6 bg-white/2 rounded-[2rem] border border-white/5">
                                                    <RefreshCw className="text-purple-500 mb-2" size={16} />
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Integrity</p>
                                                    <p className="text-lg font-black text-white uppercase">98%</p>
                                                </div>
                                                <div className="p-6 bg-white/2 rounded-[2rem] border border-white/5">
                                                    <Layers className="text-emerald-500 mb-2" size={16} />
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Deployment</p>
                                                    <p className="text-lg font-black text-white uppercase">Active</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    Task Directive Stream
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {project.tasks.map(task => (
                                                        <div key={task.id} className="flex items-center justify-between p-5 bg-white/2 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all">
                                                            <div className="flex items-center gap-4">
                                                                {task.status === 'completed' ? <CheckCircle2 size={16} className="text-blue-500" /> : <Circle size={16} className="text-slate-600" />}
                                                                <span className={`text-sm font-bold tracking-tight ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                                                    {task.title}
                                                                </span>
                                                            </div>
                                                            <span className="text-[10px] font-black text-slate-500 uppercase">{task.assignee}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:w-80">
                                            <div className="bg-slate-950/50 p-8 rounded-[2.5rem] border border-white/5 sticky top-8">
                                                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-6">Append Directive</h4>
                                                <div className="opacity-60 hover:opacity-100 transition-opacity">
                                                    <AddTaskForm projectId={project.id} />
                                                </div>

                                                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Core Metadata</p>
                                                    <div className="flex justify-between text-[10px] font-bold">
                                                        <span className="text-slate-500">INIT_TS</span>
                                                        <span className="text-slate-300">JAN_2026_01</span>
                                                    </div>
                                                    <div className="flex justify-between text-[10px] font-bold">
                                                        <span className="text-slate-500">PROTOCOL_V</span>
                                                        <span className="text-slate-300">7.2.4</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
