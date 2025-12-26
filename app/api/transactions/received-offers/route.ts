import { verifySession } from '@/app/lib/session';
import { getReceivedOffersPending } from '@/app/lib/queries/transactions';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
    try {
        const session = await verifySession();

        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const userId = parseInt(session.userId);
        const result = await getReceivedOffersPending(userId);

        if (!result.success) {
            return NextResponse.json({ success: false, message: result.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: result.data });
    } catch (error) {
        console.error('Received Offers API error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
