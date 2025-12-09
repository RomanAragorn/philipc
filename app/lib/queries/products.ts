import { CreateProductInput, Product, Row } from '@/app/data/types';
import { pool } from '@/app/lib/db';

interface GetProductResponse {
    success: boolean;
    message: string;
    data: {
        products: Product[];
    } | null;
}

interface PostProductResponse {
    success: boolean;
    message: string;
    data: {
        products: {
            insertId: number;
        };
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

export async function postProduct(data: CreateProductInput): Promise<PostProductResponse> {
    try {
        const query = `INSERT INTO products (seller_id, category, item_name, item_condition, item_price, item_description, item_location) 
                                    VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            data.seller_id,
            data.category,
            data.item_name,
            data.item_condition,
            data.item_price,
            data.item_description,
            data.item_location,
        ];

        const [result] = await pool.execute(query, values);
        const insertId = (result as { insertId: number }).insertId;

        return {
            success: true,
            message: 'Product Posted Successfully',
            data: {
                products: {
                    insertId,
                },
            },
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Failed to Create Product',
            data: null,
        };
    }
}
