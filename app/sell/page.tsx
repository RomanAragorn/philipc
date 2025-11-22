'use client';

import React, { useState } from 'react';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { conditionOptions } from '@/app/data/searchFilters';
import Dropdown from '@/app/components/Dropdown';

const CreateListingPage: React.FC = () => {
    const router = useRouter();

    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [condition, setCondition] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle file upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);

        setImages((prev) => [...prev, ...files]);

        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls((prev) => [...prev, ...urls]);
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create product
            const res = await fetch('/api/products', {
                method: 'POST',
                body: JSON.stringify({
                    item_name: itemName,
                    item_price: price,
                    item_condition: condition,
                    item_description: description,
                    item_location: location,
                }),
            });

            const json = await res.json();
            const productId = json?.data?.product_id;

            // 2. Upload images
            for (const file of images) {
                const formData = new FormData();
                formData.append('image', file);

                await fetch(`/api/products/${productId}/images`, {
                    method: 'POST',
                    body: formData,
                });
            }

            router.push(`/product/${productId}`);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />

            <div className="mx-auto mt-4 flex max-w-7xl gap-2 p-4">
                <Link
                    href="/"
                    className="hover:cursor-pointer"
                >
                    <ArrowLeft />
                </Link>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">List an Item</h1>
            </div>

            <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* LEFT COLUMN — IMAGES */}
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Upload Images
                        </h2>

                        {/* Thumbnail Preview */}
                        <div className="mb-4 h-64 w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                            {previewUrls.length > 0 ? (
                                <img
                                    src={previewUrls[0]}
                                    alt="thumbnail"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-500 dark:text-gray-400">
                                    Thumbnail Preview
                                </div>
                            )}
                        </div>

                        {/* Small image previews */}
                        {previewUrls.length > 1 && (
                            <div className="mb-4 grid grid-cols-4 gap-2">
                                {previewUrls.slice(1).map((url, index) => (
                                    <div
                                        key={index}
                                        className="relative"
                                    >
                                        <img
                                            src={url}
                                            className="h-20 w-full rounded-lg object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index + 1)}
                                            className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Input */}
                        <label className="mt-4 flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-400 py-10 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                            <Upload className="mr-2 h-5 w-5" />
                            Click to upload images
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </label>
                    </div>

                    {/* RIGHT COLUMN — FORM */}
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            Item Details
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    Price (₱)
                                </label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    Condition
                                </label>
                                <Dropdown
                                    label=""
                                    options={conditionOptions}
                                    selected={condition}
                                    onChange={setCondition}
                                    placeholder="Any condition"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
                            >
                                {loading ? 'Listing...' : 'List Item'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CreateListingPage;
