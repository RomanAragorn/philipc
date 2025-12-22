import { getUser } from '@/app/lib/queries/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ username: string }> }
): Promise<NextResponse> {
    const { username } = await params;
    const user = await getUser(username);

    return NextResponse.json(user);
}
