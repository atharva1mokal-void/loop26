import fs from 'fs/promises';
import path from 'path';
import { DB, Project, Insight, User, AttendanceRecord } from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export async function readDB(): Promise<DB> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return { projects: [], insights: [] };
    }
}

export async function writeDB(data: DB): Promise<void> {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export async function getProjects(): Promise<Project[]> {
    const db = await readDB();
    return db.projects;
}

export async function getInsights(): Promise<Insight[]> {
    const db = await readDB();
    return db.insights;
}

export async function updateProject(updatedProject: Project): Promise<void> {
    const db = await readDB();
    const index = db.projects.findIndex(p => p.id === updatedProject.id);
    if (index !== -1) {
        db.projects[index] = updatedProject;
        await writeDB(db);
    }
}

export async function addInsight(insight: Insight): Promise<void> {
    const db = await readDB();
    db.insights.unshift(insight);
    // Keep only last 50 insights
    if (db.insights.length > 50) db.insights.pop();
    await writeDB(db);
}

export async function addProject(project: Project): Promise<void> {
    const db = await readDB();
    db.projects.push(project);
    await writeDB(db);
}

export async function deleteProject(projectId: string): Promise<void> {
    const db = await readDB();
    db.projects = db.projects.filter(p => p.id !== projectId);
    await writeDB(db);
}

export async function getUsers(): Promise<User[]> {
    // For prototype, return mocked users if not in DB
    return [
        {
            id: 'u1',
            username: 'client_alpha',
            email: 'client@alphacorp.com',
            password: 'mock_hashed_password_1', // Mock password, replace with actual hashed password
            role: 'client',
            fullName: 'Alpha Corp Rep',
            createdAt: new Date().toISOString(),
            isActive: true
        },
        {
            id: 'u2',
            username: 'dev_lead',
            email: 'lead@devteam.com',
            password: 'mock_hashed_password_2', // Mock password, replace with actual hashed password
            role: 'developer',
            fullName: 'Lead Dev',
            createdAt: new Date().toISOString(),
            isActive: true
        }
    ];
}

export async function saveAttendance(record: AttendanceRecord): Promise<void> {
    const db = await readDB();
    if (!db.attendance) db.attendance = [];
    db.attendance.push(record);
    await writeDB(db);
}

export async function getAttendance(userId: string): Promise<AttendanceRecord[]> {
    const db = await readDB();
    return db.attendance?.filter(a => a.userId === userId) || [];
}

// Auth functions
export async function createUser(user: User): Promise<void> {
    const db = await readDB();
    if (!db.users) db.users = [];
    db.users.push(user);
    await writeDB(db);
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const db = await readDB();
    return db.users?.find(u => u.email === email) || null;
}

export async function getUserById(id: string): Promise<User | null> {
    const db = await readDB();
    return db.users?.find(u => u.id === id) || null;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const db = await readDB();
    const index = db.users?.findIndex(u => u.id === userId);
    if (index !== undefined && index >= 0 && db.users) {
        db.users[index] = { ...db.users[index], ...updates };
        await writeDB(db);
    }
}

export async function getAllUsers(): Promise<User[]> {
    const db = await readDB();
    return db.users || [];
}
