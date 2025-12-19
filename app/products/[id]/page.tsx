'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import Products from '@/app/components/Products';
import { Product as ProductType, Seller, UserSession } from '@/app/data/types';
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
    Edit,
    Trash2,
} from 'lucide-react';
import { deleteProductAction } from './actions';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();

    const [product, setProduct] = useState<ProductType | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [seller, setSeller] = useState<Seller | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<ProductType[]>([]);
    const [user, setUser] = useState<UserSession | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async (): Promise<void> => {
            try {
                // Fetch user session
                const userRes = await fetch('/api/session');
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData.user || null);
                }

                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error('Failed to fetch product');
                const json = await res.json();
                const data = json.data;

                const product = data.product;
                const images = data.images;
                const seller = data.review;

                setProduct(product);
                setImages(images);
                setSeller(seller);

                const recRes = await fetch(`/api/products?exclude=${id}&limit=4`);
                if (!recRes.ok) throw new Error('Failed to fetch recommendations');
                const recData = await recRes.json();

                setRecommendations(recData.data.products);
            } catch (error) {
                console.error(error);
                setProduct(null);
                setRecommendations([]);
                setSeller(null);
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

    const handleDelete = async (): Promise<void> => {
        if (!product) return;
        setIsDeleting(true);
        try {
            const result = await deleteProductAction(product.listing_id);
            if (result.success) {
                router.push('/products');
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete product');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
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
                        <div className="relative aspect-square h-100 w-full overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
                            {images.length > 0 && (
                                <>
                                    {/* Carousel wrapper with all images */}
                                    {images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                                                idx === currentImageIndex
                                                    ? 'translate-x-0 opacity-100'
                                                    : idx < currentImageIndex
                                                      ? '-translate-x-full opacity-0'
                                                      : 'translate-x-full opacity-0'
                                            }`}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.item_name} ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                                priority={idx === 0}
                                            />
                                        </div>
                                    ))}

                                    {images.length > 1 && (
                                        <>
                                            {/* Slider indicators (dots) */}
                                            <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3 rounded-full bg-black/20 px-4 py-2 backdrop-blur-sm">
                                                {images.map((_, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        className={`h-3 w-3 rounded-full shadow-lg transition-all duration-300 ${
                                                            idx === currentImageIndex
                                                                ? 'w-8 scale-110 bg-white shadow-white/50'
                                                                : 'bg-white/60 hover:scale-110 hover:bg-white/90'
                                                        }`}
                                                        aria-current={idx === currentImageIndex}
                                                        aria-label={`Slide ${idx + 1}`}
                                                        onClick={() => setCurrentImageIndex(idx)}
                                                    />
                                                ))}
                                            </div>

                                            {/* Slider controls */}
                                            <button
                                                type="button"
                                                className="group absolute top-0 left-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 opacity-0 transition-opacity duration-300 hover:opacity-100 focus:outline-none"
                                                onClick={prevImage}
                                            >
                                                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60 shadow-xl backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:bg-black/80 group-focus:ring-4 group-focus:ring-white/50 group-focus:outline-none">
                                                    <ChevronLeft className="h-6 w-6 text-white drop-shadow-lg" />
                                                    <span className="sr-only">Previous</span>
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                className="group absolute top-0 right-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 opacity-0 transition-opacity duration-300 hover:opacity-100 focus:outline-none"
                                                onClick={nextImage}
                                            >
                                                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60 shadow-xl backdrop-blur-sm transition-all duration-200 group-hover:scale-110 group-hover:bg-black/80 group-focus:ring-4 group-focus:ring-white/50 group-focus:outline-none">
                                                    <ChevronRight className="h-6 w-6 text-white drop-shadow-lg" />
                                                    <span className="sr-only">Next</span>
                                                </span>
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
                        <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
                            {product.item_name}
                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${product.is_avail ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}
                            >
                                {product.is_avail ? 'Available' : 'Sold'}
                            </span>
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
                            {user && user.user_id === product.seller_id ? (
                                <>
                                    <Link
                                        href={`/products/${id}/edit`}
                                        className="bg-primary flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-white hover:bg-blue-700 dark:bg-blue-600"
                                    >
                                        <Edit className="h-5 w-5" />
                                        Edit Listing
                                    </Link>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="rounded-lg border border-red-300 bg-red-50 p-3 hover:bg-red-100 dark:border-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                                    >
                                        <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                                    </button>
                                    <button className="rounded-lg border border-gray-300 p-3 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                                        <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="bg-primary flex-1 rounded-lg px-6 py-3 font-semibold text-white hover:bg-blue-700 dark:bg-blue-600">
                                        Contact Seller
                                    </button>
                                    <button className="rounded-lg border border-gray-300 p-3 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800">
                                        <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                </>
                            )}
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
                {product && (
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
                                            {seller?.avg_rating
                                                ? Number(Number(seller.avg_rating).toFixed(2))
                                                : ''}{' '}
                                            ({seller?.review_count} review/s)
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-2 grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center">
                                        <Package className="mr-2 h-4 w-4" />
                                        {seller?.product_count} product/s
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
                {/* <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                        Seller Reviews
                    </h3>
                    <div className="space-y-4">
                        {product.map((review) => (
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
                        ))}
                    </div>
                </div> */}

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
                                    showStatus={false}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Delete Product
                            </h3>
                        </div>
                        <p className="mb-6 text-gray-600 dark:text-gray-400">
                            Are you sure you want to delete &quot;{product?.item_name}&quot;? This
                            action cannot be undone and will permanently remove the listing and all
                            its images.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ProductDetailPage;
