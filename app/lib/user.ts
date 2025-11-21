import { Product, Review, Row, User } from '@/app/data/types';
import { pool } from '@/app/lib/db';

interface AvgRating {
    avg_rating: number | null;
}

interface GetUserResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        listings: Product[];
        reviews: Review[];
        avg_rating: number | null;
    } | null;
}

export async function getUser(username: string): Promise<GetUserResponse> {
    const [users] = await pool.query<Row<User>[]>(`SELECT * FROM users WHERE username = ?`, [
        username,
    ]);

    if (users.length === 0) {
        return {
            success: false,
            message: 'User does not exist',
            data: null,
        };
    }

    const user = users[0];
    const user_id = user.user_id;

    const [listings] = await pool.query<Row<Product>[]>(
        `SELECT * FROM products WHERE seller_id = ?`,
        [user_id]
    );

    const [reviews] = await pool.query<Row<Review>[]>(
        `SELECT *
         FROM reviews r
         JOIN transactions t ON r.transac_id = t.transac_id
         JOIN products p ON t.listing_id = p.listing_id
         WHERE p.seller_id = ? AND is_avail = 1`,
        [user_id]
    );

    // Fetch average rating
    const [rating] = await pool.query<Row<AvgRating>[]>(
        `SELECT AVG(review_rating) AS avg_rating
         FROM reviews r
         JOIN transactions t ON r.transac_id = t.transac_id
         JOIN products p ON t.listing_id = p.listing_id
         WHERE p.seller_id = ? AND is_avail = 1`,
        [user_id]
    );

    const avg_rating = rating[0].avg_rating || null;

    return {
        success: true,
        message: 'User Fetched Succesfully',
        data: {
            user,
            avg_rating,
            listings,
            reviews,
        },
    };
}
