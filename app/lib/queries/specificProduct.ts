import { Product, Row, Seller } from '@/app/data/types';
import { pool } from '@/app/lib/db';

interface GetProductResponse {
    success: boolean;
    message: string;
    data: {
        product: Product;
        images: string[];
        review: Seller;
    } | null;
}

export async function getSpecificProduct(listingId: number): Promise<GetProductResponse> {
    const [product] = await pool.query<Row<Product>[]>(
        `SELECT CONCAT(users.first_name, " ", users.last_name) AS full_name,
                users.fb_link, 
                username,
                profile_pic_url,

                products.*
            FROM products 
            JOIN users 
            ON products.seller_id = users.user_id 
            WHERE listing_id = ?`,
        [listingId]
    );

    if (product.length === 0) {
        return {
            success: false,
            message: 'Product does not exist',
            data: null,
        };
    }

    const [images] = await pool.query<Row<{ images: string }>[]>(
        `SELECT image_url 
            FROM product_images
            WHERE listing_id = ?`,
        [listingId]
    );

    const [review] = await pool.query<Row<Seller>[]>(
        `SELECT 
                AVG(review_rating) AS avg_rating,
                COUNT(review_rating) as review_count,
                (SELECT COUNT(*) FROM products
                    WHERE seller_id = ?
                        AND is_avail = 1) as product_count
             FROM reviews r
             JOIN transactions t ON r.transac_id = t.transac_id
             JOIN products p ON t.listing_id = p.listing_id
             JOIN users u ON u.user_id = p.seller_id
             WHERE p.seller_id = ? AND is_avail = 0`,
        [product[0].seller_id, product[0].seller_id]
    );

    return {
        success: true,
        message: 'Product Fetched Successfully',
        data: {
            product: product[0],
            images: images.map((img) => img.image_url),
            review: review[0],
        },
    };
}
