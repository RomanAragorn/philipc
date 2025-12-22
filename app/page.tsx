'use client';

import React, { useEffect, useState } from 'react';
import Banner from '@/app/components/HomeBanner';
import Navigation from '@/app/components/Navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Products from '@/app/components/Products';
import CategoriesList from '@/app/components/CategoriesList';
import Footer from '@/app/components/Footer';
import { Product as ProductType } from '@/app/data/types';

const Home: React.FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async (): Promise<void> => {
            try {
                const res = await fetch('/api/products');
                if (!res.ok) throw new Error('Failed to Fetch');
                const json = await res.json();
                const { products } = json.data;

                setProducts(products);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-200 dark:bg-gray-900">
            <Navigation />
            {/* Home Page */}
            <div className="mx-3 flex flex-col">
                <Banner />
                {/* Recommendations */}
                <section
                    id="recommendations"
                    className="m-4 mx-auto w-full max-w-7xl"
                >
                    <div className="flex justify-between">
                        <div className="text-black dark:text-white">
                            <span className="text-lg font-semibold">Recommended for you</span>
                        </div>
                        <div className="">
                            <Link
                                href={'/products'}
                                className="text-primary flex hover:text-blue-700 hover:underline"
                            >
                                View All
                                <ChevronRight className="h-6 w-6" />
                            </Link>
                        </div>
                    </div>
                    <div className="mb-4 grid grid-flow-row gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {loading && <p>Loading...</p>}
                        {products.map((product) => {
                            return (
                                <Products
                                    key={product.listing_id}
                                    product={product}
                                    showStatus={false}
                                />
                            );
                        })}
                    </div>
                </section>
                <section
                    id="categories"
                    className="mx-auto my-4 w-full max-w-7xl"
                >
                    <div className="flex justify-between">
                        <div className="text-black dark:text-white">
                            <span className="text-lg font-semibold">Explore Categories</span>
                        </div>
                    </div>
                    <div className="">
                        <CategoriesList />
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
