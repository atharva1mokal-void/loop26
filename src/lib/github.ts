import { Octokit } from 'octokit';

/**
 * Get authenticated Octokit instance
 * Requires GITHUB_TOKEN environment variable
 */
export function getOctokit() {
    const token = process.env.GITHUB_TOKEN;
    return new Octokit(token ? { auth: token } : {});
}

/**
 * Fetch user's GitHub repositories
 */
export async function fetchUserRepos() {
    const octokit = getOctokit();

    try {
        const { data } = await octokit.rest.repos.listForAuthenticatedUser({
            sort: 'updated',
            per_page: 100,
            affiliation: 'owner,collaborator',
        });

        return data.map(repo => ({
            id: repo.id,
            fullName: repo.full_name,
            name: repo.name,
            description: repo.description || '',
            url: repo.html_url,
            language: repo.language,
            stars: repo.stargazers_count,
            updatedAt: repo.updated_at,
        }));
    } catch (error) {
        console.error('Failed to fetch repos:', error);
        throw error;
    }
}

/**
 * Fetch issues from a GitHub repository
 */
export async function fetchRepoIssues(owner: string, repo: string) {
    const octokit = getOctokit();

    try {
        const { data } = await octokit.rest.issues.listForRepo({
            owner,
            repo,
            state: 'all',
            per_page: 100,
        });

        // Filter out pull requests (GitHub API returns PRs as issues)
        return data.filter(issue => !issue.pull_request).map(issue => ({
            id: issue.id,
            number: issue.number,
            title: issue.title,
            state: issue.state,
            labels: issue.labels.map(label => typeof label === 'string' ? label : label.name),
            assignee: issue.assignee?.login,
            createdAt: issue.created_at,
            updatedAt: issue.updated_at,
        }));
    } catch (error) {
        console.error(`Failed to fetch issues for ${owner}/${repo}:`, error);
        throw error;
    }
}

/**
 * Fetch pull requests from a GitHub repository
 */
export async function fetchRepoPRs(owner: string, repo: string) {
    const octokit = getOctokit();

    try {
        const { data } = await octokit.rest.pulls.list({
            owner,
            repo,
            state: 'all',
            per_page: 100,
        });

        return data.map(pr => ({
            id: pr.id,
            number: pr.number,
            title: pr.title,
            state: pr.state,
            draft: pr.draft,
            assignee: pr.assignee?.login,
            createdAt: pr.created_at,
            updatedAt: pr.updated_at,
        }));
    } catch (error) {
        console.error(`Failed to fetch PRs for ${owner}/${repo}:`, error);
        throw error;
    }
}

/**
 * Get repository statistics
 */
export async function fetchRepoStats(owner: string, repo: string) {
    const octokit = getOctokit();

    try {
        const { data } = await octokit.rest.repos.get({
            owner,
            repo,
        });

        return {
            stars: data.stargazers_count,
            forks: data.forks_count,
            openIssues: data.open_issues_count,
            language: data.language,
            updatedAt: data.updated_at,
        };
    } catch (error) {
        console.error(`Failed to fetch stats for ${owner}/${repo}:`, error);
        throw error;
    }
}
