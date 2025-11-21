import { Product, Row } from '@/app/data/types';
import { pool } from '@/app/lib/db';

interface GetProductResponse {
    success: boolean;
    message: string;
    data: {
        products: Product[];
    } | null;
}

export async function getProducts(): Promise<GetProductResponse> {
    const [products] = await pool.query<
        Row<Product>[]
    >(`SELECT products.*, CONCAT(users.first_name, " ", users.last_name) AS full_name 
                                      FROM products 
                                      JOIN users 
                                      ON products.seller_id = users.user_id;`);
    if (products.length === 0) {
        return {
            success: false,
            message: 'Products does not exist',
            data: null,
        };
    }

    return {
        success: true,
        message: 'Products Fetched Successfully',
        data: {
            products: products,
        },
    };
}
