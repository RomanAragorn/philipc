'use client';

import { useState, useMemo } from 'react';
import Products from '@/app/components/Products';
import Navigation from '@/app/components/Navigation';
import Dropdown from '@/app/components/Dropdown';
import userMock from '@/app/data/userMock.json';
import { Product as ProductType } from '@/app/data/types';
import { useSearchParams, useRouter } from 'next/navigation';
import { sortOptions, conditionOptions } from '@/app/data/searchFilters';
import { ArrowLeft, Filter, Search, X } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/app/components/Footer';

const ProductsPage: React.FC = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const searchQuery = searchParams.get('search') || '';
    const conditionQuery = searchParams.get('condition') || '';
    const minPriceQuery = searchParams.get('minPrice') || '';
    const maxPriceQuery = searchParams.get('maxPrice') || '';
    const sortQuery = searchParams.get('sort') || 'asc';

    // FOR MOCK DATA ONLY
    const [condition, setCondition] = useState(conditionQuery);
    const [minPrice, setMinPrice] = useState(minPriceQuery);
    const [maxPrice, setMaxPrice] = useState(maxPriceQuery);
    const [sort, setSort] = useState(sortQuery);

    const filteredProducts: ProductType[] = useMemo(() => {
        let allProducts: ProductType[] = userMock.flatMap((user) =>
            user.listings.map((item) => ({
                ...item,
                fname: user.first_name,
                lname: user.last_name,
            }))
        );

        if (searchQuery) {
            allProducts = allProducts.filter((p) =>
                p.item_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (conditionQuery) {
            allProducts = allProducts.filter((p) => p.condition === conditionQuery);
        }

        if (minPriceQuery) {
            allProducts = allProducts.filter((p) => p.item_price >= parseFloat(minPriceQuery));
        }

        if (maxPriceQuery) {
            allProducts = allProducts.filter((p) => p.item_price <= parseFloat(maxPriceQuery));
        }

        if (sortQuery === 'desc') {
            allProducts = allProducts.sort((a, b) => b.item_price - a.item_price);
        } else {
            allProducts = allProducts.sort((a, b) => a.item_price - b.item_price);
        }

        return allProducts;
    }, [searchQuery, conditionQuery, minPriceQuery, maxPriceQuery, sortQuery]);

    const handleFilterSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (condition && condition !== '') {
            params.set('condition', condition);
        } else {
            params.delete('condition');
        }

        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort) params.set('sort', sort);

        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />

            <div className="mx-auto mt-4 flex max-w-7xl gap-2 p-4">
                <Link
                    className="hover:cursor-pointer"
                    href={'/'}
                >
                    <ArrowLeft />
                </Link>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Item Listing</h1>
            </div>
            <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
                {/* Search and Filter Header */}
                <div className="mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            <Filter className="mr-2 inline h-5 w-5" />
                            Filters & Search
                        </h2>
                        {(searchQuery || conditionQuery || minPriceQuery || maxPriceQuery) && (
                            <button
                                onClick={() => {
                                    setCondition('');
                                    setMinPrice('');
                                    setMaxPrice('');
                                    router.push('/products');
                                }}
                                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                <X className="h-4 w-4" />
                                Clear filters
                            </button>
                        )}
                    </div>

                    <form
                        onSubmit={handleFilterSubmit}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {/* Sort by Price */}
                        <Dropdown
                            label="Sort by Price"
                            options={sortOptions}
                            selected={sort}
                            onChange={setSort}
                            placeholder="Select sorting..."
                        />

                        {/* Condition */}
                        <Dropdown
                            label="Condition"
                            options={conditionOptions}
                            selected={condition}
                            onChange={setCondition}
                            placeholder="Any condition"
                        />

                        {/* Price Range */}
                        <div className="lg:col-span-1">
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Price Range
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="₱0"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300"
                                />
                                <span className="text-gray-500 dark:text-gray-400">-</span>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="₱50,000"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300"
                                />
                            </div>
                        </div>

                        {/* Apply Button */}
                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="bg-primary w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <Search className="mr-2 inline h-4 w-4" />
                                Apply Filters
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Summary */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {filteredProducts.length > 0 ? (
                            <span>
                                Showing {filteredProducts.length} product
                                {filteredProducts.length !== 1 ? 's' : ''}
                                {searchQuery && (
                                    <span>
                                        {' '}
                                        for &ldquo;
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {searchQuery}
                                        </span>
                                        &rdquo;
                                    </span>
                                )}
                            </span>
                        ) : (
                            <span>No products found</span>
                        )}
                    </div>
                </div>

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="rounded-lg bg-gray-50 p-12 text-center dark:bg-gray-800">
                        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                            No products found
                        </h3>
                        <p className="mb-4 text-gray-500 dark:text-gray-400">
                            Try adjusting your filters or search terms to find what you&apos;re
                            looking for.
                        </p>
                        <button
                            onClick={() => {
                                setCondition('');
                                setMinPrice('');
                                setMaxPrice('');
                                router.push('/products');
                            }}
                            className="bg-primary rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <Products
                                key={product.listing_id}
                                product={product}
                                showUser
                            />
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ProductsPage;
