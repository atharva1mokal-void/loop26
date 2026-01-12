'use client';

import { motion } from 'framer-motion';
import { Home, Activity, Layers, Settings, ChevronRight, Zap, Target } from 'lucide-react';
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
            initial={{ width: 260 }}
            animate={{ width: isOpen ? 260 : 100 }}
            className="h-screen bg-[#050510] border-r border-white/5 relative z-50 flex flex-col transition-all duration-500 shadow-2xl"
        >
            {/* Header / Logo */}
            <div className="p-8 pb-12 flex items-center justify-between">
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3"
                    >
                        <h1 className="text-2xl font-black tracking-tighter text-blue-500">
                            NEXUS
                        </h1>
                    </motion.div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 hover:text-white text-slate-600 transition-colors"
                >
                    <ChevronRight
                        className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 space-y-3">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center p-4 rounded-2xl transition-all duration-300 group cursor-pointer relative overflow-hidden ${isActive
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30'
                                        : 'text-slate-500 hover:text-white'
                                    }`}
                            >
                                <item.icon
                                    className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-white' : 'group-hover:text-blue-400'
                                        }`}
                                />
                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="ml-4 font-bold text-sm tracking-tight relative z-10"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}

                                {isActive && (
                                    <motion.div
                                        layoutId="sidebarActiveBackground"
                                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 -z-10"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="p-6 space-y-8">
                <Link href="/admin">
                    <div className="flex items-center gap-4 text-slate-500 hover:text-white cursor-pointer transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-black group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-all">
                            N
                        </div>
                        {isOpen && <span className="text-sm font-bold tracking-tight">Settings</span>}
                        {isOpen && <Settings size={14} className="ml-auto opacity-40" />}
                    </div>
                </Link>
            </div>
        </motion.aside>
    );
}
