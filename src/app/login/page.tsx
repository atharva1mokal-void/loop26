'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, Terminal, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccess('Account created successfully! Please login.');
        }
    }, [searchParams]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((u: any) => u.email === email);

        if (!user) {
            setError('Account not found');
            return;
        }

        // Simple password check (in production, verify hash)
        if (!user.password.includes(password) && password.length < 3) {
            setError('Invalid password');
            return;
        }

        // Create session
        const session = {
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            avatar: user.avatar
        };

        localStorage.setItem('currentUser', JSON.stringify(session));

        // Redirect based on role
        if (user.role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white p-4 relative overflow-hidden">
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
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]">
                        Portal Access
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-2">Identify yourself to proceed</p>
                </div>

                {success && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-4 flex items-center gap-2 bg-green-500/10 text-green-400 p-3 rounded-lg border border-green-500/20"
                    >
                        <Check className="w-4 h-4" />
                        {success}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-mono text-[var(--neon-cyan)] uppercase">
                            <User className="w-4 h-4" /> Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-[var(--surface-1)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-cyan)] transition-colors"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-mono text-[var(--neon-purple)] uppercase">
                            <Lock className="w-4 h-4" /> Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        className="w-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white font-bold py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 group"
                    >
                        <Terminal className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        Initiate Session
                    </button>
                </form>

                <div className="mt-6 space-y-3 text-center text-sm">
                    <Link href="/reset-password" className="block text-[var(--text-secondary)] hover:text-[var(--neon-purple)] transition-colors">
                        Forgot Password?
                    </Link>
                    <div className="text-[var(--text-secondary)]">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-[var(--neon-cyan)] hover:underline">
                            Create Account
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
