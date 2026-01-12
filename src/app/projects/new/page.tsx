'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, GitBranch, Star, RefreshCw, ArrowLeft, Plus, X } from 'lucide-react';

interface GitHubRepo {
    id: number;
    fullName: string;
    name: string;
    description: string;
    url: string;
    language: string;
    stars: number;
    updatedAt: string;
}

export default function NewProjectPage() {
    const router = useRouter();
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [creating, setCreating] = useState(false);
    const [manualRepo, setManualRepo] = useState('');

    useEffect(() => {
        fetchRepos();
    }, []);

    async function fetchRepos() {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/github/repos');

            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }

            const data = await response.json();
            setRepos(data.repos || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateProject(repoFullName: string) {
        setCreating(true);

        try {
            const response = await fetch('/api/projects/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoFullName }),
            });

            if (!response.ok) {
                throw new Error('Failed to create project');
            }

            const data = await response.json();

            if (data.success) {
                router.push('/');
            } else {
                setError(data.error || 'Failed to create project');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setCreating(false);
        }
    }

    async function handleManualCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!manualRepo) return;

        // Extract owner/repo from URL or string
        let repoPath = manualRepo.replace('https://github.com/', '').replace('.git', '');
        if (repoPath.endsWith('/')) repoPath = repoPath.slice(0, -1);

        handleCreateProject(repoPath);
    }

    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050510] text-slate-200 p-8 font-sans selection:bg-purple-500/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(76,29,149,0.15)_0%,rgba(5,5,16,0)_50%)] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto relative z-10"
            >
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => router.push('/')}
                        className="group flex items-center gap-2 text-slate-500 hover:text-purple-400 transition-all mb-6 text-sm font-medium tracking-widest uppercase"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Mission Control
                    </button>
                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-5xl font-extrabold text-white tracking-tight mb-3">
                                Connect <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Repository</span>
                            </h1>
                            <p className="text-slate-400 text-lg">
                                Link your GitHub work to the intelligent dash.
                            </p>
                        </div>
                        <button
                            onClick={fetchRepos}
                            disabled={loading}
                            className="p-3 rounded-full bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-white hover:border-purple-500/50 transition-all disabled:opacity-50"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>
                </div>

                {/* Manual Addition Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 mb-8 shadow-2xl"
                >
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <Plus size={20} className="text-purple-500" />
                        Quick Add
                    </h2>
                    <form onSubmit={handleManualCreate} className="flex gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={manualRepo}
                                onChange={(e) => setManualRepo(e.target.value)}
                                placeholder="owner/repo or github.com/owner/repo"
                                className="w-full pl-6 pr-4 py-4 bg-slate-950/50 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all font-mono text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={creating || !manualRepo}
                            className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-purple-500 hover:text-white transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-white/5 whitespace-nowrap"
                        >
                            {creating ? 'CONNECTING...' : 'CONNECT'}
                        </button>
                    </form>
                    <p className="mt-4 text-xs text-slate-500 font-medium tracking-wide flex items-center gap-2">
                        <span className="w-1 h-1 bg-purple-500 rounded-full" />
                        TIP: YOU CAN PASTE THE FULL GITHUB URL
                    </p>
                </motion.div>

                {/* GitHub Browser */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-black text-slate-500 tracking-[0.2em] uppercase">
                            Browse Repositories
                        </h2>
                        <div className="h-px flex-1 mx-6 bg-slate-800/50" />
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-500 transition-colors" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter your repos..."
                            className="w-full pl-14 pr-6 py-5 bg-slate-900/30 border border-white/5 rounded-3xl text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/30 transition-all"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl text-red-400 text-sm font-medium flex items-center gap-4"
                        >
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                <X size={20} />
                            </div>
                            <div>
                                <p className="font-bold">Sync Error</p>
                                <p className="text-red-400/70">Check GITHUB_TOKEN or use manual entry above.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Repositories List */}
                    <div className="grid gap-4">
                        <AnimatePresence mode='wait'>
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="py-20 flex flex-col items-center gap-4 opacity-50"
                                >
                                    <RefreshCw size={32} className="animate-spin text-purple-500" />
                                    <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">ACCESSING GITHUB CORE...</p>
                                </motion.div>
                            ) : filteredRepos.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20 text-slate-600 italic bg-white/2 rounded-3xl border border-dashed border-white/5"
                                >
                                    No remote repositories found. Use the manual connector.
                                </motion.div>
                            ) : (
                                <div className="grid gap-4">
                                    {filteredRepos.map((repo, idx) => (
                                        <motion.div
                                            key={repo.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                            className="group flex items-center justify-between p-6 bg-slate-900/20 border border-white/5 rounded-3xl cursor-pointer transition-all"
                                            onClick={() => !creating && handleCreateProject(repo.fullName)}
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-800/50 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-all overflow-hidden relative">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                                                    <GitBranch size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-1">{repo.name}</h3>
                                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                                                            {repo.language || 'PLAIN'}
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <Star size={12} className="text-yellow-500/50" />
                                                            {repo.stars}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-6 py-2 bg-white text-black text-xs font-black rounded-full uppercase tracking-tighter">
                                                Link Repo
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
