'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Edit, Trash2, Shield, Mail, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function UserManagementPage() {
    const [isMounted, setIsMounted] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        role: 'client' as 'admin' | 'client' | 'developer'
    });

    useEffect(() => {
        setIsMounted(true);
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUsers(storedUsers);
    }, []);

    const handleAddUser = () => {
        const user = {
            id: Math.random().toString(36).substr(2, 9),
            ...newUser,
            password: `hashed_${newUser.password}`,
            avatar: '',
            createdAt: new Date().toISOString(),
            isActive: true
        };

        const updatedUsers = [...users, user];
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        setShowAddModal(false);
        setNewUser({ fullName: '', username: '', email: '', password: '', role: 'client' });
    };

    const handleDeleteUser = (userId: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            const updatedUsers = users.filter(u => u.id !== userId);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
        }
    };

    // Prevent hydration mismatch by not rendering until mounted on client
    if (!isMounted) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="text-[var(--text-secondary)]">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Users className="w-8 h-8 text-[var(--neon-purple)]" />
                            User Management
                        </h1>
                        <p className="text-[var(--text-secondary)] mt-2">{users.length} users registered</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white font-bold rounded-lg hover:opacity-90 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" /> Add User
                        </button>
                        <Link
                            href="/admin"
                            className="px-4 py-2 border border-[var(--glass-border)] rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-2)] transition-colors"
                        >
                            ← Back to Admin
                        </Link>
                    </div>
                </header>

                <div className="glass-panel rounded-2xl border border-[var(--glass-border)] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[var(--surface-2)] border-b border-[var(--glass-border)]">
                                <th className="p-4 text-left text-sm font-bold text-[var(--text-secondary)]">User</th>
                                <th className="p-4 text-left text-sm font-bold text-[var(--text-secondary)]">Email</th>
                                <th className="p-4 text-left text-sm font-bold text-[var(--text-secondary)]">Role</th>
                                <th className="p-4 text-left text-sm font-bold text-[var(--text-secondary)]">Status</th>
                                <th className="p-4 text-left text-sm font-bold text-[var(--text-secondary)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-[var(--glass-border)] hover:bg-[var(--surface-2)]/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center text-sm font-bold">
                                                {user.fullName?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.fullName}</div>
                                                <div className="text-sm text-[var(--text-secondary)]">@{user.username}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                            user.role === 'developer' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-green-500/20 text-green-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-2 text-sm text-green-400">
                                            <CheckCircle className="w-4 h-4" /> Active
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <button className="p-2 hover:bg-[var(--surface-2)] rounded transition-colors">
                                                <Edit className="w-4 h-4 text-[var(--neon-cyan)]" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 hover:bg-[var(--surface-2)] rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add User Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#0a0a0a] border border-[var(--glass-border)] w-full max-w-md rounded-xl p-6 relative z-10"
                        >
                            <h3 className="font-bold text-xl mb-6">Add New User</h3>
                            <div className="space-y-4">
                                <input
                                    placeholder="Full Name"
                                    value={newUser.fullName}
                                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                                    className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none"
                                />
                                <input
                                    placeholder="Username"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none"
                                />
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                                    className="w-full bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none"
                                >
                                    <option value="client">Client</option>
                                    <option value="developer">Developer</option>
                                    <option value="admin">Admin</option>
                                </select>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={handleAddUser}
                                        className="flex-1 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white font-bold py-3 rounded-lg hover:opacity-90"
                                    >
                                        Create User
                                    </button>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="px-6 py-3 border border-[var(--glass-border)] rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
