'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Key, Check } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [step, setStep] = useState<'email' | 'success'>('email');
    const [email, setEmail] = useState('');

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, send reset email
        setStep('success');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 glass-panel rounded-2xl border border-[var(--glass-border)]"
            >
                {step === 'email' ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-[var(--neon-purple)]/20 border-2 border-[var(--neon-purple)] flex items-center justify-center mx-auto mb-4">
                                <Key className="w-8 h-8 text-[var(--neon-purple)]" />
                            </div>
                            <h1 className="text-2xl font-bold">Reset Password</h1>
                            <p className="text-[var(--text-secondary)] mt-2">Enter your email to receive reset instructions</p>
                        </div>

                        <form onSubmit={handleReset} className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-mono text-[var(--neon-cyan)] mb-2">
                                    <Mail className="w-4 h-4" /> Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-[var(--surface-1)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-cyan)]"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white font-bold py-4 rounded-lg hover:opacity-90"
                            >
                                Send Reset Link
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link href="/login" className="text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] text-sm">
                                ← Back to Login
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
                        <p className="text-[var(--text-secondary)] mb-6">
                            We've sent password reset instructions to<br />
                            <span className="text-[var(--neon-cyan)]">{email}</span>
                        </p>
                        <Link href="/login" className="inline-block px-6 py-3 bg-[var(--neon-cyan)] text-black font-bold rounded-lg hover:opacity-90">
                            Return to Login
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
