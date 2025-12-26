import { pool } from '@/app/lib/db';
import { OfferWithDetails, Row, Transaction } from '@/app/data/types';

export async function getUserPurchases(
    userId: number
): Promise<{ success: boolean; message: string; data: Transaction[] | null }> {
    try {
        const [asBuyer] = await pool.query<Row<Transaction>[]>(
            `SELECT 
                t.*, 
                p.item_name, 
                p.item_price, 
                p.item_condition, 
                pi.image_url, 
                CONCAT(u.first_name, ' ', u.last_name) AS seller_name, 
                u.username AS seller_username, 
                CONCAT(buyer.first_name, ' ', buyer.last_name) AS buyer_name, 
                buyer.username AS buyer_username, 
                r.* 
            FROM transactions t 
            JOIN products p ON t.listing_id = p.listing_id 
            JOIN users u ON p.seller_id = u.user_id 
            JOIN users buyer ON t.buyer_id = buyer.user_id 
            LEFT JOIN product_images pi ON p.listing_id = pi.listing_id AND pi.is_cover = 1 
            LEFT JOIN reviews r ON t.transac_id = r.transac_id 
            WHERE t.buyer_id = ? 
            ORDER BY t.created_at DESC`,
            [userId]
        );

        return { success: true, message: 'Purchases fetched successfully', data: asBuyer };
    } catch (error) {
        console.error('getUserPurchases error:', error);
        return { success: false, message: 'Failed to fetch purchases', data: null };
    }
}

export async function getUserSales(
    userId: number
): Promise<{ success: boolean; message: string; data: Transaction[] | null }> {
    try {
        const [asSeller] = await pool.query<Row<Transaction>[]>(
            `SELECT 
                t.*, 
                p.item_name, 
                p.item_price, 
                p.item_condition, 
                pi.image_url, 
                CONCAT(u.first_name, ' ', u.last_name) AS seller_name, 
                u.username AS seller_username, 
                CONCAT(buyer.first_name, ' ', buyer.last_name) AS buyer_name, 
                buyer.username AS buyer_username, 
                r.* 
            FROM transactions t 
            JOIN products p ON t.listing_id = p.listing_id 
            JOIN users u ON p.seller_id = u.user_id 
            JOIN users buyer ON t.buyer_id = buyer.user_id 
            LEFT JOIN product_images pi ON p.listing_id = pi.listing_id AND pi.is_cover = 1 
            LEFT JOIN reviews r ON t.transac_id = r.transac_id 
            WHERE p.seller_id = ? 
            ORDER BY t.created_at DESC`,
            [userId]
        );

        return { success: true, message: 'Sales fetched successfully', data: asSeller };
    } catch (error) {
        console.error('getUserSales error:', error);
        return { success: false, message: 'Failed to fetch sales', data: null };
    }
}

export async function getReceivedOffersPending(
    userId: number
): Promise<{ success: boolean; message: string; data: OfferWithDetails[] | null }> {
    try {
        const [receivedOffers] = await pool.query<Row<OfferWithDetails>[]>(
            `SELECT 
                o.offer_id, 
                o.listing_id, 
                o.buyer_id, 
                p.seller_id, 
                o.offer_price, 
                o.offer_status, 
                o.created_at, 
                p.item_name, 
                p.item_price, 
                p.item_condition, 
                pi.image_url, 
                CONCAT(seller.first_name, ' ', seller.last_name) AS seller_name, 
                seller.username AS seller_username, 
                CONCAT(buyer.first_name, ' ', buyer.last_name) AS buyer_name, 
                buyer.username AS buyer_username 
            FROM offers o 
            JOIN products p ON o.listing_id = p.listing_id 
            JOIN users seller ON p.seller_id = seller.user_id 
            JOIN users buyer ON o.buyer_id = buyer.user_id 
            LEFT JOIN product_images pi ON p.listing_id = pi.listing_id AND pi.is_cover = 1 
            WHERE p.seller_id = ? AND o.offer_status = 'Pending' 
            ORDER BY o.created_at DESC`,
            [userId]
        );

        return {
            success: true,
            message: 'Received offers fetched successfully',
            data: receivedOffers,
        };
    } catch (error) {
        console.error('getReceivedOffersPending error:', error);
        return { success: false, message: 'Failed to fetch received offers', data: null };
    }
}

export async function getSentOffersPending(
    userId: number
): Promise<{ success: boolean; message: string; data: OfferWithDetails[] | null }> {
    try {
        const [sentOffers] = await pool.query<Row<OfferWithDetails>[]>(
            `SELECT 
                o.offer_id, 
                o.listing_id, 
                o.buyer_id, 
                p.seller_id, 
                o.offer_price, 
                o.offer_status, 
                o.created_at, 
                p.item_name, 
                p.item_price, 
                p.item_condition, 
                pi.image_url, 
                CONCAT(seller.first_name, ' ', seller.last_name) AS seller_name, 
                seller.username AS seller_username, 
                CONCAT(buyer.first_name, ' ', buyer.last_name) AS buyer_name, 
                buyer.username AS buyer_username 
            FROM offers o 
            JOIN products p ON o.listing_id = p.listing_id 
            JOIN users seller ON p.seller_id = seller.user_id 
            JOIN users buyer ON o.buyer_id = buyer.user_id 
            LEFT JOIN product_images pi ON p.listing_id = pi.listing_id AND pi.is_cover = 1 
            WHERE o.buyer_id = ? AND o.offer_status = 'Pending' 
            ORDER BY o.created_at DESC`,
            [userId]
        );

        return { success: true, message: 'Sent offers fetched successfully', data: sentOffers };
    } catch (error) {
        console.error('getSentOffersPending error:', error);
        return { success: false, message: 'Failed to fetch sent offers', data: null };
    }
}
