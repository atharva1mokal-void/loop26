'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createProject, removeProject } from '../actions';
import { Project } from '@/lib/types';
import { Trash2, Plus, Terminal, Lock, LogOut } from 'lucide-react';

interface AdminClientProps {
    initialProjects: Project[];
}

export default function AdminClient({ initialProjects }: AdminClientProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'RedVoid' && password === 'Lead@01') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Access Denied: Invalid Credentials');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white p-4">
                <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-[var(--neon-purple)] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse" />
                    <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-[var(--neon-blue)] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md p-8 glass-panel rounded-2xl border border-[var(--glass-border)] relative z-10"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--glass-border)]">
                            <Lock className="w-6 h-6 text-[var(--neon-purple)]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Admin Portal</h1>
                            <p className="text-[var(--text-secondary)] text-sm">Secure Access Required</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">Identity</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[var(--surface-1)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-purple)] focus:ring-1 focus:ring-[var(--neon-purple)] transition-all font-mono"
                                placeholder="Username"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider">Passcode</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[var(--surface-1)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-purple)] focus:ring-1 focus:ring-[var(--neon-purple)] transition-all font-mono"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-center justify-center font-mono"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group"
                        >
                            <Terminal className="w-4 h-4" />
                            <span>Establish Connection</span>
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <Dashboard projects={initialProjects} onLogout={() => setIsAuthenticated(false)} />
    );
}

function Dashboard({ projects, onLogout }: { projects: Project[], onLogout: () => void }) {
    // We rely on Props for initial data, but since we are modifying data, 
    // we should ideally optimistic update or just rely on router refresh (handled by server actions).
    // But props won't update automatically without a refresh unless we use router.refresh().
    // Server actions do revalidatePath, which refreshes the server component, which passes new props!
    // So this IS reactive.

    return (
        <div className="min-h-screen bg-[#050505] p-8">
            <header className="max-w-6xl mx-auto flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]">
                        Command Center
                    </h1>
                    <p className="text-[var(--text-secondary)]">Manage system resources and project directives.</p>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-1)] hover:bg-[var(--surface-2)] text-[var(--text-secondary)] rounded-lg transition-colors border border-[var(--glass-border)]"
                >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                </button>
            </header>

            <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Create Project Form */}
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 rounded-xl border border-[var(--glass-border)] sticky top-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Plus className="w-5 h-5 text-[var(--neon-cyan)]" />
                            <h2 className="text-xl font-bold">Initialize Project</h2>
                        </div>

                        <form action={createProject} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1 uppercase">Project Codenam</label>
                                <input name="name" required className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-cyan)]" placeholder="e.g. TITAN_PROTOCOL" />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1 uppercase">Objective</label>
                                <textarea name="description" required rows={3} className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-cyan)]" placeholder="Brief mission statement..." />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1 uppercase">Tech Matrix (comma sep)</label>
                                <input name="techStack" className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-cyan)]" placeholder="React, Node, AI..." />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1 uppercase">GitHub Repository</label>
                                <input name="githubUrl" defaultValue="https://github.com/atharva1mokal-void/loop26" className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-cyan)]" />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1 uppercase">Project Type</label>
                                <select name="projectType" className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-cyan)]">
                                    <option value="software">Software/Tech</option>
                                    <option value="civil">Civil Engineering</option>
                                    <option value="mechanical">Mechanical</option>
                                    <option value="electrical">Electrical</option>
                                    <option value="chemical">Chemical</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/50 font-bold py-3 rounded-lg hover:bg-[var(--neon-cyan)] hover:text-black transition-all flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />
                                Deploy Project
                            </button>
                        </form>
                    </div>
                </div>

                {/* Project List */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-[var(--text-secondary)]" />
                        Active Deployments
                    </h2>

                    <div className="space-y-4">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-panel p-5 rounded-xl border border-[var(--glass-border)] hover:border-[var(--neon-blue)] transition-colors group relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <h3 className="text-lg font-bold flex items-center gap-3">
                                            {project.name}
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider border ${project.status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                                'bg-gray-500/10 border-gray-500/20 text-gray-400'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </h3>
                                        <p className="text-[var(--text-secondary)] mt-1 mb-3 text-sm">{project.description || 'No description provided.'}</p>

                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack?.map((tech, i) => (
                                                <span key={i} className="text-xs bg-[var(--surface-2)] px-2 py-1 rounded text-[var(--text-muted)] font-mono">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => removeProject(project.id)}
                                            className="p-2 hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-400 rounded-lg transition-colors"
                                            title="Terminate Project"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Background Gradient for hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--neon-blue)]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </motion.div>
                        ))}

                        {projects.length === 0 && (
                            <div className="text-center p-12 glass-panel rounded-xl border border-[var(--glass-border)] border-dashed">
                                <p className="text-[var(--text-secondary)]">System Idle. No active projects detected.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

