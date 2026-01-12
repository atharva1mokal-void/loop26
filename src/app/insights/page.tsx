

// Converting to client component for staggering animations comfortably, 
// though we usually fetch data in server component. 
// For simplicity in this demo, I'll fetch data via a prop or just use a client-side fetch wrapper 
// but sticking to server component for data + client component for list is better.
// Actually, I'll make the page a server component and pass data to a client list component.

import { getInsights } from '@/lib/storage';
import { InsightList } from '../../components/InsightList';
import { Activity } from 'lucide-react';

export default async function InsightsPage() {
    const insights = await getInsights();

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-12 flex items-center gap-4">
                <div className="p-3 bg-[var(--surface-1)] rounded-xl border border-[var(--glass-border)]">
                    <Activity className="w-8 h-8 text-[var(--neon-cyan)]" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold">System Intelligence</h1>
                    <p className="text-[var(--text-secondary)]">Real-time heuristic analysis of project velocity.</p>
                </div>
            </header>

            <InsightList insights={insights} />
        </div>
    );
}
