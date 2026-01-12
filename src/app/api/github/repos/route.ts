import { NextRequest, NextResponse } from 'next/server';
import { fetchUserRepos } from '@/lib/github';

export async function GET(request: NextRequest) {
    try {
        const repos = await fetchUserRepos();
        return NextResponse.json({ success: true, repos });
    } catch (error) {
        console.error('Error fetching repos:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch repositories'
            },
            { status: 500 }
        );
    }
}
