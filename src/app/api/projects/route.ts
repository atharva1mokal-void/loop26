import { NextRequest, NextResponse } from 'next/server';
import { getProjects } from '@/lib/storage';

export async function GET() {
    try {
        const projects = await getProjects();
        return NextResponse.json({ success: true, projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}
