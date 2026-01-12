'use client';

import { motion } from 'framer-motion';
import { Home, Activity, Layers, Settings, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Activity, label: 'Insights', href: '/insights' },
    { icon: Layers, label: 'Projects', href: '/projects' },
];

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();

    return (
        <motion.aside
            initial={{ width: 250 }}
            animate={{ width: isOpen ? 250 : 80 }}
            className="h-screen bg-black/40 backdrop-blur-xl border-r border-[var(--glass-border)] relative z-50 flex flex-col"
        >
            <div className="p-6 flex items-center justify-between">
                {isOpen && (
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl font-bold bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-cyan)] bg-clip-text text-transparent"
                    >
                        NEXUS
                    </motion.h1>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-[var(--surface-2)] rounded-lg transition-colors"
                >
                    <ChevronRight
                        className={`w-5 h-5 text-[var(--neon-blue)] transition-transform ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-8">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={`flex items-center p-3 rounded-xl transition-all duration-300 group cursor-pointer relative overflow-hidden ${isActive ? 'text-white' : 'text-[var(--text-secondary)] hover:text-white'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-[var(--neon-blue)] opacity-10 rounded-xl"
                                    />
                                )}
                                <item.icon
                                    className={`w-6 h-6 relative z-10 ${isActive ? 'text-[var(--neon-blue)]' : ''
                                        }`}
                                />
                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="ml-4 font-medium relative z-10"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-[var(--neon-blue)] opacity-0 group-hover:opacity-5 transition-opacity" />
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4">
                <div className="flex items-center p-3 text-[var(--text-secondary)] hover:text-white cursor-pointer rounded-xl hover:bg-[var(--surface-2)] transition-colors">
                    <Settings className="w-6 h-6" />
                    {isOpen && <span className="ml-4">Settings</span>}
                </div>
            </div>
        </motion.aside>
    );
}
