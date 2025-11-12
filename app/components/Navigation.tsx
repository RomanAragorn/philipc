'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { moreItems, NavItem, navItems } from '@/app/data/navItems';
import { userSettings } from '@/app/data/userSettings';
import Button from '@/app/components/Button';
import { Search, ChevronDown, CircleUser } from 'lucide-react';
import ThemeToggle from '@/app/components/ThemeToggle';

const Navigation: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 right-0 left-0 z-999 border-gray-200 bg-linear-to-r from-[#003d4d]/85 to-[#0081b3]/85 shadow-xl backdrop-blur-2xl dark:from-gray-900 dark:to-gray-900">
            <div
                className={`mx-auto flex items-center justify-between px-5 py-4 md:px-10 lg:px-15`}
            >
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center space-x-3 rtl:space-x-reverse"
                >
                    <Image
                        src="/logo.svg"
                        width={120}
                        height={20}
                        alt="PhiliPC Logo"
                    />
                </Link>
                {/* Right Side */}
                <div className="flex md:order-2">
                    {/* SearchBar, SellButton, UserIcon */}
                    <div className="flex items-center space-x-3">
                        <ThemeToggle />
                        {/* Desktop Search Bar */}
                        <div className="relative hidden md:block">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="block rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:w-30 lg:w-40 xl:w-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            />
                        </div>

                        {/* Desktop Sell Button */}
                        <div className="hidden lg:inline">
                            <Button label="Sell Item" />
                        </div>

                        {/* Dekstop User Icon */}
                        <div className="relative hidden md:inline">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center text-white hover:text-blue-400"
                            >
                                <CircleUser
                                    className={`ms-1 h-8 w-8 transition-transform duration-200`}
                                />
                            </button>

                            {/* Desktop User Menu */}
                            {userMenuOpen && (
                                <ul className="absolute right-0 z-50 mt-2 w-50 rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
                                    {userSettings.map((userSettings) => (
                                        <li key={userSettings.id}>
                                            <Link
                                                href="/user/profile"
                                                className="block px-4 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                            >
                                                <div className="font-semibold">
                                                    {userSettings.label}
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Mobile Search Icon */}
                    <div className="relative flex items-center md:hidden">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-40 rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        />
                    </div>

                    {/* Mobile User Icon */}
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="me-1 p-2.5 text-gray-500 md:hidden dark:text-gray-400"
                    >
                        <CircleUser className="h-8 w-8 text-white" />
                    </button>
                </div>

                {/* Dekstop Nav Items */}
                <div
                    className={`hidden w-full items-center justify-between md:order-1 md:flex md:w-auto`}
                    id="navbar-search"
                >
                    {/* Navigation Items */}
                    <ul className="mt-4 flex rounded-lg p-4 font-medium md:mt-0 md:space-x-1 md:border-0 md:p-0 lg:space-x-6">
                        {navItems.map((item: NavItem) => {
                            return (
                                <li key={item.id}>
                                    <Link
                                        href={item.href}
                                        className="flex gap-3 px-3 py-2 text-white hover:text-blue-400 dark:hover:text-blue-500"
                                    >
                                        <div>
                                            <div className="font-medium">{item.label}</div>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}

                        {/* Dropdown Nav Item*/}
                        <li className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center px-3 py-2 text-white hover:text-blue-400"
                            >
                                More
                                <ChevronDown
                                    className={`ms-1 h-4 w-4 transition-transform duration-200 ${
                                        dropdownOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <ul className="absolute right-0 z-50 mt-2 w-50 divide-y divide-gray-300 rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
                                    {moreItems.map((option) => (
                                        <li key={option.id}>
                                            <a
                                                href="#"
                                                className="block px-4 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                            >
                                                <div className="font-medium">{option.label}</div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
            </div>

            {/* Mobile User Menu */}
            {userMenuOpen && (
                <div className="border-t border-gray-200/50 backdrop-blur-lg lg:hidden">
                    <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
                        {userSettings.map((item) => {
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className={`hover:bg-dark-primary flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-white transition-all duration-200`}
                                >
                                    {/* <Icon className="w-5 h-5" /> */}
                                    <div>
                                        <div className="font-medium">{item.label}</div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
