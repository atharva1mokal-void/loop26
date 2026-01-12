import { NextRequest, NextResponse } from 'next/server';
import { getInsights } from '@/lib/storage';

export async function GET() {
    try {
        const insights = await getInsights();
        return NextResponse.json({ success: true, insights });
    } catch (error) {
        console.error('Error fetching insights:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch insights' },
            { status: 500 }
        );
    }
}
