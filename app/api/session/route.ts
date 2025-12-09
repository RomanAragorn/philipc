import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';
import { pool } from '@/app/lib/db';
import { Row, UserSession } from '@/app/data/types';

export async function GET(): Promise<Response> {
    const cookie = await cookies();
    const session = cookie.get('session')?.value;

    if (!session) {
        return Response.json({ loggedIn: false, user: null });
    }

    const payload = await decrypt(session);

    if (!payload?.userId) {
        return Response.json({ loggedIn: false, user: null });
    }

    // Fetch user data from database
    const [users] = await pool.query<Row<UserSession>[]>(
        'SELECT user_id, username, first_name, last_name, profile_pic_url FROM users WHERE user_id = ?',
        [payload.userId]
    );

    if (!Array.isArray(users) || users.length === 0) {
        return Response.json({ loggedIn: false, user: null });
    }

    return Response.json({
        loggedIn: true,
        user: users[0],
    });
}
