'use server';

import { verifySession } from '@/app/lib/session';
import { verifyProductOwnership, deleteProduct } from '@/app/lib/queries/updateProduct';

export async function deleteProductAction(listingId: number): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        const session = await verifySession();
        if (!session?.userId) {
            return {
                success: false,
                message: 'You must be logged in to delete a listing',
            };
        }

        const ownershipCheck = await verifyProductOwnership(listingId, Number(session.userId));
        if (!ownershipCheck.success) {
            return {
                success: false,
                message: ownershipCheck.message,
            };
        }

        // Delete product
        const result = await deleteProduct(listingId);
        if (!result.success) {
            return {
                success: false,
                message: result.message,
            };
        }

        return {
            success: true,
            message: 'Product deleted successfully',
        };
    } catch (error) {
        console.error('Delete product action error:', error);
        return {
            success: false,
            message: 'An error occurred while deleting the product',
        };
    }
}
