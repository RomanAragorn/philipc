import { getUser } from '@/app/lib/user';

export async function GET(
    req: Response,
    { params }: { params: { username: string } }
): Promise<Response> {
    const { username } = await params;
    const user = await getUser(username);

    return Response.json(user);
}
