import React from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';
import Button from '@/app/components/Button';
import { Product } from '@/app/data/types';
import Link from 'next/link';

interface ProductProps {
    product: Product;
    showUser?: boolean;
}

const Products: React.FC<ProductProps> = ({ product, showUser = true }) => {
    return (
        <div className="flex min-h-50 flex-col rounded-2xl bg-gray-50 p-4 shadow-lg dark:bg-gray-800">
            {/* User */}
            {showUser && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-4xl bg-blue-50 p-2">
                        <User className="h-8 w-8 text-black" />
                    </div>
                    <span className="text-black dark:text-white">{product.full_name}</span>
                </div>
            )}

            {/* Image */}
            <div className="relative h-50 w-full">
                <Image
                    src={`${
                        product.images
                            ? product.images
                            : 'https://down-ph.img.susercontent.com/file/ph-11134207-7r98v-lvk7ew0vuxfp28_tn.webp'
                    }`}
                    alt="Test Image"
                    fill
                />
            </div>

            {/* Product Details */}
            <div className="my-3 flex grow flex-col justify-between gap-1 text-black dark:text-white">
                <span className="text-lg font-semibold">{product.item_name}</span>
                <span>₱{product.item_price}</span>
            </div>

            {/* Button */}
            <div className="flex justify-center">
                <Link
                    href={`/products/${product.listing_id}`}
                    className="w-full"
                >
                    <Button label="View Product" />
                </Link>
            </div>
        </div>
    );
};

export default Products;
