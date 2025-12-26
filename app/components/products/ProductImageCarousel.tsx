'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageCarouselProps {
    images: string[];
    productName: string;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ images, productName }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = (): void => {
        if (!images.length) return;
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (): void => {
        if (!images.length) return;
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
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
                                    alt={`${productName} ${idx + 1}`}
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
                                alt={`${productName} ${idx + 1}`}
                                fill
                                className="rounded-xl object-cover p-1"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductImageCarousel;
