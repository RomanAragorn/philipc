'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import Products from '@/app/components/Products';
import { Product as ProductType } from '@/app/data/types';
import {
    ChevronLeft,
    ChevronRight,
    Star,
    MapPin,
    Shield,
    Share2,
    ArrowLeft,
    Package,
    User,
} from 'lucide-react';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();

    const [product, setProduct] = useState<ProductType | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<ProductType[]>([]);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async (): Promise<void> => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error('Failed to fetch product');
                const json = await res.json();
                const product = json.data.product[0];
                const images = json.data.images;

                setProduct(product);
                setImages(images);

                const recRes = await fetch(`/api/products?exclude=${id}&limit=4`);
                if (!recRes.ok) throw new Error('Failed to fetch recommendations');
                const recData = await recRes.json();

                setRecommendations(recData.data.products);
            } catch (error) {
                console.error(error);
                setProduct(null);
                setRecommendations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading)
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navigation />
                <div className="flex items-center justify-center py-20">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 w-48 rounded bg-gray-300 dark:bg-gray-700"></div>
                        <div className="h-4 w-32 rounded bg-gray-300 dark:bg-gray-700"></div>
                    </div>
                </div>
            </div>
        );

    if (!product)
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navigation />
                <div className="flex flex-col items-center justify-center py-20">
                    <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                        Product Not Found
                    </h1>
                    <button
                        onClick={() => router.push('/products')}
                        className="text-primary hover:text-blue-700"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );

    const nextImage = (): void => {
        if (!images.length) return;
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (): void => {
        if (!images.length) return;
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="mb-6 flex items-center space-x-2 text-sm">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </button>
                    <span className="text-gray-400">/</span>
                    <Link
                        href="/products"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                        Products
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-900 dark:text-white">{product.item_name}</span>
                </div>

                <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Image Carousel */}
                    <div className="space-y-4">
                        <div className="relative aspect-square h-100 w-full overflow-hidden rounded-lg bg-white shadow-sm">
                            {images.length > 0 && (
                                <>
                                    <Image
                                        src={images[currentImageIndex]}
                                        alt={product.item_name}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                                            >
                                                <ChevronLeft className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="mx-auto flex w-fit space-x-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`relative h-20 w-20 rounded-lg ${currentImageIndex === idx ? 'ring-1 ring-blue-500' : ''}`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.item_name} ${idx + 1}`}
                                            fill
                                            className="rounded-xl object-cover p-1"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {product.item_name}
                        </h1>
                        <p className="text-primary mt-2 text-4xl font-bold">
                            ₱{product.item_price}
                        </p>

                        <div className="mt-2 flex items-center space-x-4">
                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${product.item_condition === 'Brand New' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                            >
                                {product.item_condition}
                            </span>
                            <span className="flex items-center text-gray-600 dark:text-gray-400">
                                <MapPin className="mr-1 h-4 w-4" /> {product.item_location}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-4">
                            <button className="bg-primary flex-1 rounded-lg px-6 py-3 font-semibold text-white hover:bg-blue-700 dark:bg-blue-600">
                                Contact Seller
                            </button>
                            <button className="rounded-lg border border-gray-300 p-3 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                                <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Description */}
                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                                Description
                            </h3>
                            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                                {product.item_description}
                            </p>
                        </div>

                        {/* Safety Tips */}
                        <div className="flex items-start space-x-2 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                            <Shield className="text-primary mt-0.5 h-5 w-5" />
                            <div>
                                <h4 className="font-medium text-blue-900 dark:text-blue-300">
                                    Safety Tips
                                </h4>
                                <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                                    Pass agad pag holdaper.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seller Info */}
                {product.full_name && (
                    <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                            Seller Information
                        </h3>
                        <div className="flex items-start space-x-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                                {product.image_url ? (
                                    <Image
                                        src={product.seller_avatar || ''}
                                        alt={`${product.full_name}`}
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
                                        {product.full_name}
                                    </h4>
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                                            {/* {product.seller.rating} ({product.seller.total_sales}{' '}
                                            reviews) */}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center">
                                        <Package className="mr-2 h-4 w-4" />
                                        {/* {product.seller.total_sales} sales */}
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        {product.item_location}
                                    </div>
                                </div>
                                <p className="mt-2 text-gray-700 dark:text-gray-300">
                                    {/* {product.seller.bio} */}
                                </p>
                            </div>
                            <Link
                                className="bg-primary rounded-lg px-4 py-2 font-medium text-white hover:bg-blue-700 dark:bg-blue-600"
                                href={`/users/${product.username}`}
                            >
                                View Profile
                            </Link>
                        </div>
                    </div>
                )}

                {/* Reviews */}
                <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                        Seller Reviews
                    </h3>
                    <div className="space-y-4">
                        {/* {product.map((review) => (
                            <div
                                key={review.id}
                                className="border-b border-gray-200 pb-4 last:border-b-0 dark:border-gray-700"
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {review.name}
                                        </span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < review.rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                            </div>
                        ))} */}
                    </div>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <div className="mb-8">
                        <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                            You might also like
                        </h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {recommendations.map((r) => (
                                <Products
                                    key={r.listing_id}
                                    product={r}
                                    showUser
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetailPage;
