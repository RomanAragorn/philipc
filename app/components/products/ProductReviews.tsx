'use client';

import React, { useState } from 'react';
import { Review, UserSession } from '@/app/data/types';
import { Star, Send } from 'lucide-react';
import Dropdown from '../Dropdown';

interface ProductReviewsProps {
    listingId: string;
    reviews: Review[];
    canReview: boolean;
    user: UserSession | null;
    onReviewSubmitted: () => void;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
    listingId,
    reviews,
    canReview,
    onReviewSubmitted,
}) => {
    const [reviewRating, setReviewRating] = useState('5');
    const [reviewText, setReviewText] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    const handleReviewSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setReviewError('');

        if (!reviewText.trim()) {
            setReviewError('Please enter a review');
            return;
        }

        setReviewSubmitting(true);

        try {
            const response = await fetch(`/api/products/${listingId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating: parseInt(reviewRating),
                    text: reviewText,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setReviewError(data.error || 'Failed to submit review');
                return;
            }

            setReviewText('');
            setReviewRating('5');
            onReviewSubmitted();
        } catch (error) {
            setReviewError('An error occurred while submitting your review');
            console.error('Review submission error:', error);
        } finally {
            setReviewSubmitting(false);
        }
    };

    if (reviews.length === 0 && !canReview) {
        return null;
    }

    return (
        <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reviews</h3>

            {canReview && (
                <form
                    onSubmit={handleReviewSubmit}
                    className="space-y-4 border-b border-gray-200 pb-6 dark:border-gray-700"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Your Rating
                        </label>
                        <Dropdown
                            label=""
                            options={[
                                { id: 5, label: '★★★★★ Excellent', value: '5' },
                                { id: 4, label: '★★★★ Good', value: '4' },
                                { id: 3, label: '★★★ Average', value: '3' },
                                { id: 2, label: '★★ Poor', value: '2' },
                                { id: 1, label: '★ Very Poor', value: '1' },
                            ]}
                            selected={reviewRating}
                            onChange={setReviewRating}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Your Review
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your experience with this product..."
                            className="h-24 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                    </div>

                    {reviewError && (
                        <p className="text-sm text-red-600 dark:text-red-400">{reviewError}</p>
                    )}

                    <button
                        type="submit"
                        disabled={reviewSubmitting}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        <Send className="h-4 w-4" />
                        {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">No reviews yet</p>
                ) : (
                    reviews.map((review) => (
                        <div
                            key={review.review_id}
                            className="border-b border-gray-200 pb-4 last:border-b-0 dark:border-gray-700"
                        >
                            <div className="mb-2 flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {review.buyer_first_name}
                                    </p>
                                    <div className="mt-1 flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3.5 w-3.5 ${
                                                    i < review.review_rating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300 dark:text-gray-600'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {review.review_text}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
