import Image from 'next/image';
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark-primary flex items-center justify-center gap-3 py-2 text-white dark:bg-gray-900">
            <div className="relative h-13 w-25">
                <Image
                    src="/logo.svg"
                    alt="PhiliPC Logo"
                    fill
                    className="object-contain"
                />
            </div>
            <span className="text-sm">&copy; 2025 PHILIPC. All rights reserved.</span>
        </footer>
    );
};

export default Footer;
