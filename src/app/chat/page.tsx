'use client';

import ChatBox from '@/components/ChatBox';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Settings, Shield } from 'lucide-react';

export default function ChatPage() {
    return (
        <div className="min-h-screen bg-[#050510] flex">
            {/* Left Sidebar - Channels/Peers */}
            <div className="w-80 border-r border-white/5 flex flex-col hidden lg:flex">
                <div className="p-8">
                    <h1 className="text-2xl font-black tracking-tighter text-white mb-8">CHANNELS</h1>

                    <div className="space-y-2">
                        <ChannelItem icon={MessageSquare} label="General" active />
                        <ChannelItem icon={Shield} label="Security" />
                        <ChannelItem icon={Users} label="Team" />
                        <ChannelItem icon={Settings} label="Dev Ops" />
                    </div>

                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-12 mb-4">Direct Messages</h2>
                    <div className="space-y-4">
                        <UserItem name="RedVoid" status="online" />
                        <UserItem name="Nexus26" status="online" />
                        <UserItem name="Lead01" status="busy" />
                        <UserItem name="Team01" status="offline" />
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <main className="flex-1 p-8 flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1"
                    >
                        <ChatBox />
                    </motion.div>
                </main>
            </div>
        </div>
    );
}

function ChannelItem({ icon: Icon, label, active = false }: any) {
    return (
        <div className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-blue-600/10 text-blue-400' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
            }`}>
            <Icon size={18} />
            <span className="font-bold text-sm">{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />}
        </div>
    );
}

function UserItem({ name, status }: any) {
    return (
        <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-slate-400 group-hover:border-blue-500/30 transition-all">
                    {name[0]}
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#050510] ${status === 'online' ? 'bg-green-500' : status === 'busy' ? 'bg-red-500' : 'bg-slate-500'
                    }`} />
            </div>
            <div>
                <div className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{name}</div>
                <div className="text-[10px] text-slate-500 uppercase font-black tracking-tight">{status}</div>
            </div>
        </div>
    );
}
