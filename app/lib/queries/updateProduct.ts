import { pool } from '@/app/lib/db';
import { Row } from '@/app/data/types';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/app/lib/r2';
import crypto from 'crypto';

interface UpdateProductInput {
    listing_id: number;
    category: string;
    item_name: string;
    item_price: number;
    item_condition: string;
    item_location: string;
    item_description: string;
}

interface UpdateProductResponse {
    success: boolean;
    message: string;
}

export async function verifyProductOwnership(
    listingId: number,
    userId: number
): Promise<{ success: boolean; message: string }> {
    try {
        const [products] = await pool.query<Row<{ seller_id: number }>[]>(
            'SELECT seller_id FROM products WHERE listing_id = ?',
            [listingId]
        );

        if (products.length === 0) {
            return {
                success: false,
                message: 'Product not found',
            };
        }

        if (products[0].seller_id !== userId) {
            return {
                success: false,
                message: 'You do not have permission to edit this listing',
            };
        }

        return {
            success: true,
            message: 'Ownership verified',
        };
    } catch (error) {
        console.error('Ownership verification error:', error);
        return {
            success: false,
            message: 'Failed to verify ownership',
        };
    }
}

export async function updateProduct(data: UpdateProductInput): Promise<UpdateProductResponse> {
    try {
        await pool.execute(
            `UPDATE products 
             SET category = ?, item_name = ?, item_price = ?, item_condition = ?, 
                 item_location = ?, item_description = ?
             WHERE listing_id = ?`,
            [
                data.category,
                data.item_name,
                data.item_price,
                data.item_condition,
                data.item_location,
                data.item_description,
                data.listing_id,
            ]
        );

        return {
            success: true,
            message: 'Product updated successfully',
        };
    } catch (error) {
        console.error('Update product error:', error);
        return {
            success: false,
            message: 'Failed to update product',
        };
    }
}

export async function updateProductImages(
    listingId: number,
    existingImages: string[],
    newImages: File[]
): Promise<{ success: boolean; message: string }> {
    try {
        const [currentImages] = await pool.query<Row<{ image_id: number; image_url: string }>[]>(
            'SELECT image_id, image_url FROM product_images WHERE listing_id = ? ORDER BY display_order',
            [listingId]
        );

        const imagesToDelete = currentImages.filter(
            (img) => !existingImages.includes(img.image_url)
        );

        for (const img of imagesToDelete) {
            const url = new URL(img.image_url);
            const key = url.pathname.substring(1);

            try {
                await r2.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.R2_BUCKET_NAME!,
                        Key: key,
                    })
                );

                await pool.execute('DELETE FROM product_images WHERE image_id = ?', [img.image_id]);
            } catch (error) {
                console.error('Failed to delete image:', error);
            }
        }

        // Upload new images
        if (newImages.length > 0) {
            const validImages = newImages.filter(
                (image) => image instanceof File && image.size > 0
            );

            if (validImages.length > 0) {
                const [countResult] = await pool.query<Row<{ count: number }>[]>(
                    'SELECT COUNT(*) as count FROM product_images WHERE listing_id = ?',
                    [listingId]
                );
                let displayOrder = countResult[0]?.count || 0;

                for (const file of validImages) {
                    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) {
                        continue;
                    }

                    const fileExtension = file.name.split('.').pop();
                    const fileName = `products/${listingId}/${crypto.randomUUID()}.${fileExtension}`;

                    const buffer = Buffer.from(await file.arrayBuffer());

                    await r2.send(
                        new PutObjectCommand({
                            Bucket: process.env.R2_BUCKET_NAME!,
                            Key: fileName,
                            Body: buffer,
                            ContentType: file.type,
                        })
                    );

                    const imageUrl = `${process.env.R2_PUBLIC_DOMAIN}/${fileName}`;
                    await pool.execute(
                        'INSERT INTO product_images (listing_id, image_url, display_order) VALUES (?, ?, ?)',
                        [listingId, imageUrl, ++displayOrder]
                    );
                }
            }
        }

        return {
            success: true,
            message: 'Images updated successfully',
        };
    } catch (error) {
        console.error('Update images error:', error);
        return {
            success: false,
            message: 'Failed to update images',
        };
    }
}
