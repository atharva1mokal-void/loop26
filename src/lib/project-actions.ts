'use server';

import { fetchRepoIssues, fetchRepoPRs, fetchRepoStats } from './github';
import { addProject, updateProject, getProjects, addInsight } from './storage';
import { Project, Task, Insight } from './types';

/**
 * Create a new project from a GitHub repository
 */
export async function createProjectFromGitHub(repoFullName: string): Promise<{ success: boolean; projectId?: string; error?: string }> {
    try {
        const [owner, repo] = repoFullName.split('/');

        if (!owner || !repo) {
            return { success: false, error: 'Invalid repository format. Expected: owner/repo' };
        }

        // Fetch repository data
        const [issues, prs, stats] = await Promise.all([
            fetchRepoIssues(owner, repo),
            fetchRepoPRs(owner, repo),
            fetchRepoStats(owner, repo),
        ]);

        // Convert issues to tasks
        const tasks: Task[] = issues.slice(0, 20).map(issue => ({
            id: `issue-${issue.id}`,
            title: issue.title,
            status: issue.state === 'open' ? 'todo' : 'completed',
            assignee: issue.assignee || 'Unassigned',
        }));

        // Create project
        const projectId = `proj-${Date.now()}`;
        const newProject: Project = {
            id: projectId,
            name: repo,
            description: `GitHub repository: ${repoFullName}`,
            status: 'active',
            progress: 0,
            tasks,
            techStack: stats.language ? [stats.language] : [],
            githubUrl: `https://github.com/${repoFullName}`,
            githubRepo: repoFullName,
            lastSyncedAt: new Date().toISOString(),
        };

        await addProject(newProject);

        // Add insight
        await addInsight({
            id: `insight-${Date.now()}`,
            type: 'success',
            message: `Project "${repo}" connected from GitHub with ${tasks.length} tasks`,
            timestamp: new Date().toISOString(),
        });

        return { success: true, projectId };
    } catch (error) {
        console.error('Failed to create project from GitHub:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Sync a project with its GitHub repository
 */
export async function syncProjectWithGitHub(projectId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const projects = await getProjects();
        const project = projects.find(p => p.id === projectId);

        if (!project || !project.githubRepo) {
            return { success: false, error: 'Project not found or not linked to GitHub' };
        }

        const [owner, repo] = project.githubRepo.split('/');

        if (!owner || !repo) {
            return { success: false, error: 'Invalid repository format' };
        }

        // Fetch latest data from GitHub
        const [issues, prs, stats] = await Promise.all([
            fetchRepoIssues(owner, repo),
            fetchRepoPRs(owner, repo),
            fetchRepoStats(owner, repo),
        ]);

        // Update tasks
        const updatedTasks: Task[] = issues.slice(0, 20).map(issue => ({
            id: `issue-${issue.id}`,
            title: issue.title,
            status: issue.state === 'open' ? 'todo' : 'completed',
            assignee: issue.assignee || 'Unassigned',
        }));

        // Update project
        const updatedProject: Project = {
            ...project,
            tasks: updatedTasks,
            techStack: stats.language ? [stats.language] : project.techStack,
            lastSyncedAt: new Date().toISOString(),
        };

        await updateProject(updatedProject);

        // Add insight
        await addInsight({
            id: `insight-${Date.now()}`,
            type: 'info',
            message: `Project "${project.name}" synced with GitHub. ${updatedTasks.length} tasks updated`,
            timestamp: new Date().toISOString(),
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to sync project with GitHub:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}
