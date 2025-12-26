'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, Package, X } from 'lucide-react';
import { OfferWithDetails } from '@/app/data/types';

const ReceivedOffersPage: React.FC = () => {
    const [offers, setOffers] = useState<OfferWithDetails[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOffers = async (): Promise<void> => {
        try {
            const res = await fetch('/api/transactions/received-offers');
            if (!res.ok) throw new Error('Failed to fetch offers');
            const json = await res.json();
            if (json.success && json.data) {
                setOffers(json.data);
            }
        } catch (error) {
            console.error('Error fetching received offers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOfferAction = async (
        offerId: number,
        action: 'accept' | 'reject',
        listingId: number
    ): Promise<void> => {
        try {
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
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

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

    if (offers.length === 0) {
        return (
            <p className="text-gray-500 dark:text-gray-400">
                No offers received yet. Your listings will appear here when buyers make offers!
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {offers.map((offer) => (
                <div
                    key={offer.offer_id}
                    className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-700"
                >
                    <div className="flex gap-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                            {offer.image_url ? (
                                <Image
                                    src={offer.image_url}
                                    alt={offer.item_name}
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
                                href={`/products/${offer.listing_id}`}
                                className="font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                            >
                                {offer.item_name}
                            </Link>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Buyer:{' '}
                                <Link
                                    href={`/users/${offer.buyer_username}`}
                                    className="text-blue-600 hover:underline dark:text-blue-400"
                                >
                                    {offer.buyer_name}
                                </Link>
                            </p>
                            <div className="mt-2 flex items-center gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        Your Price
                                    </p>
                                    <p className="font-semibold text-gray-700 dark:text-gray-300">
                                        ₱{offer.item_price.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        Offered Price
                                    </p>
                                    <p className="font-bold text-blue-600 dark:text-blue-400">
                                        ₱{offer.offer_price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                                {new Date(offer.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    offer.offer_status === 'Accepted'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : offer.offer_status === 'Rejected'
                                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}
                            >
                                {offer.offer_status}
                            </span>
                            {offer.offer_status === 'Pending' && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            handleOfferAction(
                                                offer.offer_id,
                                                'accept',
                                                offer.listing_id
                                            )
                                        }
                                        className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-700"
                                    >
                                        <Check className="h-4 w-4" />
                                        Accept
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleOfferAction(
                                                offer.offer_id,
                                                'reject',
                                                offer.listing_id
                                            )
                                        }
                                        className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700"
                                    >
                                        <X className="h-4 w-4" />
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReceivedOffersPage;
