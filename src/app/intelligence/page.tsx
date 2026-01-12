'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertTriangle, TrendingUp, TrendingDown, CheckCircle2, Clock, Users, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function IntelligencePage() {
    const [selectedProject, setSelectedProject] = useState('');
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGenerateReport = async () => {
        if (!selectedProject) return;

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const mockReport = {
                executiveSummary: 'Project showing healthy velocity with 8 tasks completed in last 24h. Progress at 78% with estimated completion in 5 days.',
                redFlags: [
                    {
                        severity: 'high',
                        category: 'bottleneck',
                        title: '3 Tasks Stuck in Progress',
                        description: 'Database migration and API integration showing no updates for 2+ days',
                        suggestedAction: 'Schedule technical sync to identify blockers'
                    },
                    {
                        severity: 'medium',
                        category: 'team_health',
                        title: 'Increased Frustration Indicators',
                        description: 'Recent messages show keywords: "stuck", "blocked"',
                        suggestedAction: 'Provide additional support to affected team members'
                    }
                ],
                velocity: {
                    tasksCompletedLast24h: 8,
                    currentVelocity: 7.8,
                    averageVelocity: 8.5,
                    trend: 'stable'
                },
                sentiment: {
                    overall: 'cautious',
                    score: 68,
                    indicators: ['stuck', 'blocked', 'slow']
                },
                recommendations: [
                    { priority: 1, action: 'Unblock database migration task', rationale: 'Critical path blocker affecting 3 downstream tasks' },
                    { priority: 2, action: 'Schedule daily standups focusing on blockers', rationale: 'Multiple tasks showing no progress' },
                    { priority: 3, action: 'Team morale check', rationale: 'Sentiment dropping to 68/100' }
                ]
            };
            setReport(mockReport);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#050505] p-8">
            <header className="max-w-7xl mx-auto mb-12">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                            <Brain className="w-8 h-8 text-[var(--neon-purple)]" />
                            AI Project Intelligence
                        </h1>
                        <p className="text-[var(--text-secondary)]">Real-time analysis & predictive insights</p>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="px-4 py-2 border border-[var(--glass-border)] rounded-lg text-[var(--text-secondary)] hover:text-white hover:bg-[var(--surface-2)] transition-colors"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-8">
                {/* Analysis Trigger */}
                <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)]">
                    <div className="flex items-center gap-4">
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="flex-1 bg-[var(--surface-2)] border border-[var(--glass-border)] rounded-lg p-3 text-white outline-none focus:border-[var(--neon-cyan)]"
                        >
                            <option value="">Select Project to Analyze...</option>
                            <option value="proj1">Mission Control Dashboard</option>
                            <option value="proj2">Infrastructure Upgrade</option>
                        </select>
                        <button
                            onClick={handleGenerateReport}
                            disabled={!selectedProject || loading}
                            className="px-6 py-3 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Brain className="w-5 h-5" />
                                    Generate Intelligence Report
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {report && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Executive Summary */}
                        <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)]">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-[var(--neon-cyan)]" />
                                Executive Summary
                            </h2>
                            <p className="text-lg leading-relaxed">{report.executiveSummary}</p>
                        </div>

                        {/* Red Flags */}
                        <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)]">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-400" />
                                Critical Alerts ({report.redFlags.length})
                            </h2>
                            <div className="space-y-4">
                                {report.redFlags.map((alert: any, i: number) => (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-lg border-l-4 ${alert.severity === 'critical' ? 'bg-red-500/10 border-red-500' :
                                                alert.severity === 'high' ? 'bg-orange-500/10 border-orange-500' :
                                                    'bg-yellow-500/10 border-yellow-500'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold">{alert.title}</h3>
                                            <span className="text-xs px-2 py-1 rounded bg-[var(--surface-2)]">
                                                {alert.severity.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] mb-3">{alert.description}</p>
                                        <div className="bg-[var(--surface-2)] p-3 rounded">
                                            <div className="text-xs text-[var(--neon-cyan)] mb-1">SUGGESTED ACTION</div>
                                            <div className="text-sm">{alert.suggestedAction}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Velocity & Sentiment */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Velocity */}
                            <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)]">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    {report.velocity.trend === 'increasing' ? (
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <TrendingDown className="w-5 h-5 text-orange-400" />
                                    )}
                                    Team Velocity
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--text-secondary)]">Last 24h</span>
                                        <span className="text-2xl font-bold">{report.velocity.tasksCompletedLast24h} tasks</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--text-secondary)]">Current Rate</span>
                                        <span className="text-xl font-bold text-[var(--neon-blue)]">{report.velocity.currentVelocity}/day</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--text-secondary)]">Trend</span>
                                        <span className="px-3 py-1 rounded bg-green-500/20 text-green-400 text-sm font-bold capitalize">
                                            {report.velocity.trend}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Sentiment */}
                            <div className="glass-panel p-6 rounded-2xl border border-[var(--glass-border)]">
                                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-[var(--neon-purple)]" />
                                    Team Sentiment
                                </h2>
                                <div className="space-y-4">
                                    <div className="text-center mb-4">
                                        <div className="text-5xl font-bold mb-2">{report.sentiment.score}/ 100</div>
                                        <div className={`text-lg font-bold capitalize ${report.sentiment.overall === 'healthy' ? 'text-green-400' :
                                                report.sentiment.overall === 'cautious' ? 'text-yellow-400' :
                                                    'text-red-400'
                                            }`}>
                                            {report.sentiment.overall}
                                        </div>
                                    </div>
                                    {report.sentiment.indicators.length > 0 && (
                                        <div>
                                            <div className="text-xs text-[var(--text-secondary)] mb-2">DETECTED KEYWORDS</div>
                                            <div className="flex flex-wrap gap-2">
                                                {report.sentiment.indicators.map((kw: string, j: number) => (
                                                    <span key={j} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                                                        {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="glass-panel p-8 rounded-2xl border border-[var(--glass-border)]">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-[var(--neon-cyan)]" />
                                Recommended Actions (Top 3)
                            </h2>
                            <div className="space-y-4">
                                {report.recommendations.map((rec: any, i: number) => (
                                    <div key={i} className="flex gap-4 p-4 bg-[var(--surface-2)] rounded-lg border border-[var(--glass-border)]">
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${rec.priority === 1 ? 'bg-red-500/20 text-red-400' :
                                                rec.priority === 2 ? 'bg-orange-500/20 text-orange-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {rec.priority}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold mb-1">{rec.action}</h3>
                                            <p className="text-sm text-[var(--text-secondary)]">{rec.rationale}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {!report && !loading && (
                    <div className="text-center py-20 text-[var(--text-secondary)]">
                        <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Select a project and generate an intelligence report to see AI-powered insights</p>
                    </div>
                )}
            </main>
        </div>
    );
}
