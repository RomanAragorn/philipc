'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import Products from '@/app/components/products/Products';
import SellerOffers from '@/app/components/products/SellerOffers';
import ProductImageCarousel from '@/app/components/products/ProductImageCarousel';
import ProductInfoSection from '@/app/components/products/ProductInfoSection';
import SellerInfoSection from '@/app/components/products/SellerInfoSection';
import ProductReviews from '@/app/components/products/ProductReviews';
import { Product as ProductType, Seller, UserSession, Review, Transaction } from '@/app/data/types';
import { ArrowLeft } from 'lucide-react';
import { deleteProductAction } from './actions';

const ProductDetailPage: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();

    const [product, setProduct] = useState<ProductType | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [seller, setSeller] = useState<Seller | null>(null);
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<ProductType[]>([]);
    const [user, setUser] = useState<UserSession | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [offerPrice, setOfferPrice] = useState('');
    const [offerError, setOfferError] = useState('');
    const [reviews, setReviews] = useState<Review[]>([]);
    const [canReview, setCanReview] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async (): Promise<void> => {
            try {
                // Fetch user session
                let currentUser: UserSession | null = null;
                const userRes = await fetch('/api/session');
                if (userRes.ok) {
                    const userData = await userRes.json();
                    currentUser = userData.user || null;
                    setUser(currentUser);
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

                const reviewsRes = await fetch(`/api/products/${id}/reviews`);
                if (reviewsRes.ok) {
                    const reviewsJson = await reviewsRes.json();
                    setReviews(reviewsJson.data || []);
                }

                if (currentUser) {
                    const purchasesRes = await fetch('/api/transactions/purchases');
                    if (purchasesRes.ok) {
                        const purchasesJson = await purchasesRes.json();
                        const userPurchases: Transaction[] = purchasesJson.data || [];
                        const matching = userPurchases.find((t) => t.listing_id === Number(id));
                        setCanReview(!!(matching && !matching.review_id));
                    }
                }
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

    const handleDelete = async (): Promise<void> => {
        if (!product) return;
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
            setShowDeleteModal(false);
        }
    };

    const handleOfferSubmit = async (offerPrice: number): Promise<void> => {
        if (!product) {
            setOfferError('Product not found');
            return;
        }

        const numericPrice = Number(offerPrice);
        if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
            setOfferError('Enter a valid offer amount.');
            return;
        }

        try {
            const res = await fetch(`/api/products/${product.listing_id}/offers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ offer_price: numericPrice }),
            });

            const json = await res.json();
            if (!res.ok || !json.success) {
                setOfferError(json.message || 'Failed to submit offer');
            } else {
                setOfferError('');
                setOfferPrice('');
                setIsOfferModalOpen(false);
            }
        } catch (error) {
            console.error('Offer submission error:', error);
            setOfferError('Failed to submit offer');
        }
    };

    const handleOfferSubmitClick = async (): Promise<void> => {
        const numericPrice = Number(offerPrice);
        await handleOfferSubmit(numericPrice);
    };

    const handleReviewSubmitted = async (): Promise<void> => {
        if (!product) return;
        setCanReview(false);
        // Refresh reviews
        const reviewsRes = await fetch(`/api/products/${product.listing_id}/reviews`);
        if (reviewsRes.ok) {
            const reviewsJson = await reviewsRes.json();
            setReviews(reviewsJson.data || []);
        }
    };

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
                    <ProductImageCarousel
                        images={images}
                        productName={product.item_name}
                    />

                    {/* Product Info */}
                    <ProductInfoSection
                        product={product}
                        user={user}
                        isAvail={product.is_avail}
                        isOfferModalOpen={isOfferModalOpen}
                        onOfferClick={() => setIsOfferModalOpen(true)}
                        onDeleteClick={() => setShowDeleteModal(true)}
                        offerStatus="idle"
                    />
                </div>

                {/* Seller Info */}
                {seller && product && (
                    <div className="mb-8">
                        <SellerInfoSection
                            sellerName={product.full_name}
                            sellerUsername={product.username}
                            sellerAvatar={product.seller_avatar || undefined}
                            sellerLocation={product.item_location}
                            avgRating={seller.avg_rating}
                            reviewCount={seller.review_count}
                            productCount={seller.product_count}
                        />
                    </div>
                )}

                {/* Seller Offers Section - Only visible to the seller */}
                {user && product && user.user_id === product.seller_id && (
                    <div className="mb-8">
                        <SellerOffers
                            listingId={product.listing_id}
                            productPrice={product.item_price}
                        />
                    </div>
                )}

                {/* Reviews */}
                <div className="mb-8">
                    <ProductReviews
                        listingId={String(product.listing_id)}
                        reviews={reviews}
                        canReview={canReview}
                        user={user}
                        onReviewSubmitted={handleReviewSubmitted}
                    />
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
                                    showStatus={false}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Offer Modal */}
            {isOfferModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-gray-100 dark:bg-gray-900 dark:ring-gray-700">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsOfferModalOpen(false)}
                                className="rounded-full border border-gray-200 p-2 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-500"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </button>
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-200">
                                    Make an offer
                                </p>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {product?.item_name}
                                </h3>
                            </div>
                        </div>

                        <div className="mt-4 space-y-4">
                            {offerError && (
                                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200 dark:bg-red-900/20 dark:text-red-200 dark:ring-red-800/40">
                                    {offerError}
                                </div>
                            )}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
                                    Your offer (₱)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={offerPrice}
                                    onChange={(e) => setOfferPrice(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                    placeholder="e.g., 1000"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-800">
                                    Meet in a safe place
                                </span>
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 dark:bg-gray-800">
                                    Respect seller response time
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleOfferSubmitClick}
                                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:cursor-pointer hover:bg-blue-700"
                                >
                                    Send Offer
                                </button>
                                <button
                                    onClick={() => setIsOfferModalOpen(false)}
                                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                                <ArrowLeft className="h-6 w-6 text-red-600 dark:text-red-400" />
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
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                            >
                                Delete
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
