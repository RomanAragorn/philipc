'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { verifySession } from '@/app/lib/session';
import {
    verifyProductOwnership,
    updateProduct,
    updateProductImages,
} from '@/app/lib/queries/updateProduct';

export type UpdateListingState =
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

const updateListingSchema = z.object({
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

export async function updateListing(
    prevState: UpdateListingState,
    formData: FormData
): Promise<UpdateListingState> {
    // Verify user is logged in
    const session = await verifySession();
    if (!session?.userId) {
        return {
            errors: {
                general: ['You must be logged in to update a listing'],
            },
        };
    }

    const listingId = formData.get('listing_id') as string;
    if (!listingId) {
        return {
            errors: {
                general: ['Listing ID is required'],
            },
        };
    }

    // Verify ownership
    const ownershipCheck = await verifyProductOwnership(Number(listingId), Number(session.userId));
    if (!ownershipCheck.success) {
        return {
            errors: {
                general: [ownershipCheck.message],
            },
        };
    }

    // Extract images
    const existingImages = formData.getAll('existing_images') as string[];
    const newImages = formData.getAll('new_images') as File[];

    // Remove image fields from validation
    formData.delete('existing_images');
    formData.delete('new_images');
    formData.delete('listing_id');

    // Validate form data
    const result = updateListingSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { category, item_name, item_price, item_condition, item_location, item_description } =
        result.data;

    try {
        // Update product details
        const updateResult = await updateProduct({
            listing_id: Number(listingId),
            category,
            item_name,
            item_price,
            item_condition,
            item_location,
            item_description,
        });

        if (!updateResult.success) {
            return {
                errors: {
                    general: [updateResult.message],
                },
            };
        }

        // Handle image updates
        const imageResult = await updateProductImages(Number(listingId), existingImages, newImages);

        if (!imageResult.success) {
            console.warn('Image update warning:', imageResult.message);
        }
    } catch (error) {
        console.error('Update listing error:', error);
        return {
            errors: {
                general: ['An error occurred while updating the listing. Please try again.'],
            },
        };
    }

    redirect(`/products/${listingId}`);
}
