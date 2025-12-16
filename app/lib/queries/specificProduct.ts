import { Product, Row } from '@/app/data/types';
import { pool } from '@/app/lib/db';

interface GetProductResponse {
    success: boolean;
    message: string;
    data: {
        product: Product[];
        images: string[];
    } | null;
}

export async function getSpecificProduct(listingId: number): Promise<GetProductResponse> {
    const product = await pool.query<Row<Product>[]>(
        `SELECT products.*, CONCAT(users.first_name, " ", users.last_name) AS full_name, username 
                                  FROM products 
                                  JOIN users 
                                  ON products.seller_id = users.user_id 
                                  WHERE listing_id = ?`,
        [listingId]
    );

    const [images] = await pool.query<Row<{ images: string }>[]>(
        `SELECT image_url 
            FROM product_images
            WHERE listing_id = ?`,
        [listingId]
    );

    if (product[0].length === 0) {
        return {
            success: false,
            message: 'Product does not exist',
            data: null,
        };
    }

    return {
        success: true,
        message: 'Product Fetched Successfully',
        data: {
            product: product[0],
            images: images.map((img) => img.image_url),
        },
    };
}
