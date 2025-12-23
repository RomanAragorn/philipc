import { verifySession } from '@/app/lib/session';
import { createOffer, getOffersForListing, updateOfferStatus } from '@/app/lib/queries/offers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ listingId: string }> }
): Promise<NextResponse> {
    try {
        const { listingId } = await params;

        const session = await verifySession();
        if (!session?.userId) {
            return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), {
                status: 401,
            });
        }

        const listingIdNum = Number(listingId);
        if (Number.isNaN(listingIdNum)) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Invalid listing id' }),
                { status: 400 }
            );
        }

        const result = await getOffersForListing(listingIdNum, Number(session.userId));
        return NextResponse.json(result);
    } catch (error) {
        console.error('GET /offers error:', error);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Failed to fetch offers' }),
            { status: 500 }
        );
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ listingId: string }> }
): Promise<NextResponse> {
    try {
        const { listingId } = await params;

        const session = await verifySession();
        if (!session?.userId) {
            return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), {
                status: 401,
            });
        }

        const listingIdNum = Number(listingId);
        if (Number.isNaN(listingIdNum)) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Invalid listing id' }),
                {
                    status: 400,
                }
            );
        }

        const body = await req.json();
        if (!body) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Request body required' }),
                { status: 400 }
            );
        }

        const offerPrice = Number(body?.offer_price ?? body?.offerPrice);
        if (!Number.isFinite(offerPrice) || offerPrice <= 0) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Invalid offer price' }),
                { status: 400 }
            );
        }

        // Create Offer
        const result = await createOffer(listingIdNum, Number(session.userId), offerPrice);
        return NextResponse.json(result);
    } catch (error) {
        console.error('POST /offers error:', error);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Failed to submit offer' }),
            {
                status: 500,
            }
        );
    }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
    try {
        const session = await verifySession();
        const userId = session?.userId;

        if (!userId) {
            return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), {
                status: 401,
            });
        }

        const body = await req.json();
        if (!body) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Request body required' }),
                { status: 400 }
            );
        }

        const offerId = Number(body?.offer_id);
        const status = body?.status;

        if (!Number.isFinite(offerId) || offerId <= 0) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Invalid offer ID' }),
                { status: 400 }
            );
        }

        if (!['Accepted', 'Rejected'].includes(status)) {
            return new NextResponse(JSON.stringify({ success: false, message: 'Invalid status' }), {
                status: 400,
            });
        }

        // Update offer status
        const result = await updateOfferStatus(offerId, Number(userId), status);

        return NextResponse.json(result);
    } catch (error) {
        console.error('PATCH /offers error:', error);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Failed to update offer' }),
            {
                status: 500,
            }
        );
    }
}
