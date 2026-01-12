'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'client' as 'admin' | 'client' | 'developer'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        // In real app, call server action
        // For demo, store in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        if (users.find((u: any) => u.email === formData.email)) {
            setError('Email already registered');
            setLoading(false);
            return;
        }

        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            ...formData,
            password: `hashed_${formData.password}`, // Simplified hashing
            avatar: '',
            createdAt: new Date().toISOString(),
            isActive: true
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        setTimeout(() => {
            router.push('/login?registered=true');
        }, 500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white p-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-purple)] rounded-full blur-[150px] opacity-20 animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-blue)] rounded-full blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 glass-panel rounded-2xl border border-[var(--glass-border)] relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]">
                        Create Account
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-2">Join Mission Control</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-mono text-[var(--neon-cyan)] mb-2">
                            <User className="w-4 h-4" /> Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                            className="w-full bg-[var(--surface-1)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-cyan)] transition-colors"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-mono text-[var(--neon-cyan)] mb-2">
                            <User className="w-4 h-4" /> Username
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            className="w-full bg-[var(--surface-1)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-cyan)] transition-colors"
                            placeholder="johndoe"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-mono text-[var(--neon-purple)] mb-2">
                            <Mail className="w-4 h-4" /> Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="w-full bg-[var(--surface-1)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-purple)] transition-colors"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-mono text-[var(--neon-blue)] mb-2">
                            <Briefcase className="w-4 h-4" /> Role
                        </label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                            className="w-full bg-[var(--surface-1)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-blue)] transition-colors"
                        >
                            <option value="client">Client</option>
                            <option value="developer">Developer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-mono text-[var(--neon-purple)] mb-2">
                            <Lock className="w-4 h-4" /> Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            minLength={6}
                            className="w-full bg-[var(--surface-1)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-purple)] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-mono text-[var(--neon-purple)] mb-2">
                            <Lock className="w-4 h-4" /> Confirm Password
                        </label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                            className="w-full bg-[var(--surface-1)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-purple)] transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white font-bold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? 'Creating Account...' : (
                            <>
                                <UserPlus className="w-5 h-5" />
                                Create Account
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[var(--neon-cyan)] hover:underline">
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
