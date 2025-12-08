import { pool } from '@/app/lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface GetSignUpResponse {
    success: boolean;
    userId?: number;
    error?: string;
}

export async function checkUserExists(username: string, contact_no: string): Promise<boolean> {
    try {
        const [existingUsers] = await pool.query<RowDataPacket[]>(
            'SELECT user_id FROM users WHERE username = ? OR contact_no = ?',
            [username, contact_no]
        );

        return Array.isArray(existingUsers) && existingUsers.length > 0;
    } catch {
        return false;
    }
}

export async function signUp(
    first_name: string,
    last_name: string,
    email: string,
    contact_no: string,
    username: string,
    password: string
): Promise<GetSignUpResponse> {
    try {
        // Check if user already exists
        const userExists = await checkUserExists(username, contact_no);

        if (userExists) {
            return {
                success: false,
                error: 'Username or contact number already exists',
            };
        }

        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO users
                (first_name, last_name, email, contact_no, username, password)
                VALUES
                (?, ?, ?, ?, ?, ?)`,
            [first_name, last_name, email, contact_no, username, password]
        );

        return {
            success: true,
            userId: result.insertId,
        };
    } catch (error) {
        console.error('Sign up error:', error);
        return {
            success: false,
            error: 'An error occurred during signup',
        };
    }
}
