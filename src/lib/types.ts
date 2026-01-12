export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'blocked';
export type ProjectType = 'software' | 'civil' | 'mechanical' | 'electrical' | 'chemical' | 'other';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  progress: number;
  tasks: Task[];
  techStack: string[];
  githubUrl?: string;
  githubRepo?: string; // Format: "owner/repo"
  lastSyncedAt?: string; // ISO timestamp
  projectType?: ProjectType;
  resources?: Resource[];
  workLogs?: WorkLog[];
  estimatedCompletion?: string;
  stats?: {
    efficiency: number;
    codeQuality: number;
    testCoverage: number;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // Hashed
  role: 'admin' | 'client' | 'developer';
  fullName: string;
  avatar?: string; // Base64 or URL
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface PasswordReset {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  used: boolean;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  status: 'present' | 'absent' | 'excused';
  timestamp: string;
}

export interface Resource {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  category: 'raw_material' | 'equipment' | 'labor' | 'other';
}

export interface WorkLog {
  id: string;
  userId: string;
  projectId: string;
  date: string;
  hoursWorked: number;
  tasksCompleted: string[];
  materialsUsed?: { resourceId: string; quantityUsed: number }[];
  notes?: string;
  progressPercentage: number;
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignee: string;
}

export interface TeamMessage {
  id: string;
  projectId: string;
  author: string;
  content: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'frustrated';
  keywords?: string[];
}

export interface IntelligenceReport {
  id: string;
  projectId: string;
  generatedAt: string;
  executiveSummary: string;
  redFlags: Alert[];
  velocity: {
    tasksCompletedLast24h: number;
    currentVelocity: number;
    averageVelocity: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  };
  sentiment: {
    overall: 'healthy' | 'cautious' | 'critical';
    score: number; // 0-100
    indicators: string[];
  };
  recommendations: Recommendation[];
}

export interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium';
  category: 'bottleneck' | 'deadline_risk' | 'team_health' | 'scope_creep';
  title: string;
  description: string;
  affectedResources: string[];
  suggestedAction: string;
}

export interface Recommendation {
  priority: 1 | 2 | 3;
  action: string;
  rationale: string;
  assignTo?: string;
}

export interface ProjectAnalytics {
  projectId: string;
  healthScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  bottlenecks: {
    taskId: string;
    taskTitle: string;
    daysStuck: number;
    assignee: string;
  }[];
  teamWorkload: {
    userId: string;
    activeTasks: number;
    messageVolume: number;
    completionRate: number;
  }[];
}

export interface Insight {
  id: string;
  type: 'info' | 'alert' | 'success' | 'warning';
  message: string;
  timestamp: string;
}

export interface DB {
  projects: Project[];
  insights: Insight[];
  users?: User[];
  attendance?: AttendanceRecord[];
}
