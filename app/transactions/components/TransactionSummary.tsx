'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Package, Send, Inbox } from 'lucide-react';

const TransactionSummary: React.FC = () => {
    const [summary, setSummary] = useState({
        purchases: 0,
        sales: 0,
        sentOffers: 0,
        receivedOffers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async (): Promise<void> => {
            try {
                const [purchasesRes, salesRes, sentOffersRes, receivedOffersRes] =
                    await Promise.all([
                        fetch('/api/transactions/purchases'),
                        fetch('/api/transactions/sales'),
                        fetch('/api/transactions/sent-offers'),
                        fetch('/api/transactions/received-offers'),
                    ]);

                if (
                    !purchasesRes.ok ||
                    !salesRes.ok ||
                    !sentOffersRes.ok ||
                    !receivedOffersRes.ok
                ) {
                    throw new Error('Failed to fetch transactions');
                }

                const [purchasesJson, salesJson, sentOffersJson, receivedOffersJson] =
                    await Promise.all([
                        purchasesRes.json(),
                        salesRes.json(),
                        sentOffersRes.json(),
                        receivedOffersRes.json(),
                    ]);

                setSummary({
                    purchases: purchasesJson.data?.length || 0,
                    sales: salesJson.data?.length || 0,
                    sentOffers: sentOffersJson.data?.length || 0,
                    receivedOffers: receivedOffersJson.data?.length || 0,
                });
            } catch (error) {
                console.error('Error fetching summary:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return (
            <div className="mb-8 grid gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-24 animate-pulse rounded-lg bg-gray-300 dark:bg-gray-600"
                    ></div>
                ))}
            </div>
        );
    }

    return (
        <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-700">
                <div className="flex items-center gap-3">
                    <ShoppingBag className="h-8 w-8 text-blue-500" />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Purchases</p>
                        <p className="text-2xl font-bold dark:text-white">{summary.purchases}</p>
                    </div>
                </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-700">
                <div className="flex items-center gap-3">
                    <Package className="h-8 w-8 text-blue-500" />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sales</p>
                        <p className="text-2xl font-bold dark:text-white">{summary.sales}</p>
                    </div>
                </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-700">
                <div className="flex items-center gap-3">
                    <Send className="h-8 w-8 text-blue-500" />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Offers Sent</p>
                        <p className="text-2xl font-bold dark:text-white">{summary.sentOffers}</p>
                    </div>
                </div>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-700">
                <div className="flex items-center gap-3">
                    <Inbox className="h-8 w-8 text-blue-500" />
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Offers Received</p>
                        <p className="text-2xl font-bold dark:text-white">
                            {summary.receivedOffers}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionSummary;
