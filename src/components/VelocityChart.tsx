'use client';

import { motion } from 'framer-motion';

export function VelocityChart() {
    const data = [32, 58, 45, 82, 64, 75, 95]; // Mock velocity data

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 overflow-hidden relative group">
            <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-xs font-black text-slate-500 tracking-[0.3em] uppercase flex items-center gap-3">
                    <div className="w-1 h-4 bg-purple-500 rounded-full" />
                    Team Velocity
                </h3>
                <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 tracking-tighter">
                    +15.4% EFFICIENCY
                </span>
            </div>

            <div className="h-48 flex items-end justify-between gap-3 relative z-10">
                {data.map((value, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center gap-3 group/bar h-full">
                        <div className="h-full w-full flex flex-col justify-end">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${value}%` }}
                                transition={{
                                    delay: i * 0.05,
                                    duration: 1,
                                    ease: [0.16, 1, 0.3, 1]
                                }}
                                className="w-full bg-gradient-to-t from-purple-600/20 via-purple-500 to-white rounded-2xl relative transition-all duration-500 group-hover/bar:brightness-125"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 transform group-hover/bar:-translate-y-2 pointer-events-none">
                                    <span className="text-[10px] font-black text-white bg-slate-950 px-2 py-1 rounded-md border border-white/10 shadow-xl">
                                        {value}
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter group-hover/bar:text-slate-400 transition-colors">
                            V.{i + 1}
                        </span>
                    </div>
                ))}
            </div>

            {/* Grid Lines Overlay */}
            <div className="absolute inset-x-8 bottom-16 h-48 border-b border-white/5 pointer-events-none opacity-50">
                <div className="absolute w-full h-px bg-white/5 top-1/4" />
                <div className="absolute w-full h-px bg-white/5 top-2/4" />
                <div className="absolute w-full h-px bg-white/5 top-3/4" />
            </div>

            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/10 transition-all duration-700" />
        </div>
    );
}
