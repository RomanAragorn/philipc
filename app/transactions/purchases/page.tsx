'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Star, X } from 'lucide-react';
import { Transaction } from '@/app/data/types';

const PurchasesPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewModal, setReviewModal] = useState<{ listingId: number; itemName: string } | null>(
        null
    );
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewText, setReviewText] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);

    useEffect(() => {
        const fetchTransactions = async (): Promise<void> => {
            try {
                const res = await fetch('/api/transactions/purchases');
                if (!res.ok) throw new Error('Failed to fetch transactions');
                const json = await res.json();
                if (json.success && json.data) {
                    setTransactions(json.data);
                }
            } catch (error) {
                console.error('Error fetching purchases:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const handleReviewSubmit = async (): Promise<void> => {
        if (!reviewModal) return;
        setReviewError('');
        setReviewSubmitting(true);
        try {
            const res = await fetch(`/api/products/${reviewModal.listingId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating: reviewRating, text: reviewText }),
            });
            const json = await res.json();
            if (!res.ok || !json.success) {
                setReviewError(json.message || 'Failed to submit review');
            } else {
                setReviewText('');
                setReviewRating(5);
                setReviewModal(null);
                // Refresh transactions
                const refreshRes = await fetch('/api/transactions/purchases');
                if (refreshRes.ok) {
                    const refreshJson = await refreshRes.json();
                    if (refreshJson.success && refreshJson.data) {
                        setTransactions(refreshJson.data);
                    }
                }
            }
        } catch (e) {
            console.error(e);
            setReviewError('Failed to submit review');
        } finally {
            setReviewSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="h-32 animate-pulse rounded-lg bg-gray-300 dark:bg-gray-600"
                    ></div>
                ))}
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <p className="text-gray-500 dark:text-gray-400">No purchases yet. Start shopping!</p>
        );
    }

    return (
        <div className="space-y-4">
            {transactions.map((transaction) => (
                <div
                    key={transaction.transac_id}
                    className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-700"
                >
                    <div className="flex gap-4">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                            {transaction.image_url ? (
                                <Image
                                    src={transaction.image_url}
                                    alt={transaction.item_name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-600">
                                    <Package className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <Link
                                href={`/products/${transaction.listing_id}`}
                                className="text-lg font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                            >
                                {transaction.item_name}
                            </Link>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Condition: {transaction.item_condition}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Seller:{' '}
                                <Link
                                    href={`/users/${transaction.seller_username}`}
                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    {transaction.seller_name}
                                </Link>
                            </p>
                            <p className="mt-1 text-xl font-bold text-green-600 dark:text-green-400">
                                ₱{transaction.item_price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    transaction.transac_done
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}
                            >
                                {transaction.transac_done ? 'Completed' : 'Pending'}
                            </span>
                            {transaction.review_rating && (
                                <div className="mt-2 flex items-center gap-1 rounded-lg bg-yellow-50 px-3 py-1 dark:bg-yellow-900/30">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold dark:text-white">
                                        {transaction.review_rating}
                                    </span>
                                </div>
                            )}
                            {!transaction.review_rating && (
                                <button
                                    onClick={() => {
                                        setReviewModal({
                                            listingId: transaction.listing_id,
                                            itemName: transaction.item_name,
                                        });
                                        setReviewRating(5);
                                        setReviewText('');
                                        setReviewError('');
                                    }}
                                    className="mt-2 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                >
                                    Add Review
                                </button>
                            )}
                        </div>
                    </div>
                    {transaction.review_text && (
                        <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-600">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Your Review:
                            </p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {transaction.review_text}
                            </p>
                        </div>
                    )}
                </div>
            ))}

            {/* Review Modal */}
            {reviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-200">
                                    Review Product
                                </p>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {reviewModal.itemName}
                                </h3>
                            </div>
                            <button
                                onClick={() => setReviewModal(null)}
                                className="rounded-full border border-gray-200 p-2 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-500"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {reviewError && (
                                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200 dark:bg-red-900/20 dark:text-red-200 dark:ring-red-800/40">
                                    {reviewError}
                                </div>
                            )}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
                                    Rating
                                </label>
                                <select
                                    value={reviewRating}
                                    onChange={(e) => setReviewRating(Number(e.target.value))}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                >
                                    {[5, 4, 3, 2, 1].map((n) => (
                                        <option
                                            key={n}
                                            value={n}
                                        >
                                            {n} - {'⭐'.repeat(n)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
                                    Comment
                                </label>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="Share your experience with this product"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleReviewSubmit}
                                    disabled={reviewSubmitting}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-blue-700 dark:hover:bg-blue-600"
                                >
                                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                                <button
                                    onClick={() => setReviewModal(null)}
                                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchasesPage;
