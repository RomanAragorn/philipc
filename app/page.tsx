'use client';

import React from 'react';
import Banner from '@/app/components/HomeBanner';
import Navigation from '@/app/components/Navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import products from '@/app/data/productMock.json';
import Products from '@/app/components/Products';
import CategoriesList from '@/app/components/CategoriesList';
import Footer from '@/app/components/Footer';

const Home: React.FC = () => {
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
                    <div className="mb-4 grid grid-flow-row gap-5 p-5 md:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => {
                            return (
                                <Products
                                    key={product.listing_id}
                                    product={product}
                                    // onClick={() => console.log('view')}
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
