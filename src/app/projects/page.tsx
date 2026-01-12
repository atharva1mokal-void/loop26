import { getProjects } from '@/lib/storage';
import { AddTaskForm } from '@/components/AddTaskForm';
import { Layers } from 'lucide-react';

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="mb-12 flex items-center gap-4">
                <div className="p-3 bg-[var(--surface-1)] rounded-xl border border-[var(--glass-border)]">
                    <Layers className="w-8 h-8 text-[var(--neon-purple)]" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold">Active Protocols</h1>
                    <p className="text-[var(--text-secondary)]">Manage your engineering initiatives.</p>
                </div>
            </header>

            <div className="space-y-8">
                {projects.map((project) => (
                    <div key={project.id} className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--neon-purple)]" />

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{project.name}</h2>
                                <span className="px-3 py-1 rounded-full bg-[var(--surface-2)] text-xs uppercase tracking-wider font-bold text-[var(--text-secondary)]">
                                    {project.status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            {project.tasks.length === 0 ? (
                                <p className="text-[var(--text-secondary)] italic">No active tasks.</p>
                            ) : project.tasks.map((task) => (
                                <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-1)] hover:bg-[var(--surface-2)] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                        <span className={task.status === 'completed' ? 'line-through text-[var(--text-muted)]' : 'text-white'}>
                                            {task.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-[var(--text-secondary)] px-2 py-1 rounded bg-black/20">
                                            {task.assignee}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                            <AddTaskForm projectId={project.id} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
