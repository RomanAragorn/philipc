'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { postProduct } from '@/app/lib/queries/products';
import { verifySession } from '@/app/lib/session';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/app/lib/r2';
import { pool } from '@/app/lib/db';
import { Row } from '@/app/data/types';
import crypto from 'crypto';

export type CreateListingState =
    | {
          errors?: {
              category?: string[];
              item_name?: string[];
              item_price?: string[];
              item_condition?: string[];
              item_location?: string[];
              item_description?: string[];
              general?: string[];
          };
      }
    | undefined;

const createListingSchema = z.object({
    category: z.enum(['CPU', 'GPU', 'RAM', 'Memory', 'Peripherals', 'Monitors', 'Miscellaneous'], {
        message: 'Please select a valid category',
    }),
    item_name: z.string().min(1, { message: 'Item name is required' }).trim(),
    item_price: z.coerce
        .number({ message: 'Price must be a valid number' })
        .positive({ message: 'Price must be greater than 0' })
        .max(9999999.99, { message: 'Price is too high' }),
    item_condition: z.enum(
        ['Brand New', 'Like New', 'Slightly Used', 'Well Used', 'Heavily Used'],
        {
            message: 'Please select a valid condition',
        }
    ),
    item_location: z.string().min(1, { message: 'Location is required' }).trim(),
    item_description: z
        .string()
        .min(10, { message: 'Description must be at least 10 characters' })
        .trim(),
});

export async function createListing(
    prevState: CreateListingState,
    formData: FormData
): Promise<CreateListingState> {
    // Verify user is logged in
    const session = await verifySession();
    if (!session?.userId) {
        return {
            errors: {
                general: ['You must be logged in to create a listing'],
            },
        };
    }

    // Extract images before validation
    const images = formData.getAll('images') as File[];
    formData.delete('images');

    // Validate form data
    const result = createListingSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { category, item_name, item_price, item_condition, item_location, item_description } =
        result.data;

    let productId: number;

    try {
        const response = await postProduct({
            seller_id: Number(session.userId),
            category,
            item_name,
            item_price,
            item_condition,
            item_description,
            item_location,
        });

        if (!response.success) {
            return {
                errors: {
                    general: [response.message || 'Failed to create listing'],
                },
            };
        }

        productId = response.data?.products?.insertId || 0;

        if (!productId) {
            return {
                errors: {
                    general: ['Failed to get product ID'],
                },
            };
        }

        // Upload images
        if (images.length > 0) {
            const validImages = images.filter((image) => image instanceof File && image.size > 0);
            if (validImages.length > 0) {
                const uploadResult = await uploadProductImages(productId, validImages);
                if (!uploadResult.success) {
                    console.warn('Image upload warning:', uploadResult.message);
                }
            }
        }
    } catch (error) {
        console.error('Create listing error:', error);
        return {
            errors: {
                general: ['An error occurred while creating the listing. Please try again.'],
            },
        };
    }

    redirect(`/products/${productId}`);
}

async function uploadProductImages(
    listingId: number,
    files: File[]
): Promise<{ success: boolean; message: string }> {
    try {
        // Check current image count
        const [existingImages] = await pool.query<Row<{ count: number }>[]>(
            'SELECT COUNT(*) as count FROM product_images WHERE listing_id = ?',
            [listingId]
        );
        const currentCount = existingImages[0]?.count || 0;

        if (currentCount + files.length > 5) {
            return {
                success: false,
                message: `Can only upload ${5 - currentCount} more images (max 5)`,
            };
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                continue;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                continue;
            }

            // Generate unique filename
            const fileExtension = file.name.split('.').pop();
            const fileName = `products/${listingId}/${crypto.randomUUID()}.${fileExtension}`;

            // Convert file to buffer
            const buffer = Buffer.from(await file.arrayBuffer());

            // Upload to R2
            await r2.send(
                new PutObjectCommand({
                    Bucket: process.env.R2_BUCKET_NAME!,
                    Key: fileName,
                    Body: buffer,
                    ContentType: file.type,
                })
            );

            // Save to database
            const imageUrl = `${process.env.R2_PUBLIC_DOMAIN}/${fileName}`;
            await pool.execute(
                'INSERT INTO product_images (listing_id, image_url, display_order) VALUES (?, ?, ?)',
                [listingId, imageUrl, currentCount + uploadedUrls.length + 1]
            );

            uploadedUrls.push(imageUrl);
        }

        return {
            success: true,
            message: `${uploadedUrls.length} images uploaded successfully`,
        };
    } catch (error) {
        console.error('Upload images error:', error);
        return {
            success: false,
            message: 'Failed to upload images',
        };
    }
}
