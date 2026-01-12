import { NextRequest, NextResponse } from 'next/server';
import { createProjectFromGitHub } from '@/lib/project-actions';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { repoFullName } = body;

        if (!repoFullName) {
            return NextResponse.json(
                { success: false, error: 'Repository name is required' },
                { status: 400 }
            );
        }

        const result = await createProjectFromGitHub(repoFullName);

        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json(result, { status: 400 });
        }
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create project'
            },
            { status: 500 }
        );
    }
}
