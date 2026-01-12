import { NextRequest, NextResponse } from 'next/server';
import { syncProjectWithGitHub } from '@/lib/project-actions';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { projectId } = body;

        if (!projectId) {
            return NextResponse.json(
                { success: false, error: 'Project ID is required' },
                { status: 400 }
            );
        }

        const result = await syncProjectWithGitHub(projectId);

        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json(result, { status: 400 });
        }
    } catch (error) {
        console.error('Error syncing project:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to sync project'
            },
            { status: 500 }
        );
    }
}
