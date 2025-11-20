'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Navigation from '@/app/components/Navigation';
import userMock from '@/app/data/userMock.json';
import Products from '@/app/components/Products';
import { useParams } from 'next/navigation';
import { Product } from '@/app/data/types';
import { Star } from 'lucide-react';

const UserPage: React.FC = () => {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');

    // FOR BACKEND
    // const [user, setUser] = useState<any | null>(null);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     async function fetchUser() {
    //         try {
    //             const res = await fetch(`/api/users/${username}`);
    //             if (!res.ok) throw new Error('User not found');
    //             const data = await res.json();
    //             setUser(data);
    //         } catch (err) {
    //             setUser(null);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }

    //     fetchUser();
    // }, [username]);

    // if (loading) return <p>Loading...</p>;
    // if (!user) return <p>User not found</p>;

    // Mocked
    const user = userMock.find((u) => u.username === username);
    if (!user) {
        return <h1 className="p-6 text-xl font-semibold">User not found</h1>;
    }
    // Map user listings to ProductType
    const userProducts: Product[] = user.listings.map((item) => ({
        listing_id: item.listing_id,
        fname: user.first_name,
        lname: user.last_name,
        item_name: item.item_name,
        item_price: item.item_price,
        item_location: item.item_location,
        condition: item.condition,
        description: item.description,
        still_avail: item.still_avail,
    }));

    return (
        <div className="min-h-screen dark:bg-gray-800">
            <Navigation />
            <div className="mx-auto max-w-7xl p-6">
                {/* User Info */}
                <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl bg-linear-to-r from-[#003d4d]/85 to-[#0081b3]/85 px-8 py-5 shadow-xl dark:from-gray-900 dark:to-gray-900">
                    <div className="flex items-center gap-5">
                        <div className="relative h-28 w-28">
                            <Image
                                src={user.avatar}
                                alt={user.name}
                                fill
                                className="rounded-full object-cover"
                            />
                        </div>

                        <div className="flex flex-col gap-3 text-white">
                            <div className="">
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                <p className="text-gray-400">@{user.username}</p>
                            </div>
                            <p className="mt-1 text-white">
                                <strong>Location:</strong> {user.location}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-start gap-2">
                        <Star className="h-8 w-8 text-amber-300" />
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold text-amber-300">
                                {user.rating}
                            </span>
                            <span className="hidden text-xs text-white sm:block">
                                {user.reviews.length} review/s
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-4 flex border-b border-gray-300 dark:border-gray-500">
                    <button
                        onClick={() => setActiveTab('listings')}
                        className={`px-4 py-2 font-semibold hover:cursor-pointer ${
                            activeTab === 'listings'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600 dark:text-gray-400'
                        }`}
                    >
                        Listings
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-4 py-2 font-semibold hover:cursor-pointer ${
                            activeTab === 'reviews'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-600 dark:text-gray-400'
                        }`}
                    >
                        Reviews
                    </button>
                </div>

                {/* Listings */}
                {activeTab === 'listings' && (
                    <>
                        {userProducts.length === 0 ? (
                            <p className="text-gray-500">No listings yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {userProducts.map((product, index) => (
                                    <Products
                                        key={index}
                                        product={product}
                                        showUser={false}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Reviews */}
                {activeTab === 'reviews' && (
                    <>
                        {user.reviews.length === 0 ? (
                            <p className="text-gray-500">No reviews yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {user.reviews.map((review) => (
                                    <div
                                        key={review.id}
                                        className="rounded-lg border border-gray-300 p-4 shadow-sm dark:border-gray-600"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold dark:text-white">
                                                {review.reviewer}
                                            </p>
                                            <p className="text-yellow-500">
                                                {'⭐'.repeat(review.rating)}
                                            </p>
                                        </div>
                                        <p className="mt-2 text-gray-800 dark:text-gray-300">
                                            {review.comment}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">{review.date}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserPage;
