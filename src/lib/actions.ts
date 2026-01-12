'use server';

import { writeDB, readDB } from './storage';
import { Task, Insight } from './types';

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
        return newTask;
    }
    throw new Error('Project not found');
}
