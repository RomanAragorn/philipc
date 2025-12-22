import { getSpecificProduct } from '@/app/lib/queries/specificProduct';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ listingId: string }> }
): Promise<NextResponse> {
    try {
        const { listingId } = await params;

        console.log(listingId);

        const product = await getSpecificProduct(listingId);

        return NextResponse.json(product);
    } catch (error) {
        console.error('GET /products/[id] error:', error);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Failed to fetch specific product' }),
            { status: 500 }
        );
    }
}
