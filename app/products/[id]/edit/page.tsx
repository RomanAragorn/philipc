'use client';

import React, { useState, useCallback, useActionState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { conditionOptions, categoryOptions } from '@/app/data/searchFilters';
import Dropdown from '@/app/components/Dropdown';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { UserSession } from '@/app/data/types';
import { updateListing, UpdateListingState } from './actions';

const EditListingPage: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const [user, setUser] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [category, setCategory] = useState('');
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [condition, setCondition] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [state, formAction, isPending] = useActionState<UpdateListingState, FormData>(
        updateListing,
        undefined
    );

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                // Fetch user session
                const userRes = await fetch('/api/session');
                let currentUser = null;
                if (userRes.ok) {
                    const userData = await userRes.json();
                    currentUser = userData.user || null;
                    setUser(currentUser);
                }

                // Fetch product details
                const productRes = await fetch(`/api/products/${id}`);
                if (!productRes.ok) throw new Error('Failed to fetch product');
                const productData = await productRes.json();
                const product = productData.data.product;
                const images = productData.data.images;

                // Check if user owns this product
                if (currentUser && product.seller_id !== currentUser.user_id) {
                    router.push('/products');
                    return;
                }

                // Set form data
                setCategory(product.category);
                setItemName(product.item_name);
                setPrice(product.item_price.toString());
                setCondition(product.item_condition);
                setDescription(product.item_description);
                setLocation(product.item_location);
                setExistingImages(images || []);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                router.push('/products');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, router]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const totalImages = existingImages.length + newImages.length;
            if (totalImages >= 5) return;

            const allowedFiles = acceptedFiles
                .filter((file) => file.type.startsWith('image/'))
                .slice(0, 5 - totalImages);

            const urls = allowedFiles.map((file) => URL.createObjectURL(file));

            setNewImages((prev) => [...prev, ...allowedFiles]);
            setPreviewUrls((prev) => [...prev, ...urls]);
        },
        [existingImages.length, newImages.length]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: true,
    });

    const removeExistingImage = (index: number): void => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number): void => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    if (loading) {
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
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />

            <div className="mx-auto mt-4 flex max-w-7xl gap-2 p-4">
                <button
                    onClick={() => router.back()}
                    className="hover:cursor-pointer"
                >
                    <ArrowLeft />
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Listing</h1>
            </div>

            <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
                <form
                    action={(formData) => {
                        formData.append('listing_id', id as string);
                        existingImages.forEach((url) => {
                            formData.append('existing_images', url);
                        });
                        newImages.forEach((image) => {
                            formData.append('new_images', image);
                        });
                        formAction(formData);
                    }}
                >
                    {/* General Error */}
                    {state?.errors?.general && (
                        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                            {state.errors.general[0]}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left Column - Form Fields */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Item Name */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Item Name *
                                </label>
                                <input
                                    type="text"
                                    name="item_name"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="e.g., RTX 4090 Gaming Graphics Card"
                                />
                                {state?.errors?.item_name && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {state.errors.item_name[0]}
                                    </p>
                                )}
                            </div>

                            {/* Category & Condition */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Dropdown
                                        label="Category *"
                                        options={categoryOptions}
                                        selected={category}
                                        onChange={setCategory}
                                        placeholder="Select Category"
                                    />
                                    {state?.errors?.category && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {state.errors.category[0]}
                                        </p>
                                    )}
                                    <input
                                        type="hidden"
                                        name="category"
                                        value={category}
                                    />
                                </div>
                                <div>
                                    <Dropdown
                                        label="Condition *"
                                        options={conditionOptions}
                                        selected={condition}
                                        onChange={setCondition}
                                        placeholder="Select Condition"
                                    />
                                    {state?.errors?.item_condition && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {state.errors.item_condition[0]}
                                        </p>
                                    )}
                                    <input
                                        type="hidden"
                                        name="item_condition"
                                        value={condition}
                                    />
                                </div>
                            </div>

                            {/* Price & Location */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Price (₱) *
                                    </label>
                                    <input
                                        type="number"
                                        name="item_price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                    />
                                    {state?.errors?.item_price && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {state.errors.item_price[0]}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        name="item_location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                        placeholder="e.g., Manila, Philippines"
                                    />
                                    {state?.errors?.item_location && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                            {state.errors.item_location[0]}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Description *
                                </label>
                                <textarea
                                    name="item_description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={6}
                                    className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="Describe your item in detail..."
                                />
                                {state?.errors?.item_description && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        {state.errors.item_description[0]}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Images */}
                        <div className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Product Images
                                </label>
                                <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                                    Upload up to 5 images (max 5MB each)
                                </p>

                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div className="mb-4">
                                        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Current Images
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {existingImages.map((url, index) => (
                                                <div
                                                    key={index}
                                                    className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                                                >
                                                    <Image
                                                        src={url}
                                                        alt={`Product ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(index)}
                                                        className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Images Preview */}
                                {previewUrls.length > 0 && (
                                    <div className="mb-4">
                                        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            New Images
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {previewUrls.map((url, index) => (
                                                <div
                                                    key={index}
                                                    className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                                                >
                                                    <Image
                                                        src={url}
                                                        alt={`New ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNewImage(index)}
                                                        className="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload Area */}
                                {existingImages.length + newImages.length < 5 && (
                                    <div
                                        {...getRootProps()}
                                        className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                                            isDragActive
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-300 hover:border-gray-400 dark:border-gray-600'
                                        }`}
                                    >
                                        <input {...getInputProps()} />
                                        <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {isDragActive
                                                ? 'Drop images here'
                                                : 'Drag & drop or click to upload'}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {5 - existingImages.length - newImages.length} slots
                                            remaining
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:cursor-pointer hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                {isPending ? 'Updating...' : 'Update Listing'}
                            </button>

                            <Link
                                href={`/products/${id}`}
                                className="block w-full rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default EditListingPage;
