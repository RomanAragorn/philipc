import { pool } from '@/app/lib/db';
import { Row, Review } from '@/app/data/types';

interface ReviewsResponse {
    success: boolean;
    message: string;
    data: Review[] | null;
}

interface AddReviewResponse {
    success: boolean;
    message: string;
}

export async function getProductReviews(listingId: number): Promise<ReviewsResponse> {
    try {
        const [rows] = await pool.query<Row<Review>[]>(
            `SELECT 
                r.review_id,
                r.transac_id,
                r.review_text,
                r.review_rating,
                r.created_at,
                CONCAT(u.first_name, ' ', u.last_name) AS buyer_first_name,
                '' AS buyer_last_name,
                p.item_name,
                p.item_price,
                pi.image_url AS image
            FROM reviews r
            JOIN transactions t ON r.transac_id = t.transac_id
            JOIN products p ON t.listing_id = p.listing_id
            JOIN users u ON t.buyer_id = u.user_id
            LEFT JOIN product_images pi ON p.listing_id = pi.listing_id AND pi.is_cover = 1
            WHERE p.listing_id = ?
            ORDER BY r.created_at DESC`,
            [listingId]
        );
        return { success: true, message: 'Reviews fetched successfully', data: rows };
    } catch (error) {
        console.error('getProductReviews error:', error);
        return { success: false, message: 'Failed to fetch reviews', data: null };
    }
}

export async function addReviewIfEligible(
    listingId: number,
    userId: number,
    rating: number,
    text: string
): Promise<AddReviewResponse> {
    try {
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return { success: false, message: 'Rating must be between 1 and 5' };
        }

        const [txRows] = await pool.query<Row<{ transac_id: number; has_review: number }>[]>(
            `SELECT t.transac_id, 
                    CASE WHEN r.transac_id IS NULL THEN 0 ELSE 1 END AS has_review
             FROM transactions t
             LEFT JOIN reviews r ON r.transac_id = t.transac_id
             WHERE t.listing_id = ? AND t.buyer_id = ? AND t.transac_done = 1
             ORDER BY t.created_at DESC
             LIMIT 1`,
            [listingId, userId]
        );

        if (txRows.length === 0) {
            return { success: false, message: 'You have not purchased this product' };
        }

        const transacId = txRows[0].transac_id;
        if (txRows[0].has_review) {
            return { success: false, message: 'You already reviewed this transaction' };
        }

        await pool.query(
            `INSERT INTO reviews (transac_id, review_text, review_rating) VALUES (?, ?, ?)`,
            [transacId, text, rating]
        );

        return { success: true, message: 'Review submitted successfully' };
    } catch (error) {
        console.error('addReviewIfEligible error:', error);
        return { success: false, message: 'Failed to submit review' };
    }
}
