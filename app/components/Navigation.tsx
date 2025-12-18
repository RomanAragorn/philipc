'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { moreItems, NavItem, navItems } from '@/app/data/navItems';
import { userSettings } from '@/app/data/userSettings';
import Button from '@/app/components/Button';
import { Search, ChevronDown, CircleUser, Menu } from 'lucide-react';
import ThemeToggle from '@/app/components/ThemeToggle';
import { useSearchParams, useRouter } from 'next/navigation';
import { logout } from '@/app/(auth)/login/actions';
import { UserSession } from '@/app/data/types';

const Navigation: React.FC = () => {
    const [user, setUser] = useState<UserSession | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get('search') || '';
    const [search, setSearch] = useState(initialSearch);

    // Fetch user session on mount
    useEffect(() => {
        const fetchUser = async (): Promise<void> => {
            try {
                const response = await fetch('/api/session');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user || null);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        const params = new URLSearchParams(searchParams.toString());
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }

        router.push(`/products${params.toString() ? `?${params.toString()}` : ''}`);
    };

    return (
        <nav className="sticky top-0 right-0 left-0 z-999 border-gray-200 bg-linear-to-r from-[#003d4d]/85 to-[#0081b3]/85 shadow-xl dark:from-gray-900 dark:to-gray-900">
            <div
                className={`mx-auto flex items-center justify-between px-5 py-4 backdrop-blur-3xl md:px-10 lg:px-15`}
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
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={search}
                                    className="block rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:w-30 lg:w-40 xl:w-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </form>
                        </div>

                        {/* Desktop Sell Button */}
                        <div className="hidden lg:inline">
                            <Link href={'/sell'}>
                                <Button label="Sell Item" />
                            </Link>
                        </div>

                        {/* Desktop User Icon */}
                        <div className="relative hidden lg:inline">
                            {user ? (
                                <>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 text-white hover:text-blue-400"
                                    >
                                        {user.profile_pic_url ? (
                                            <Image
                                                src={user.profile_pic_url}
                                                alt={`${user.first_name} ${user.last_name}`}
                                                width={32}
                                                height={32}
                                                className="rounded-full object-cover"
                                            />
                                        ) : (
                                            <CircleUser className="h-8 w-8" />
                                        )}
                                        <span className="text-sm">
                                            {user.first_name} {user.last_name}
                                        </span>
                                    </button>
                                    {/* Desktop User Menu */}
                                    {userMenuOpen && (
                                        <ul className="absolute right-0 z-50 mt-2 w-50 rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
                                            <li>
                                                <Link
                                                    href={`/users/${user.username}`}
                                                    className="block px-4 py-2 text-gray-900 hover:cursor-pointer hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                                >
                                                    <div className="font-semibold">
                                                        View Profile
                                                    </div>
                                                </Link>
                                            </li>
                                            {userSettings.map((setting) => (
                                                <li key={setting.id}>
                                                    <Link
                                                        href={setting.href}
                                                        className="block px-4 py-2 text-gray-900 hover:cursor-pointer hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                                    >
                                                        <div className="font-semibold">
                                                            {setting.label}
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                            <li>
                                                <button
                                                    onClick={handleLogout}
                                                    className="block w-full px-4 py-2 text-left text-gray-900 hover:cursor-pointer hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                                >
                                                    <div className="font-semibold">Log Out</div>
                                                </button>
                                            </li>
                                        </ul>
                                    )}
                                </>
                            ) : (
                                <div className="flex items-center justify-center gap-2 text-white">
                                    <Link
                                        className="text-xs text-nowrap hover:cursor-pointer hover:text-blue-400"
                                        href="/signup"
                                    >
                                        Sign Up
                                    </Link>
                                    <div className="text-xs">|</div>
                                    <Link
                                        className="text-xs text-nowrap hover:cursor-pointer hover:text-blue-400"
                                        href="/login"
                                    >
                                        Log In
                                    </Link>
                                </div>
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
                        className="me-1 pl-2.5 text-gray-500 lg:hidden dark:text-gray-400"
                    >
                        <Menu className="h-8 w-8 text-white" />
                    </button>
                </div>

                {/* Dekstop Nav Items */}
                <div
                    className={`hidden w-full items-center justify-between md:order-1 md:w-auto lg:flex`}
                    id="navbar-search"
                >
                    {/* Navigation Items */}
                    <ul className="mt-4 flex rounded-lg p-4 font-medium md:mt-0 md:space-x-1 md:border-0 md:p-0 lg:space-x-2 xl:space-x-6">
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
                                                href={option.href}
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
            {userMenuOpen && user && (
                <div className="lg:hidden">
                    <div className="absolute z-100 w-full max-w-7xl space-y-1 rounded-b-2xl border-b border-gray-500/70 bg-white/60 px-4 py-3 backdrop-blur-xl">
                        <ul>
                            <li>
                                <Link
                                    href={`/users/${user.username}`}
                                    className={`hover:bg-dark-primary flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-black transition-all duration-200`}
                                >
                                    <div className="font-medium">View Profile</div>
                                </Link>
                            </li>
                            {userSettings.map((item) => {
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className={`hover:bg-dark-primary flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-black transition-all duration-200`}
                                    >
                                        {/* <Icon className="w-5 h-5" /> */}
                                        <div>
                                            <div className="font-medium">{item.label}</div>
                                        </div>
                                    </Link>
                                );
                            })}

                            <li>
                                <button
                                    onClick={handleLogout}
                                    className={`hover:bg-dark-primary flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-black transition-all duration-200`}
                                >
                                    <div className="font-medium">Log Out</div>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
