'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { postProduct } from '@/app/lib/queries/products';
import { verifySession } from '@/app/lib/session';

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

    // Validate form data
    const result = createListingSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { category, item_name, item_price, item_condition, item_location, item_description } =
        result.data;

    let productId: number | undefined;

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

        productId = response.data?.products?.insertId;

        if (!productId) {
            return {
                errors: {
                    general: ['Failed to get product ID'],
                },
            };
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
