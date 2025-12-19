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

interface Filters {
    category: string;
    search: string;
    condition: string;
    minPrice: string;
    maxPrice: string;
    sort: string;
    excludeSellerId?: number;
}

export async function getProducts(excludeSellerId?: number): Promise<GetProductResponse> {
    const params: Array<number> = [];
    let whereClause = 'WHERE p.is_avail = 1';

    if (excludeSellerId) {
        whereClause += ' AND p.seller_id <> ?';
        params.push(excludeSellerId);
    }

    const [products] = await pool.query<Row<Product>[]>(
        `SELECT p.*, CONCAT(u.first_name, " ", u.last_name) AS full_name, pi.image_url
            FROM products p
            JOIN users u
                ON p.seller_id = u.user_id
            LEFT JOIN product_images pi
                ON p.listing_id = pi.listing_id
                AND pi.is_cover = 1
            ${whereClause};`,
        params
    );
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

export async function getByProductCategory(type: string): Promise<GetProductResponse> {
    const [products] = await pool.query<Row<Product>[]>(
        `SELECT products.*, CONCAT(users.first_name, " ", users.last_name) AS full_name 
                                      FROM products 
                                      JOIN users 
                                      ON products.seller_id = users.user_id
                                      AND products.category = ?;`,
        type
    );
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

export async function filterProducts(filters: Filters): Promise<GetProductResponse> {
    let conditions = '';

    if (filters.category) conditions += ` AND products.category = '${filters.category}'`;
    if (filters.search) conditions += ` AND products.item_name LIKE '%${filters.search}%'`;
    if (filters.condition) conditions += ` AND products.item_condition = '${filters.condition}'`;
    if (filters.maxPrice && !filters.minPrice)
        conditions += ` AND products.item_price <= ${parseFloat(filters.maxPrice)}`;
    if (!filters.maxPrice && filters.minPrice)
        conditions += ` AND products.item_price >= ${parseFloat(filters.minPrice)}`;
    if (filters.maxPrice && filters.minPrice)
        conditions += ` AND products.item_price BETWEEN ${parseFloat(filters.minPrice)} AND ${filters.maxPrice}`;
    if (filters.sort) conditions += `  ORDER BY products.item_price ${filters.sort}`;

    if (filters.excludeSellerId)
        conditions += ` AND products.seller_id <> ${filters.excludeSellerId}`;

    conditions += ';';

    let query = `SELECT products.*, CONCAT(users.first_name, " ", users.last_name) AS full_name 
                                        FROM products 
                                        JOIN users 
                                        ON products.seller_id = users.user_id`;

    query = query += conditions;

    const [products] = await pool.query<Row<Product>[]>(query);
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
