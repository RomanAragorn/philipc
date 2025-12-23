'use client';

import React, { useState } from 'react';
import { Offer } from '@/app/data/types';
import { Clock, Check, X, User, PhilippinePeso } from 'lucide-react';

interface SellerOffersProps {
    listingId: number;
    productPrice: number;
}

export default function SellerOffers({
    listingId,
    productPrice,
}: SellerOffersProps): React.JSX.Element {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingOfferId, setProcessingOfferId] = useState<number | null>(null);

    const fetchOffers = React.useCallback(async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await fetch(`/api/products/${listingId}/offers`);
            const data = await response.json();

            if (data.success && data.data) {
                setOffers(data.data.offers);
            } else {
                setError(data.message || 'Failed to fetch offers');
            }
        } catch (err) {
            console.error('Error fetching offers:', err);
            setError('Failed to load offers');
        } finally {
            setLoading(false);
        }
    }, [listingId]);

    React.useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    const handleOfferAction = async (
        offerId: number,
        action: 'accept' | 'reject'
    ): Promise<void> => {
        try {
            setProcessingOfferId(offerId);
            const response = await fetch(`/api/products/${listingId}/offers`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    offer_id: offerId,
                    status: action === 'accept' ? 'Accepted' : 'Rejected',
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Refresh the offers list
                await fetchOffers();
            } else {
                alert(data.message || `Failed to ${action} offer`);
            }
        } catch (err) {
            console.error(`Error ${action}ing offer:`, err);
            alert(`Failed to ${action} offer`);
        } finally {
            setProcessingOfferId(null);
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getStatusBadge = (status: string): React.JSX.Element => {
        switch (status) {
            case 'Accepted':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <Check className="h-3 w-3" />
                        Accepted
                    </span>
                );
            case 'Rejected':
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        <X className="h-3 w-3" />
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <Clock className="h-3 w-3" />
                        Pending
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                    Offers on Your Product
                </h3>
                <div className="flex items-center justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                    Offers on Your Product
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Offers on Your Product
                </h3>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {offers.length} {offers.length === 1 ? 'Offer' : 'Offers'}
                </span>
            </div>

            {offers.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
                    <PhilippinePeso className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                        No offers yet. Buyers will be able to make offers on your product.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {offers.map((offer) => (
                        <div
                            key={offer.offer_id}
                            className="rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="mb-2 flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                            <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {offer.buyer_name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatDate(offer.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-2 flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            ₱{offer.offer_price.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            (List: ₱{productPrice.toLocaleString()})
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {getStatusBadge(offer.offer_status)}
                                    </div>
                                </div>

                                {offer.offer_status === 'Pending' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                handleOfferAction(offer.offer_id, 'accept')
                                            }
                                            disabled={processingOfferId === offer.offer_id}
                                            className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-700"
                                        >
                                            <Check className="h-4 w-4" />
                                            Accept
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleOfferAction(offer.offer_id, 'reject')
                                            }
                                            disabled={processingOfferId === offer.offer_id}
                                            className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700"
                                        >
                                            <X className="h-4 w-4" />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {offers.length > 0 && (
                <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                    <p className="text-xs text-blue-800 dark:text-blue-300">
                        <strong>Note:</strong> Accepting an offer will mark the product as sold and
                        automatically reject all other pending offers.
                    </p>
                </div>
            )}
        </div>
    );
}
