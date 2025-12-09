import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/app/lib/r2';
import { pool } from '@/app/lib/db';
import { ResultSetHeader } from 'mysql2';
import { verifySession } from '@/app/lib/session';
import { Row } from '@/app/data/types';
import crypto from 'crypto';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ listingId: string }> }
): Promise<NextResponse> {
    try {
        // Verify user
        const session = await verifySession();
        if (!session?.userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { listingId } = await params;
        const listingIdNum = parseInt(listingId);

        if (isNaN(listingIdNum)) {
            return NextResponse.json(
                { success: false, message: 'Invalid listing ID' },
                { status: 400 }
            );
        }

        const formData = await request.formData();
        const files = formData.getAll('images') as File[];

        if (files.length === 0) {
            return NextResponse.json(
                { success: false, message: 'No images provided' },
                { status: 400 }
            );
        }

        // Check current image count
        const [existingImages] = await pool.query<Row<{ count: number }>[]>(
            'SELECT COUNT(*) as count FROM product_images WHERE listing_id = ?',
            [listingIdNum]
        );
        const currentCount = existingImages[0].count;

        if (currentCount + files.length > 5) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Can only upload ${5 - currentCount} more images (max 5)`,
                },
                { status: 400 }
            );
        }

        const uploadedUrls: string[] = [];

        for (const file of files) {
            // Validate
            if (!file.type.startsWith('image/')) {
                continue;
            }

            if (file.size > 5 * 1024 * 1024) {
                continue;
            }

            const fileExtension = file.name.split('.').pop();
            const fileName = `products/${listingIdNum}/${crypto.randomUUID()}.${fileExtension}`;

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

            const imageUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;

            await pool.execute<ResultSetHeader>(
                'INSERT INTO product_images (listing_id, image_url, display_order) VALUES (?, ?, ?)',
                [listingIdNum, imageUrl, currentCount + uploadedUrls.length + 1]
            );

            uploadedUrls.push(imageUrl);
        }

        return NextResponse.json({
            success: true,
            message: `${uploadedUrls.length} images uploaded successfully`,
            data: { urls: uploadedUrls },
        });
    } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to upload images' },
            { status: 500 }
        );
    }
}
