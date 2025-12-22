'use client';

import React, { useState, useCallback, useActionState } from 'react';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { conditionOptions, categoryOptions } from '@/app/data/searchFilters';
import Dropdown from '@/app/components/Dropdown';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { UserSession } from '@/app/data/types';
import { createListing, CreateListingState } from './actions';

const CreateListingPage: React.FC = () => {
    const [user, setUser] = useState<UserSession | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [category, setCategory] = useState('');
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [condition, setCondition] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [state, formAction, isPending] = useActionState<CreateListingState, FormData>(
        createListing,
        undefined
    );

    React.useEffect(() => {
        const fetchUser = async (): Promise<void> => {
            try {
                const response = await fetch('/api/session');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user || null);
                }
            } catch (err) {
                console.error('Failed to fetch user:', err);
            }
        };
        fetchUser();
    }, []);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (images.length >= 5) return;

            const allowedFiles = acceptedFiles
                .filter((file) => file.type.startsWith('image/'))
                .slice(0, 5 - images.length);

            const urls = allowedFiles.map((file) => URL.createObjectURL(file));

            setImages((prev) => [...prev, ...allowedFiles]);
            setPreviewUrls((prev) => [...prev, ...urls]);
        },
        [images]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: true,
    });

    const removeImage = (index: number): void => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
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
                <form
                    action={(formData) => {
                        // Add images to FormData
                        images.forEach((image) => {
                            formData.append('images', image);
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

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* LEFT COLUMN — IMAGES */}
                        <div className="flex h-full flex-col rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                Upload Images
                            </h2>

                            <div className="flex flex-1 flex-col">
                                {previewUrls.length === 0 && (
                                    <div
                                        {...getRootProps()}
                                        className={`flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-400 p-6 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 ${
                                            isDragActive ? 'bg-blue-50 dark:bg-blue-900' : ''
                                        }`}
                                    >
                                        <input {...getInputProps()} />
                                        <Upload className="mb-2 h-6 w-6" />
                                        {isDragActive
                                            ? 'Drop images here…'
                                            : 'Click or Drag & Drop images'}
                                    </div>
                                )}

                                {previewUrls.length > 0 && (
                                    <>
                                        {/* Thumbnail */}
                                        <div className="relative mb-4 h-64 w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                                            <Image
                                                src={previewUrls[0]}
                                                alt="thumbnail"
                                                fill
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(0)}
                                                className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:cursor-pointer hover:bg-black/50 hover:text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        {/* Small previews */}
                                        {previewUrls.length > 1 && (
                                            <div className="mb-4 grid grid-cols-4 gap-2">
                                                {previewUrls.slice(1).map((url, index) => (
                                                    <div
                                                        className="relative"
                                                        key={index}
                                                    >
                                                        <Image
                                                            src={url}
                                                            alt="preview"
                                                            width={100}
                                                            height={100}
                                                            className="h-20 w-full rounded-lg border border-gray-300 object-cover dark:border-gray-700"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index + 1)}
                                                            className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:cursor-pointer hover:bg-black/50 hover:text-red-500"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Upload More */}
                                        {previewUrls.length < 5 && (
                                            <div
                                                {...getRootProps()}
                                                className={`mt-2 flex flex-1 cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-400 py-10 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 ${
                                                    isDragActive
                                                        ? 'bg-blue-50 dark:bg-blue-900'
                                                        : ''
                                                }`}
                                            >
                                                <input {...getInputProps()} />
                                                <Upload className="mr-2 h-5 w-5" />
                                                Upload more images (Max 5)
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN — FORM FIELDS */}
                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                Item Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-600 dark:text-gray-300">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="hidden"
                                        name="category"
                                        value={category}
                                    />
                                    <Dropdown
                                        label=""
                                        options={categoryOptions}
                                        selected={category}
                                        onChange={setCategory}
                                        placeholder="Select category"
                                    />
                                    {state?.errors?.category && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {state.errors.category[0]}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600 dark:text-gray-300">
                                        Item Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="item_name"
                                        value={itemName}
                                        onChange={(e) => setItemName(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    />
                                    {state?.errors?.item_name && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {state.errors.item_name[0]}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600 dark:text-gray-300">
                                        Price (₱) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="item_price"
                                        step="0.01"
                                        min="0"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        placeholder="0.00"
                                    />
                                    {state?.errors?.item_price && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {state.errors.item_price[0]}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600 dark:text-gray-300">
                                        Condition <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="hidden"
                                        name="item_condition"
                                        value={condition}
                                    />
                                    <Dropdown
                                        label=""
                                        options={conditionOptions}
                                        selected={condition}
                                        onChange={setCondition}
                                        placeholder="Any condition"
                                    />
                                    {state?.errors?.item_condition && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {state.errors.item_condition[0]}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600 dark:text-gray-300">
                                        Location <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="item_location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        placeholder="City, Province"
                                    />
                                    {state?.errors?.item_location && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {state.errors.item_location[0]}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600 dark:text-gray-300">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="item_description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={5}
                                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    ></textarea>
                                    {state?.errors?.item_description && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {state.errors.item_description[0]}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isPending || !user}
                                    className="bg-dark-primary w-full rounded-lg py-3 text-sm font-medium text-white hover:bg-[#0C587B] disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-gray-600"
                                >
                                    {isPending ? 'Creating Listing...' : 'Create Listing'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
};

export default CreateListingPage;
