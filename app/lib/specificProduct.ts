import { Product, Row } from '@/app/data/types';
import { pool } from '@/app/lib/db';

interface GetProductResponse {
    success: boolean;
    message: string;
    data: {
        product: Product[];
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
        },
    };
}
