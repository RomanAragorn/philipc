'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Package, User } from 'lucide-react';

interface SellerInfoSectionProps {
    sellerName: string;
    sellerUsername: string;
    sellerAvatar?: string | null;
    sellerLocation: string;
    avgRating: number;
    reviewCount: number;
    productCount: number;
}

const SellerInfoSection: React.FC<SellerInfoSectionProps> = ({
    sellerName,
    sellerUsername,
    sellerAvatar,
    sellerLocation,
    avgRating,
    reviewCount,
    productCount,
}) => {
    return (
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                Seller Information
            </h3>
            <div className="flex items-start space-x-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                    {sellerAvatar ? (
                        <Image
                            src={sellerAvatar}
                            alt={sellerName}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <User className="h-full w-full p-4 text-gray-400" />
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {sellerName}
                        </h4>
                        <div className="flex items-center">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                                {Number(Number(avgRating).toFixed(2))} ({reviewCount} review/s)
                            </span>
                        </div>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                            <Package className="mr-2 h-4 w-4" />
                            {productCount} product/s
                        </div>
                        <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4" />
                            {sellerLocation}
                        </div>
                    </div>
                </div>
                <Link
                    className="bg-primary rounded-lg px-4 py-2 font-medium text-white hover:bg-blue-700 dark:bg-blue-600"
                    href={`/users/${sellerUsername}`}
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
};

export default SellerInfoSection;
