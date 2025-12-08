import { Row, User } from '@/app/data/types';
import { pool } from '../db';

interface GetVerifyUserResponse {
    success: boolean;
    message: string;
    data: {
        loggedIn: boolean;
        user_id: number;
    } | null;
}

export async function verifyUser(
    username: string,
    password: string
): Promise<GetVerifyUserResponse> {
    const [users] = await pool.query<Row<User>[]>(
        `SELECT user_id FROM users WHERE (username = ? OR email = ?) AND password = ?`,
        [username, username, password]
    );

    if (users.length === 0) {
        return {
            success: false,
            message: 'User does not exist/Wrong credentials',
            data: null,
        };
    }

    const user = users[0];
    const user_id = user.user_id;

    return {
        success: true,
        message: 'Logged In Successfully',
        data: {
            loggedIn: true,
            user_id: user_id,
        },
    };
}
