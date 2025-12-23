'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { OfferWithDetails } from '@/app/lib/queries/transactions';

const ReceivedOffersPage: React.FC = () => {
    const [offers, setOffers] = useState<OfferWithDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async (): Promise<void> => {
            try {
                const res = await fetch('/api/transactions');
                if (!res.ok) throw new Error('Failed to fetch transactions');
                const json = await res.json();
                if (json.success && json.data) {
                    setOffers(json.data.receivedOffers);
                }
            } catch (error) {
                console.error('Error fetching received offers:', error);
            } finally {
                setLoading(false);
            }
        };

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
                        <div>
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
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReceivedOffersPage;
