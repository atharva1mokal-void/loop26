'use client';

import { motion } from 'framer-motion';
import { Package, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';
import { Project, Resource } from '@/lib/types';

interface ResourceTrackerProps {
    project: Project;
}

export function ResourceTracker({ project }: ResourceTrackerProps) {
    if (!project.resources || project.resources.length === 0) {
        return null;
    }

    const totalBudget = project.resources.reduce((sum, r) => sum + r.totalCost, 0);
    const usedBudget = project.resources.reduce((sum, r) => {
        const initialQty = r.totalCost / r.costPerUnit;
        const used = initialQty - r.quantity;
        return sum + (used * r.costPerUnit);
    }, 0);

    return (
        <div className="glass-panel p-6 rounded-xl border border-[var(--glass-border)]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-[var(--neon-purple)]" />
                    Resource Tracking
                </h3>
                <div className="text-right">
                    <div className="text-xs text-[var(--text-secondary)]">Budget Used</div>
                    <div className="text-lg font-bold text-[var(--neon-cyan)]">
                        ₹{usedBudget.toLocaleString('en-IN')} / ₹{totalBudget.toLocaleString('en-IN')}
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {project.resources.map(resource => {
                    const initialQty = resource.totalCost / resource.costPerUnit;
                    const usedPercentage = ((initialQty - resource.quantity) / initialQty) * 100;
                    const isLow = resource.quantity < (initialQty * 0.2);

                    return (
                        <motion.div
                            key={resource.id}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 rounded-lg border ${isLow ? 'bg-red-500/5 border-red-500/30' : 'bg-[var(--surface-2)] border-[var(--glass-border)]'}`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-sm">{resource.name}</h4>
                                        {isLow && <AlertTriangle className="w-4 h-4 text-red-400" />}
                                    </div>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                                        {resource.category.replace('_', ' ').toUpperCase()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold">{resource.quantity} {resource.unit}</div>
                                    <div className="text-xs text-[var(--text-secondary)]">
                                        ₹{resource.costPerUnit}/unit
                                    </div>
                                </div>
                            </div>

                            {/* Usage Bar */}
                            <div className="w-full bg-[var(--surface-1)] h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${isLow ? 'bg-red-500' : 'bg-[var(--neon-purple)]'}`}
                                    style={{ width: `${usedPercentage}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                                <span>{Math.round(usedPercentage)}% used</span>
                                <span>₹{((initialQty - resource.quantity) * resource.costPerUnit).toLocaleString('en-IN')}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-[var(--glass-border)] grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-[var(--surface-2)] rounded-lg">
                    <DollarSign className="w-4 h-4 text-[var(--neon-cyan)] mx-auto mb-1" />
                    <div className="text-xs text-[var(--text-secondary)]">Remaining</div>
                    <div className="text-lg font-bold">₹{(totalBudget - usedBudget).toLocaleString('en-IN')}</div>
                </div>
                <div className="text-center p-3 bg-[var(--surface-2)] rounded-lg">
                    <TrendingDown className="w-4 h-4 text-[var(--neon-purple)] mx-auto mb-1" />
                    <div className="text-xs text-[var(--text-secondary)]">Burn Rate</div>
                    <div className="text-lg font-bold">{Math.round((usedBudget / totalBudget) * 100)}%</div>
                </div>
            </div>
        </div>
    );
}
