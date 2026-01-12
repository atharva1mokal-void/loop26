import { Project, Task, TeamMessage, IntelligenceReport, Alert, Recommendation, ProjectAnalytics } from './types';

/**
 * AI-Powered Project Intelligence Engine
 * Analyzes project data to generate actionable insights
 */

// Sentiment keywords for analysis
const NEGATIVE_KEYWORDS = ['blocked', 'stuck', 'frustrated', 'slow', 'issue', 'problem', 'bug', 'broken', 'failed'];
const POSITIVE_KEYWORDS = ['done', 'shipped', 'completed', 'success', 'fixed', 'resolved', 'working', 'ready'];

export function analyzeProjectStatus(project: Project, messages: TeamMessage[] = []): string {
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentTasks = project.tasks.filter(t => new Date(t.id) > last24h); // Simplified

    const completed = recentTasks.filter(t => t.status === 'completed').length;
    const inProgress = project.tasks.filter(t => t.status === 'in-progress').length;

    return `Project "${project.name}" - ${completed} tasks completed in last 24h. ${inProgress} tasks currently active. Progress: ${Math.round(project.progress)}%`;
}

export function detectBottlenecks(project: Project): Alert[] {
    const alerts: Alert[] = [];
    const now = Date.now();
    const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

    // Find tasks stuck in progress
    const stuckTasks = project.tasks.filter(t => {
        if (t.status !== 'in-progress') return false;
        // In real app, track task update timestamps
        return true; // Simplified for demo
    });

    if (stuckTasks.length > 0) {
        alerts.push({
            id: Math.random().toString(36).substr(2, 9),
            severity: 'high',
            category: 'bottleneck',
            title: `${stuckTasks.length} Tasks Showing No Recent Progress`,
            description: `Tasks assigned to ${[...new Set(stuckTasks.map(t => t.assignee))].join(', ')} have been in-progress without updates.`,
            affectedResources: stuckTasks.map(t => t.assignee),
            suggestedAction: 'Schedule 1-on-1s to identify blockers and redistribute work if needed.'
        });
    }

    // Check for deadline risk
    if (project.estimatedCompletion) {
        const deadline = new Date(project.estimatedCompletion);
        const daysRemaining = (deadline.getTime() - now) / (24 * 60 * 60 * 1000);
        const progressRate = project.progress / 100;

        if (daysRemaining < 7 && progressRate < 0.8) {
            alerts.push({
                id: Math.random().toString(36).substr(2, 9),
                severity: 'critical',
                category: 'deadline_risk',
                title: 'High Risk of Deadline Miss',
                description: `Only ${Math.round(daysRemaining)} days remaining with ${Math.round((1 - progressRate) * 100)}% work incomplete.`,
                affectedResources: [project.name],
                suggestedAction: 'Consider scope reduction or deadline extension. Prioritize critical path items.'
            });
        }
    }

    return alerts;
}

export function analyzeSentiment(messages: TeamMessage[]): {
    overall: 'healthy' | 'cautious' | 'critical';
    score: number;
    indicators: string[];
} {
    if (messages.length === 0) {
        return { overall: 'healthy', score: 75, indicators: ['No recent communication'] };
    }

    let positiveCount = 0;
    let negativeCount = 0;
    const indicators: string[] = [];

    messages.forEach(msg => {
        const content = msg.content.toLowerCase();
        POSITIVE_KEYWORDS.forEach(kw => {
            if (content.includes(kw)) positiveCount++;
        });
        NEGATIVE_KEYWORDS.forEach(kw => {
            if (content.includes(kw)) {
                negativeCount++;
                if (!indicators.includes(kw)) indicators.push(kw);
            }
        });
    });

    const score = Math.max(0, Math.min(100, 75 + (positiveCount * 5) - (negativeCount * 10)));
    const overall = score > 70 ? 'healthy' : score > 40 ? 'cautious' : 'critical';

    return { overall, score, indicators };
}

export function predictRisks(project: Project, analytics: ProjectAnalytics): string[] {
    const risks: string[] = [];

    // Risk: Low velocity
    if (analytics.healthScore < 50) {
        risks.push(`Project health critically low (${analytics.healthScore}/100). Expect delays.`);
    }

    // Risk: Bottlenecks
    if (analytics.bottlenecks.length > 2) {
        risks.push(`${analytics.bottlenecks.length} tasks bottlenecked. Potential 3-5 day delay.`);
    }

    // Risk: Overloaded team
    const overloaded = analytics.teamWorkload.filter(w => w.activeTasks > 5);
    if (overloaded.length > 0) {
        risks.push(`Team members overloaded (${overloaded.map(w => w.userId).join(', ')}). Burnout risk.`);
    }

    return risks;
}

export function generateRecommendations(
    project: Project,
    alerts: Alert[],
    sentiment: any
): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Top priority: Critical alerts
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
        recommendations.push({
            priority: 1,
            action: criticalAlerts[0].suggestedAction,
            rationale: criticalAlerts[0].description
        });
    }

    // High priority: Bottlenecks
    const bottleneckAlerts = alerts.filter(a => a.category === 'bottleneck');
    if (bottleneckAlerts.length > 0) {
        recommendations.push({
            priority: 2,
            action: 'Conduct daily standups focusing on blockers',
            rationale: 'Multiple tasks showing no progress. Team needs unblocking.'
        });
    }

    // Medium priority: Team health
    if (sentiment.overall === 'critical' || sentiment.overall === 'cautious') {
        recommendations.push({
            priority: 3,
            action: 'Schedule team retrospective and morale check',
            rationale: `Team sentiment is ${sentiment.overall}. Indicators: ${sentiment.indicators.join(', ')}`
        });
    }

    return recommendations.slice(0, 3); // Top 3
}

export function generateIntelligenceReport(
    project: Project,
    messages: TeamMessage[] = []
): IntelligenceReport {
    const now = new Date();

    // Calculate analytics
    const completedLast24h = project.tasks.filter(t => t.status === 'completed').length; // Simplified
    const analytics: ProjectAnalytics = {
        projectId: project.id,
        healthScore: Math.min(100, project.progress + 10),
        riskLevel: project.progress > 70 ? 'low' : project.progress > 40 ? 'medium' : 'high',
        bottlenecks: project.tasks
            .filter(t => t.status === 'in-progress')
            .map(t => ({
                taskId: t.id,
                taskTitle: t.title,
                daysStuck: 2, // Simplified
                assignee: t.assignee
            })),
        teamWorkload: []
    };

    // Generate components
    const alerts = detectBottlenecks(project);
    const sentiment = analyzeSentiment(messages);
    const recommendations = generateRecommendations(project, alerts, sentiment);
    const statusSummary = analyzeProjectStatus(project, messages);

    return {
        id: Math.random().toString(36).substr(2, 9),
        projectId: project.id,
        generatedAt: now.toISOString(),
        executiveSummary: statusSummary,
        redFlags: alerts,
        velocity: {
            tasksCompletedLast24h: completedLast24h,
            currentVelocity: project.progress / 10, // Simplified
            averageVelocity: 8.5,
            trend: project.progress > 50 ? 'increasing' : 'stable'
        },
        sentiment,
        recommendations
    };
}
