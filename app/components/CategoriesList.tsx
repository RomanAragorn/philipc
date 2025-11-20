'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
const images = [
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg',
];

const CategoriesList: React.FC = () => {
    const [visibleCount, setVisibleCount] = useState(5);
    // State to hold scroll parameters
    const [scrollParams, setScrollParams] = useState({
        scrollLeft: 0,
        scrollWidth: 1, // Use 1 to avoid divide-by-zero
        clientWidth: 1,
    });
    // Ref for the scrollable container
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // This effect hook handles responsiveness for visibleCount
    useEffect(() => {
        const handleResize = (): void => {
            if (window.innerWidth >= 1024) setVisibleCount(5);
            else if (window.innerWidth >= 768) setVisibleCount(3);
            else setVisibleCount(2);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return (): void => window.removeEventListener('resize', handleResize);
    }, []);

    // This effect hook updates scroll params on resize or load
    useEffect(() => {
        const updateScrollParams = (): void => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                setScrollParams({
                    scrollLeft,
                    scrollWidth: scrollWidth || 1,
                    clientWidth: clientWidth || 1,
                });
            }
        };

        // Update on mount
        updateScrollParams();
        // Update on resize
        window.addEventListener('resize', updateScrollParams);
        return (): void => window.removeEventListener('resize', updateScrollParams);
    }, [visibleCount]); // Re-run when visibleCount changes

    // Handler for the scroll event on the container
    const handleScroll = (): void => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setScrollParams({
                scrollLeft,
                scrollWidth: scrollWidth || 1,
                clientWidth: clientWidth || 1,
            });
        }
    };

    // Calculate item width percentage
    const itemWidthPercent = 100 / visibleCount;

    // --- Button Click Handlers ---
    const nextSlide = (): void => {
        if (scrollContainerRef.current) {
            const { clientWidth } = scrollContainerRef.current;
            scrollContainerRef.current.scrollBy({
                left: clientWidth, // Scroll by one full "page"
                behavior: 'smooth',
            });
        }
    };

    const prevSlide = (): void => {
        if (scrollContainerRef.current) {
            const { clientWidth } = scrollContainerRef.current;
            scrollContainerRef.current.scrollBy({
                left: -clientWidth, // Scroll back by one full "page"
                behavior: 'smooth',
            });
        }
    };

    // --- Custom Scrollbar Calculations ---
    const { scrollLeft, scrollWidth, clientWidth } = scrollParams;
    const thumbWidthPercent = (clientWidth / scrollWidth) * 100;
    const maxScrollLeft = scrollWidth - clientWidth;
    // Calculate thumb position: (scrollLeft / maxScroll) * (available track space)
    const maxThumbLeftPercent = 100 - thumbWidthPercent;
    const thumbLeftPercent =
        maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * maxThumbLeftPercent : 0;

    // --- Button Visibility Logic ---
    // Use a 1px buffer for float precision issues
    const showPrevButton = scrollLeft > 1;
    const showNextButton = scrollLeft < maxScrollLeft - 1;

    return (
        <div className="relative mx-auto max-w-7xl p-4">
            {/* Slider viewport - Hides the native scrollbar */}
            <div className="overflow-hidden">
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    // This is the scrollable container
                    className="-mb-4 flex overflow-x-auto pb-4 transition-transform duration-500 ease-in-out"
                    style={{
                        // Add CSS to hide scrollbar for Firefox
                        scrollbarWidth: 'none',
                        // Add CSS to hide scrollbar for Chrome, Safari, Edge
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {images.map((src, idx) => (
                        <div
                            key={idx}
                            className="relative mx-2 h-48 shrink-0"
                            style={{ flex: `0 0 ${itemWidthPercent}%` }}
                        >
                            <Image
                                src={src}
                                alt={`Slide ${idx + 1}`}
                                fill
                                className="rounded-lg object-cover shadow-md"
                                loading="lazy"
                            />
                            {/* Label on bottom-left */}
                            <div className="absolute bottom-2 left-2 z-10 rounded bg-black/50 px-2 py-1 text-sm text-white">
                                Category {idx + 1}
                            </div>
                        </div>
                    ))}
                </div>
                {/* CSS to hide scrollbar for Webkit browsers */}
                <style>
                    {`
                        .overflow-x-auto::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>
            </div>

            {/* Custom Scrollbar Track */}
            <div className="mt-4 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                {/* Custom Scrollbar Thumb */}
                <div
                    className="bg-dark-primary dark:bg-primary h-2 rounded-full transition-all duration-100"
                    style={{
                        width: `${thumbWidthPercent}%`,
                        marginLeft: `${thumbLeftPercent}%`,
                    }}
                />
            </div>

            {/* Prev button */}
            {showPrevButton && (
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 -left-3 z-20 -translate-y-1/2 rounded-full bg-white/70 p-2 text-black hover:bg-white dark:bg-gray-400/70"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
            )}

            {/* Next button */}
            {showNextButton && (
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 -right-3 z-20 -translate-y-1/2 rounded-full bg-white/70 p-2 text-black hover:bg-white dark:bg-gray-400/70"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            )}
        </div>
    );
};

export default CategoriesList;
