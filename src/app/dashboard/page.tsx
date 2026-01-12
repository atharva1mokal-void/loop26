'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, User, LogOut, Briefcase, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Indian timezone helper
const getISTDate = (date?: Date) => {
    const d = date || new Date();
    return new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
};

const formatISTDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Asia/Kolkata'
    });
};

export default function DashboardPage() {
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [attendance, setAttendance] = useState<string[]>([]);
    const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        setCurrentMonth(getISTDate());

        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser) {
            router.push('/login');
        } else {
            setUser(JSON.parse(storedUser));
            const storedAttendance = localStorage.getItem('attendance') || '[]';
            setAttendance(JSON.parse(storedAttendance));
        }
    }, [router]);

    const handleMarkAttendance = () => {
        const today = getISTDate().toISOString().split('T')[0];
        if (!attendance.includes(today)) {
            const newAttendance = [...attendance, today];
            setAttendance(newAttendance);
            localStorage.setItem('attendance', JSON.stringify(newAttendance));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        router.push('/login');
    };

    // Generate calendar days for current month
    const getDaysInMonth = () => {
        if (!currentMonth) return [];
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        // Add actual days
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        return days;
    };

    if (!user || !mounted || !currentMonth) return null;

    const days = getDaysInMonth();
    const today = getISTDate().toISOString().split('T')[0];
    const monthName = currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });

    return (
        <div className="min-h-screen bg-[#050505] p-8">
            <header className="max-w-7xl mx-auto flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white capitalize">{user.username}</h1>
                        <p className="text-[var(--text-secondary)] text-sm">Client Dashboard • IST {getISTDate().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 border border-[var(--glass-border)] rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-2)] transition-colors"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar - Full Month View */}
                <div className="lg:col-span-2 glass-panel p-8 rounded-2xl border border-[var(--glass-border)]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-[var(--neon-cyan)]" />
                                {monthName}
                            </h2>
                            <p className="text-[var(--text-secondary)] text-sm mt-1">Indian Standard Time (IST)</p>
                        </div>
                        <button
                            onClick={handleMarkAttendance}
                            disabled={attendance.includes(today)}
                            className={`
                                px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all
                                ${attendance.includes(today)
                                    ? 'bg-green-500/20 text-green-400 cursor-default'
                                    : 'bg-[var(--neon-cyan)] text-black hover:opacity-90'
                                }
                            `}
                        >
                            {attendance.includes(today) ? (
                                <>
                                    <CheckCircle className="w-5 h-5" /> Marked Present
                                </>
                            ) : (
                                <>
                                    <Clock className="w-5 h-5" /> Check-In Now
                                </>
                            )}
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-xs font-bold text-[var(--text-secondary)] py-2">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((date, i) => {
                            if (!date) return <div key={`empty-${i}`} className="aspect-square" />;

                            const dateStr = date.toISOString().split('T')[0];
                            const isPresent = attendance.includes(dateStr);
                            const isToday = dateStr === today;

                            return (
                                <motion.div
                                    key={dateStr}
                                    whileHover={{ scale: 1.05 }}
                                    className={`
                                        aspect-square rounded-xl flex flex-col items-center justify-center border cursor-pointer
                                        ${isPresent
                                            ? 'bg-green-500/20 border-green-500/50'
                                            : isToday
                                                ? 'bg-[var(--neon-blue)]/10 border-[var(--neon-blue)]'
                                                : 'bg-[var(--surface-1)] border-[var(--glass-border)] hover:bg-[var(--surface-2)]'
                                        }
                                    `}
                                >
                                    <span className={`font-bold text-lg ${isPresent ? 'text-green-400' : isToday ? 'text-[var(--neon-blue)]' : 'text-white'}`}>
                                        {date.getDate()}
                                    </span>
                                    {isPresent && <div className="w-2 h-2 rounded-full bg-green-500 mt-1" />}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)]">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[var(--neon-purple)]" />
                            Personal Stats
                        </h2>

                        <div className="space-y-4">
                            <div className="p-4 bg-[var(--surface-2)] rounded-xl">
                                <div className="text-[var(--text-secondary)] text-sm mb-1">This Month</div>
                                <div className="text-2xl font-bold text-white">{attendance.filter(d => d.startsWith(currentMonth.toISOString().slice(0, 7))).length} days</div>
                            </div>
                            <div className="p-4 bg-[var(--surface-2)] rounded-xl">
                                <div className="text-[var(--text-secondary)] text-sm mb-1">Attendance Rate</div>
                                <div className="text-2xl font-bold text-green-400">
                                    {Math.round((attendance.length / 30) * 100)}%
                                </div>
                            </div>
                            <div className="p-4 bg-[var(--surface-2)] rounded-xl">
                                <div className="text-[var(--text-secondary)] text-sm mb-1">Total Days</div>
                                <div className="text-2xl font-bold text-[var(--neon-purple)]">{attendance.length}</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)]">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-[var(--neon-cyan)]" />
                            Quick Actions
                        </h3>
                        <button className="w-full bg-[var(--surface-2)] hover:bg-[var(--surface-1)] p-3 rounded-lg text-sm text-left transition-colors border border-[var(--glass-border)]">
                            Log Work Hours
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
