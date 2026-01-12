'use client';

import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/StatsCard';
import { VelocityChart } from '@/components/VelocityChart';
import { NeuralCore } from '@/components/NeuralCore';
import { HolographicField } from '@/components/HolographicField';
import { LiveBackground } from '@/components/LiveBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, CheckCircle, Clock, Shield, Github, Plus, RefreshCw, Layers, ExternalLink, Globe } from 'lucide-react';
import Link from 'next/link';
import { Project, Insight } from '@/lib/types';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  async function loadData() {
    try {
      const [projectsRes, insightsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/insights'),
      ]);

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.projects || []);
      }

      if (insightsRes.ok) {
        const insightsData = await insightsRes.json();
        setInsights(insightsData.insights || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function handleSync(projectId: string) {
    setSyncingId(projectId);
    try {
      const response = await fetch('/api/projects/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });

      if (response.ok) {
        await loadData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to sync project');
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Failed to sync project');
    } finally {
      setSyncingId(null);
    }
  }

  const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
  const completedTasks = projects.reduce(
    (acc, p) => acc + (p.tasks?.filter((t) => t.status === 'completed').length || 0),
    0
  );
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#020205]">
        <div className="relative">
          <RefreshCw className="w-16 h-16 text-purple-600 animate-spin" />
          <div className="absolute inset-0 blur-2xl bg-purple-600/30 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050510] text-slate-200 selection:bg-purple-500/30 relative overflow-hidden">
      <LiveBackground />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(120,0,255,0.15)_0%,transparent_50%)]" />

      <div className="max-w-[1400px] mx-auto p-8 relative z-10">
        {/* Superior Navigation */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-16"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Layers className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white">NEXUS CORE</h1>
              <p className="text-[10px] text-purple-400 font-black tracking-[0.3em] uppercase opacity-60">Operations Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/projects/new" className="px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full hover:bg-purple-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5 flex items-center gap-2">
              <Plus size={14} strokeWidth={4} /> New Deployment
            </Link>
            <button onClick={() => loadData()} className="p-3 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:border-purple-500/50 transition-all">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </motion.header>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Active Repositories"
            value={projects.length}
            icon={<Globe size={24} />}
          />
          <StatsCard
            title="Sprint Tasks"
            value={totalTasks}
            trend="+8"
            icon={<Activity size={24} />}
          />
          <StatsCard
            title="System Stability"
            value={`${completionRate}%`}
            icon={<Shield size={24} />}
          />
          <StatsCard
            title="Processing Speed"
            value="4.8ms"
            trend="Ultra"
            icon={<Zap size={24} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Command Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Deployments Stream */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xs font-black text-slate-500 tracking-[0.3em] uppercase flex items-center gap-3">
                  <span className="w-8 h-px bg-slate-800" />
                  Live Deployments
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {projects.map((project, i) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 10, scale: 1.01 }}
                      className="group relative"
                    >
                      <Link
                        href={project.githubUrl || '#'}
                        target="_blank"
                        className="block bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 hover:border-purple-500/30 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-500/10"
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-3xl bg-slate-950 flex items-center justify-center border border-white/5 group-hover:bg-purple-500 transition-all duration-500">
                              <Github size={32} className="text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-purple-400 transition-colors">
                                {project.name}
                              </h3>
                              <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-black tracking-widest uppercase rounded-full border border-purple-500/20">
                                  {project.status}
                                </span>
                                <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase truncate max-w-[200px]">
                                  {project.githubRepo || project.githubUrl?.replace('https://github.com/', '')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {project.githubRepo && (
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSync(project.id); }}
                                disabled={syncingId === project.id}
                                className={`p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-purple-400 hover:border-purple-500/50 transition-all ${syncingId === project.id ? 'animate-spin border-purple-500 text-purple-400' : ''}`}
                              >
                                <RefreshCw size={18} />
                              </button>
                            )}
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 group-hover:text-white transition-all">
                              <ExternalLink size={18} />
                            </div>
                          </div>
                        </div>

                        {/* Visual Progress */}
                        <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase">
                            <span>Core Integrity</span>
                            <span>{Math.round((project.tasks?.filter(t => t.status === 'completed').length / (project.tasks?.length || 1)) * 100)}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(project.tasks?.filter(t => t.status === 'completed').length / (project.tasks?.length || 1)) * 100}%`
                              }}
                              className="h-full bg-gradient-to-r from-purple-600 to-blue-500 shadow-[0_0_20px_rgba(147,51,234,0.5)]"
                            />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </div>

          {/* Artificial Intel Column */}
          <div className="lg:col-span-4 space-y-8">
            <NeuralCore projects={projects} />

            <section className="bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8">
              <h2 className="text-xs font-black text-slate-500 tracking-[0.3em] uppercase mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                Global Insight Feed
              </h2>

              <div className="space-y-6">
                <AnimatePresence>
                  {insights.slice(0, 5).map((insight, i) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4 group"
                    >
                      <div className="flex-shrink-0 w-px h-12 bg-slate-800 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-700 group-hover:bg-purple-500 transition-colors" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">
                          {new Date(insight.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-slate-400 group-hover:text-white transition-colors leading-relaxed">
                          {insight.message}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <Link href="/insights" className="mt-8 block text-center py-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white hover:bg-white/5 transition-all">
                Full System Report
              </Link>
            </section>

            <VelocityChart />
          </div>
        </div>
      </div>

      <HolographicField />
    </main>
  );
}
