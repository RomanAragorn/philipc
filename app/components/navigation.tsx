"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { moreItems, navItems } from "@/app/data/navItems";
import { userSettings } from "@/app/data/userSettings";
import Button from "@/app/components/button";
import { Search, ChevronDown, CircleUser } from "lucide-react";

const Navigation = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	return (
		<nav className="bg-gradient-blue border-gray-200 dark:bg-gray-900">
			<div className={`flex items-center justify-between mx-auto py-4 px-5 md:px-10 lg:px-15`}>
				{/* Logo */}
				<Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
					<Image src="/logo.svg" width={120} height={20} alt="PhiliPC Logo" />
				</Link>
				{/* Right Side */}
				<div className="md:order-2 flex">
					{/* SearchBar, SellButton, UserIcon */}
					<div className="flex items-center space-x-3">
						{/* Desktop Search Bar */}
						<div className="hidden md:block relative">
							<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
								<Search className="w-5 text-gray-400" />
							</div>
							<input
								type="text"
								placeholder="Search..."
								className="block md:w-30 lg:w-40 xl:w-60 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg 
										bg-gray-50 focus:ring-blue-500 focus:border-blue-500 
										dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
										dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							/>
						</div>

						{/* Desktop Sell Button */}
						<div className="hidden lg:inline">
							<Button label="Sell Item" />
						</div>

						{/* Dekstop User Icon */}
						<div className="hidden md:inline relative">
							<button
								onClick={() => setUserMenuOpen(!userMenuOpen)}
								className="flex items-cente text-white hover:text-blue-400">
								<CircleUser className={`w-8 h-8 ms-1 transition-transform duration-200`} />
							</button>

							{/* Desktop User Menu */}
							{userMenuOpen && (
								<ul className="absolute right-0 mt-2 w-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-50">
									{userSettings.map((userSettings) => (
										<li key={userSettings.id}>
											<Link
												href="/user/profile"
												className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
												<div className="font-semibold">{userSettings.label}</div>
											</Link>
										</li>
									))}
								</ul>
							)}
						</div>
					</div>

					{/* Mobile Search Icon */}
					<div className="md:hidden relative flex items-center">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<Search className="w-5 text-gray-400" />
						</div>
						<input
							type="text"
							placeholder="Search..."
							className=" w-40 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg 
										bg-gray-50 focus:ring-blue-500 focus:border-blue-500 
										dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
										dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						/>
					</div>

					{/* Mobile User Icon */}
					<button
						onClick={() => setUserMenuOpen(!userMenuOpen)}
						className="md:hidden text-gray-500 dark:text-gray-400 p-2.5 me-1">
						<CircleUser className="text-white w-8 h-8" />
					</button>
				</div>

				{/* Dekstop Nav Items */}
				<div
					className={`hidden md:flex items-center justify-between w-full md:w-auto md:order-1`}
					id="navbar-search">
					{/* Navigation Items */}
					<ul className="flex p-4 md:p-0 mt-4 font-medium rounded-lg md:space-x-1 lg:space-x-6  md:mt-0 md:border-0">
						{navItems.map((item) => {
							return (
								<li key={item.id}>
									<Link
										href={item.href}
										className="flex gap-3 py-2 px-3 text-white hover:text-blue-400 dark:hover:text-blue-500">
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
								className="flex items-center py-2 px-3 text-white hover:text-blue-400">
								More
								<ChevronDown
									className={`w-4 h-4 ms-1 transition-transform duration-200 ${
										dropdownOpen ? "rotate-180" : ""
									}`}
								/>
							</button>

							{/* Dropdown Menu */}
							{dropdownOpen && (
								<ul className="absolute right-0 mt-2 w-50 divide-y divide-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-50">
									{moreItems.map((option) => (
										<li key={option.id}>
											<a
												href="#"
												className="block px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
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
				<div className="lg:hidden border-t border-gray-200/50  backdrop-blur-lg">
					<div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
						{userSettings.map((item) => {
							return (
								<Link
									key={item.id}
									href={item.href}
									onClick={() => setUserMenuOpen(!userMenuOpen)}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-white hover:bg-dark-primary
											`}>
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
