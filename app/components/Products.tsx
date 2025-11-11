import React from 'react';
import { User } from 'lucide-react';
import Image from 'next/image';
import Button from '@/app/components/Button';
import { Product } from '@/app/data/types';

interface ProductProps {
    product: Product;
    // onClick: (product: Product) => void;
}

const Products: React.FC<ProductProps> = ({ product }) => {
    return (
        <div className="flex min-h-50 flex-col rounded-2xl bg-gray-50 p-4 shadow-lg dark:bg-gray-900">
            {/* User */}
            <div className="mb-3 flex items-center gap-2">
                <div className="rounded-4xl bg-blue-50 p-2">
                    <User className="h-8 w-8 text-black" />
                </div>
                <span className="text-black dark:text-white">
                    {product.fname} {product.lname}
                </span>
            </div>

            {/* Image */}
            <div className="relative h-50 w-full">
                <Image
                    src={
                        'https://down-ph.img.susercontent.com/file/ph-11134207-7r98v-lvk7ew0vuxfp28_tn.webp'
                    }
                    alt="Test Image"
                    fill
                />
            </div>

            {/* Product Details */}
            <div className="my-3 flex grow flex-col gap-1 text-black dark:text-white">
                <span className="text-lg font-semibold">{product.item_name}</span>
                <span>${product.item_price}</span>
            </div>

            {/* Button */}
            <div className="flex justify-center">
                <Button label="View Product" />
            </div>
        </div>
    );
};

export default Products;
