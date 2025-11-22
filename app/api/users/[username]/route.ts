import { getUser } from '@/app/lib/queries/user';

export async function GET(
    req: Response,
    { params }: { params: { username: string } }
): Promise<Response> {
    const { username } = await params;
    const user = await getUser(username);
    console.log(user.data);

    return Response.json(user);
}
