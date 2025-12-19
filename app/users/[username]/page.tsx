'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Navigation from '@/app/components/Navigation';
import Products from '@/app/components/Products';
import { useParams } from 'next/navigation';
import { Product, Review, RatingSummary, User as UserType } from '@/app/data/types';
import { Star, User } from 'lucide-react';

const UserPage: React.FC = () => {
    const { username } = useParams();
    const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');

    const [user, setUser] = useState<UserType | null>(null);
    const [rating, setRating] = useState<RatingSummary | null>(null);
    const [listings, setListings] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async (): Promise<void> => {
            try {
                const res = await fetch(`/api/users/${username}`);
                if (!res.ok) throw new Error('User not found');
                const json = await res.json();
                const data = json.data;
                const { user, rating, listings, reviews } = data;
                setUser(user);
                setRating(rating);
                setListings(listings);
                setReviews(reviews);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen dark:bg-gray-800">
                <Navigation />
                <div className="mx-auto max-w-7xl p-6">
                    {/* User Info Skeleton */}
                    <div className="mb-6 animate-pulse rounded-2xl bg-linear-to-r from-gray-300 to-gray-400 px-8 py-5 shadow-xl dark:from-gray-700 dark:to-gray-600">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-5">
                                <div className="h-28 w-28 rounded-full bg-gray-400 dark:bg-gray-500"></div>
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <div className="h-8 w-48 rounded bg-gray-400 dark:bg-gray-500"></div>
                                        <div className="mt-2 h-4 w-32 rounded bg-gray-400 dark:bg-gray-500"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded bg-gray-400 dark:bg-gray-500"></div>
                                <div className="flex flex-col gap-1">
                                    <div className="h-6 w-12 rounded bg-gray-400 dark:bg-gray-500"></div>
                                    <div className="h-3 w-20 rounded bg-gray-400 dark:bg-gray-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Skeleton */}
                    <div className="mb-4 flex gap-4 border-b border-gray-300 dark:border-gray-500">
                        <div className="h-10 w-24 rounded-t bg-gray-300 dark:bg-gray-600"></div>
                        <div className="h-10 w-24 rounded-t bg-gray-300 dark:bg-gray-600"></div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse rounded-lg bg-white p-4 shadow dark:bg-gray-700"
                            >
                                <div className="mb-3 h-48 rounded bg-gray-300 dark:bg-gray-600"></div>
                                <div className="mb-2 h-4 w-3/4 rounded bg-gray-300 dark:bg-gray-600"></div>
                                <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-600"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen dark:bg-gray-800">
                <Navigation />
                <div className="flex flex-col items-center justify-center py-20">
                    <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        User Not Found
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        The user you&apos;re looking for doesn&apos;t exist.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen dark:bg-gray-800">
            <Navigation />
            <div className="mx-auto max-w-7xl p-6">
                {/* User Info */}
                <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl bg-linear-to-r from-[#003d4d]/85 to-[#0081b3]/85 px-8 py-5 shadow-xl dark:from-gray-900 dark:to-gray-900">
                    <div className="flex items-center gap-5">
                        <div className="relative h-28 w-28">
                            {user.image ? (
                                <Image
                                    src={user.image || ''}
                                    alt={`${user.first_name}`}
                                    fill
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <User className="h-full w-full p-4 text-gray-400" />
                            )}
                        </div>

                        <div className="flex flex-col gap-3 text-white">
                            <div className="">
                                <h1 className="text-2xl font-bold">
                                    {user.first_name} {user.last_name}
                                </h1>
                                <p className="text-gray-400">@{user.username}</p>
                            </div>
                            {/* <p className="mt-1 text-white">
                                <strong>Location:</strong> {user.location}
                            </p> */}
                        </div>
                    </div>
                    <div className="flex items-center justify-start gap-2">
                        <Star className="h-8 w-8 text-amber-300" />
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold text-amber-300">
                                {rating?.avg_rating
                                    ? Number(Number(rating.avg_rating).toFixed(2))
                                    : ''}
                            </span>
                            <span className="hidden text-xs text-white sm:block">
                                {rating?.count} review/s
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
                        {listings.length === 0 ? (
                            <p className="text-gray-500">No listings yet.</p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {listings.map((product, index) => (
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
                    <div className="space-y-5">
                        {reviews.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
                        ) : (
                            reviews.map((review, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-gray-300 bg-white p-5 shadow-md dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-14 w-14 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                            {review.image ? (
                                                <Image
                                                    src={review.image}
                                                    alt="buyer"
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <User className="h-full w-full p-3 text-gray-400" />
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-lg font-semibold dark:text-white">
                                                {review.buyer_first_name} {review.buyer_last_name}
                                            </p>
                                            <p className="text-sm text-yellow-400">
                                                {'⭐'.repeat(review.review_rating)}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-gray-700 dark:text-gray-300">
                                        {review.review_text}
                                    </p>

                                    <div className="mt-3 border-l-4 border-blue-500 pl-2 dark:border-blue-400">
                                        <p className="font-semibold dark:text-white">
                                            {review.item_name}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            ₱{review.item_price}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPage;
