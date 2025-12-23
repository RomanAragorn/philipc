import { Row, Offer } from '@/app/data/types';
import { pool } from '@/app/lib/db';

interface createProductResponse {
    success: boolean;
    message: string;
    data?: {
        insertId: number;
    };
}

export async function createOffer(
    listingId: number,
    buyerId: number,
    offerPrice: number
): Promise<createProductResponse> {
    try {
        const [products] = await pool.query<Row<{ is_avail: number; seller_id: number }>[]>(
            'SELECT is_avail, seller_id FROM products WHERE listing_id = ?',
            [listingId]
        );

        if (!products.length) {
            return { success: false, message: 'Product not found' };
        }

        const product = products[0];
        if (!product.is_avail) {
            return { success: false, message: 'Product is no longer available' };
        }

        if (product.seller_id === buyerId) {
            return { success: false, message: 'You cannot offer on your own listing' };
        }

        const [result] = await pool.execute(
            'INSERT INTO offers (listing_id, buyer_id, offer_price) VALUES (?, ?, ?)',
            [listingId, buyerId, offerPrice]
        );

        const insertId = (result as { insertId: number }).insertId;
        return { success: true, message: 'Offer submitted successfully', data: { insertId } };
    } catch (error) {
        console.error('createOffer error:', error);
        return { success: false, message: 'Failed to submit offer' };
    }
}

export async function getOffersForListing(
    listingId: number,
    requesterUserId: number
): Promise<{ success: boolean; message: string; data: { offers: Offer[] } | null }> {
    try {
        const [products] = await pool.query<Row<{ seller_id: number }>[]>(
            'SELECT seller_id FROM products WHERE listing_id = ?',
            [listingId]
        );

        if (!products.length) {
            return { success: false, message: 'Product not found', data: null };
        }

        const isSeller = products[0].seller_id === requesterUserId;

        let query = '';
        let params: Array<number> = [];
        if (isSeller) {
            query = `SELECT o.*, CONCAT(u.first_name, ' ', u.last_name) AS buyer_name
                     FROM offers o
                     JOIN users u ON u.user_id = o.buyer_id
                     WHERE o.listing_id = ?
                     ORDER BY o.created_at DESC`;
            params = [listingId];
        } else {
            query = `SELECT o.*, CONCAT(u.first_name, ' ', u.last_name) AS buyer_name
                     FROM offers o
                     JOIN users u ON u.user_id = o.buyer_id
                     WHERE o.listing_id = ? AND o.buyer_id = ?
                     ORDER BY o.created_at DESC`;
            params = [listingId, requesterUserId];
        }

        const [offers] = await pool.query<Row<Offer>[]>(query, params);
        return {
            success: true,
            message: 'Offers fetched successfully',
            data: { offers },
        };
    } catch (error) {
        console.error('getOffersForListing error:', error);
        return { success: false, message: 'Failed to fetch offers', data: null };
    }
}

export async function updateOfferStatus(
    offerId: number,
    sellerId: number,
    status: 'Accepted' | 'Rejected'
): Promise<{ success: boolean; message: string }> {
    try {
        if (!['Accepted', 'Rejected'].includes(status)) {
            return { success: false, message: 'Invalid status' };
        }

        const [rows] = await pool.query<Row<{ listing_id: number; seller_id: number }>[]>(
            `SELECT o.listing_id, p.seller_id
             FROM offers o
             JOIN products p ON p.listing_id = o.listing_id
             WHERE o.offer_id = ?`,
            [offerId]
        );

        if (!rows.length) {
            return { success: false, message: 'Offer not found' };
        }

        if (rows[0].seller_id !== sellerId) {
            return { success: false, message: 'Not authorized to update this offer' };
        }

        const [offerRows] = await pool.query<
            Row<{ offer_status: 'Pending' | 'Accepted' | 'Rejected' }>[]
        >('SELECT offer_status FROM offers WHERE offer_id = ?', [offerId]);
        if (!offerRows.length) {
            return { success: false, message: 'Offer not found' };
        }
        if (offerRows[0].offer_status !== 'Pending') {
            return { success: false, message: 'Only pending offers can be updated' };
        }

        await pool.execute('UPDATE offers SET offer_status = ? WHERE offer_id = ?', [
            status,
            offerId,
        ]);

        return { success: true, message: `Offer ${status.toLowerCase()} successfully` };
    } catch (error) {
        console.error('updateOfferStatus error:', error);
        return { success: false, message: 'Failed to update offer status' };
    }
}

export async function getOffersForSellerProduct(
    listingId: number,
    sellerId: number
): Promise<{ success: boolean; message: string; data: { offers: Offer[] } | null }> {
    try {
        const [products] = await pool.query<Row<{ seller_id: number }>[]>(
            'SELECT seller_id FROM products WHERE listing_id = ?',
            [listingId]
        );

        if (!products.length) {
            return { success: false, message: 'Product not found', data: null };
        }

        if (products[0].seller_id !== sellerId) {
            return {
                success: false,
                message: 'Not authorized to view offers for this product',
                data: null,
            };
        }

        // Get all offers for this listing with buyer information
        const [offers] = await pool.query<Row<Offer>[]>(
            `SELECT 
                o.offer_id,
                o.listing_id,
                o.buyer_id,
                o.offer_price,
                o.offer_status,
                o.created_at,
                CONCAT(u.first_name, ' ', u.last_name) AS buyer_name
             FROM offers o
             JOIN users u ON u.user_id = o.buyer_id
             WHERE o.listing_id = ?
             ORDER BY o.created_at DESC`,
            [listingId]
        );

        return {
            success: true,
            message: 'Offers fetched successfully',
            data: { offers },
        };
    } catch (error) {
        console.error('getOffersForSellerProduct error:', error);
        return { success: false, message: 'Failed to fetch offers', data: null };
    }
}
