import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/session';
import { addReviewIfEligible, getProductReviews } from '@/app/lib/queries/reviews';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ listingId: string }> }
): Promise<NextResponse> {
    try {
        const listingId = Number((await params).listingId);
        if (!Number.isFinite(listingId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid listing id' },
                { status: 400 }
            );
        }

        const result = await getProductReviews(listingId);
        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, data: result.data });
    } catch (error) {
        console.error('GET /api/products/[listingId]/reviews error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ listingId: string }> }
): Promise<NextResponse> {
    try {
        const session = await verifySession();
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const listingId = Number((await params).listingId);
        if (!Number.isFinite(listingId)) {
            return NextResponse.json(
                { success: false, message: 'Invalid listing id' },
                { status: 400 }
            );
        }

        const body = await req.json();
        const rating = Number(body.rating);
        const text = String(body.text || '');

        const result = await addReviewIfEligible(listingId, Number(session.userId), rating, text);
        const status = result.success ? 200 : 400;
        return NextResponse.json(result, { status });
    } catch (error) {
        console.error('POST /api/products/[listingId]/reviews error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
