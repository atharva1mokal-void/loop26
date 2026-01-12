'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Calendar, Shield, Lock, Camera, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [isMounted, setIsMounted] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        currentPassword: '',
        newPassword: ''
    });
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser) {
            router.push('/login');
        } else {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setFormData({
                fullName: userData.fullName,
                email: userData.email,
                username: userData.username,
                currentPassword: '',
                newPassword: ''
            });
        }
    }, [router]);

    const handleSave = () => {
        // Update user in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map((u: any) =>
            u.id === user.userId ? { ...u, ...formData, password: formData.newPassword ? `hashed_${formData.newPassword}` : u.password } : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        const updatedSession = { ...user, ...formData };
        localStorage.setItem('currentUser', JSON.stringify(updatedSession));
        setUser(updatedSession);
        setEditing(false);
    };

    // Prevent hydration mismatch by not rendering until mounted on client
    if (!isMounted || !user) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-[var(--text-secondary)]">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">User Profile</h1>
                            <p className="text-[var(--text-secondary)]">Manage your account settings</p>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="px-4 py-2 border border-[var(--glass-border)] rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-2)] transition-colors"
                        >
                            ← Back
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Avatar Section */}
                    <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)]">
                        <div className="text-center">
                            <div className="relative w-32 h-32 mx-auto mb-4">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center text-4xl font-bold">
                                    {user.fullName?.[0] || 'U'}
                                </div>
                                <button className="absolute bottom-0 right-0 w-10 h-10 bg-[var(--neon-cyan)] rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                                    <Camera className="w-5 h-5 text-black" />
                                </button>
                            </div>
                            <h2 className="font-bold text-xl">{user.fullName}</h2>
                            <p className="text-[var(--text-secondary)] text-sm">@{user.username}</p>
                            <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                user.role === 'developer' ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-green-500/20 text-green-400'
                                }`}>
                                <Shield className="w-3 h-3" />
                                {user.role.toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-[var(--glass-border)]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Account Information</h3>
                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-4 py-2 bg-[var(--neon-cyan)] text-black font-bold rounded-lg hover:opacity-90"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                                    <User className="w-4 h-4" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    disabled={!editing}
                                    className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-cyan)] disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                                    <Mail className="w-4 h-4" /> Email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={!editing}
                                    className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-purple)] disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                                    <Briefcase className="w-4 h-4" /> Role
                                </label>
                                <input
                                    type="text"
                                    value={user.role}
                                    disabled
                                    className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none opacity-50 capitalize"
                                />
                            </div>

                            {editing && (
                                <>
                                    <div className="pt-4 border-t border-[var(--glass-border)]">
                                        <h4 className="font-bold mb-4">Change Password</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                                                    <Lock className="w-4 h-4" /> Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={formData.currentPassword}
                                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                                    className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-cyan)]"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                            <div>
                                                <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                                                    <Lock className="w-4 h-4" /> New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={formData.newPassword}
                                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                    className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-purple)]"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={handleSave}
                                            className="flex-1 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white font-bold py-3 rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
                                        >
                                            <Save className="w-5 h-5" /> Save Changes
                                        </button>
                                        <button
                                            onClick={() => setEditing(false)}
                                            className="px-6 py-3 border border-[var(--glass-border)] rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-2)] transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
