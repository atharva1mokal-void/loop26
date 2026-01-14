'use server';

import { getProjects, updateProject, addInsight, addProject, deleteProject, readDB, writeDB } from '@/lib/storage';
import { Project, Task, Insight } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getAllProjects() {
    return await getProjects();
}

export async function updateProjectStatus(projectId: string, status: 'active' | 'archived') {
    const projects = await getProjects();
    const project = projects.find(p => p.id === projectId);

    if (project) {
        const updated = { ...project, status };
        await updateProject(updated);

        await addInsight({
            id: Math.random().toString(36).substr(2, 9),
            type: 'info',
            message: `Project ${project.name} status updated to ${status.toUpperCase()}`,
            timestamp: new Date().toISOString()
        });

        revalidatePath('/');
    }
}

export async function simulateGitSync(projectId: string) {
    const projects = await getProjects();
    const project = projects.find(p => p.id === projectId);

    if (project) {
        // Randomly mark a task as completed or add a new dummy one
        const incompleteTasks = project.tasks.filter(t => t.status !== 'completed');

        let message = '';
        let updatedTasks = [...project.tasks];

        if (incompleteTasks.length > 0) {
            // Complete a random task
            const taskIndex = Math.floor(Math.random() * incompleteTasks.length);
            const taskToComplete = incompleteTasks[taskIndex];

            updatedTasks = project.tasks.map(t =>
                t.id === taskToComplete.id ? { ...t, status: 'completed' as const } : t
            );
            message = `Git Push: Fixed ${taskToComplete.title} (Commit ${Math.random().toString(16).substr(2, 7)})`;
        } else {
            // All done, maybe add a new chore?
            const newTask: Task = {
                id: Math.random().toString(36).substr(2, 9),
                title: `Optimizing performance module ${Math.floor(Math.random() * 100)}`,
                status: 'todo',
                assignee: 'system'
            };
            updatedTasks.push(newTask);
            message = `Git Pull: New feature branch merged for optimization`;
        }

        await updateProject({ ...project, tasks: updatedTasks });

        await addInsight({
            id: Math.random().toString(36).substr(2, 9),
            type: 'success',
            message: message,
            timestamp: new Date().toISOString()
        });

        revalidatePath('/');
    }
}

export async function createProject(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const techStack = (formData.get('techStack') as string).split(',').map(t => t.trim());
    const githubUrl = formData.get('githubUrl') as string;
    const projectType = (formData.get('projectType') as any) || 'software';

    if (!name || !description) return;

    const newProject: Project = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        description,
        status: 'active',
        progress: 0,
        tasks: [],
        techStack,
        githubUrl: githubUrl || 'https://github.com/atharva1mokal-void/loop26',
        projectType,
        stats: {
            efficiency: 85,
            codeQuality: 90,
            testCoverage: 0
        }
    };

    await addProject(newProject);

    await addInsight({
        id: Math.random().toString(36).substr(2, 9),
        type: 'success',
        message: `Project initialized: ${name}`,
        timestamp: new Date().toISOString()
    });

    revalidatePath('/');
    revalidatePath('/admin');
}

export async function removeProject(projectId: string) {
    await deleteProject(projectId);

    await addInsight({
        id: Math.random().toString(36).substr(2, 9),
        type: 'warning',
        message: `Project deleted: ${projectId}`,
        timestamp: new Date().toISOString()
    });

    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateProjectStats(projectId: string, newStats: { efficiency: number; codeQuality: number; testCoverage: number }) {
    const projects = await getProjects();
    const project = projects.find(p => p.id === projectId);

    if (project) {
        await updateProject({ ...project, stats: newStats });

        await addInsight({
            id: Math.random().toString(36).substr(2, 9),
            type: 'info',
            message: `Project "${project.name}" metrics updated: Efficiency ${newStats.efficiency}%, Quality ${newStats.codeQuality}%, Coverage ${newStats.testCoverage}%`,
            timestamp: new Date().toISOString()
        });

        revalidatePath('/');
        revalidatePath('/admin');
    }
}

export async function calculateProjectProgress(projectId: string, workLog: any) {
    const projects = await getProjects();
    const project = projects.find(p => p.id === projectId);

    if (project) {
        // AI-like calculation based on work logs
        const totalHours = workLog.hoursWorked;
        const tasksCount = workLog.tasksCompleted.length;

        // Calculate progress boost
        const progressBoost = Math.min(15, (totalHours / 8) * 10 + tasksCount * 2);
        const newProgress = Math.min(100, project.progress + progressBoost);

        // Estimate completion based on velocity
        const daysRemaining = ((100 - newProgress) / progressBoost) * 1;
        const estimatedCompletion = new Date();
        estimatedCompletion.setDate(estimatedCompletion.getDate() + Math.ceil(daysRemaining));

        // Update resources if materials were used
        let updatedResources = project.resources || [];
        if (workLog.materialsUsed && project.resources) {
            updatedResources = project.resources.map(resource => {
                const used = workLog.materialsUsed.find((m: any) => m.resourceId === resource.id);
                if (used) {
                    return {
                        ...resource,
                        quantity: resource.quantity - used.quantityUsed
                    };
                }
                return resource;
            });
        }

        await updateProject({
            ...project,
            progress: newProgress,
            resources: updatedResources,
            estimatedCompletion: estimatedCompletion.toISOString()
        });

        await addInsight({
            id: Math.random().toString(36).substr(2, 9),
            type: 'success',
            message: `AI Analysis: "${project.name}" progress updated to ${Math.round(newProgress)}%. Estimated completion: ${estimatedCompletion.toLocaleDateString('en-IN')}`,
            timestamp: new Date().toISOString()
        });

        revalidatePath('/');
        revalidatePath('/dashboard');
    }
}

export async function generateIntelligenceReport(projectId: string) {
    const { generateIntelligenceReport: generate } = await import('@/lib/ai-analyzer');
    const projects = await getProjects();
    const project = projects.find(p => p.id === projectId);

    if (project) {
        // In real app, fetch actual team messages from DB
        const mockMessages = [
            {
                id: '1',
                projectId,
                author: 'dev_lead',
                content: 'Completed API integration. Working smoothly now!',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                sentiment: 'positive' as const
            },
            {
                id: '2',
                projectId,
                author: 'client_alpha',
                content: 'Stuck on the database migration, need help',
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                sentiment: 'frustrated' as const
            }
        ];

        const report = generate(project, mockMessages);

        await addInsight({
            id: Math.random().toString(36).substr(2, 9),
            type: 'info',
            message: `AI Intelligence Report generated for "${project.name}". Health Score: ${Math.min(100, project.progress + 10)}/100`,
            timestamp: new Date().toISOString()
        });

        revalidatePath('/intelligence');
        return report;
    }

    return null;
}

export async function addTask(projectId: string, title: string, assignee: string) {
    const db = await readDB();
    const project = db.projects.find((p) => p.id === projectId);

    if (project) {
        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            status: 'todo',
            assignee
        };
        project.tasks.push(newTask);

        const newInsight: Insight = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'info',
            message: `New task "${title}" added. Workload increased for ${assignee}.`,
            timestamp: new Date().toISOString()
        };
        db.insights.unshift(newInsight);

        await writeDB(db);
        revalidatePath('/');
        return newTask;
    }
    throw new Error('Project not found');
}
