'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const SignupPage: React.FC = () => {
    const [fullName, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log('signing in with:', { username, password });
        // connect to backend
    };

    return (
        <>
            <div className="relative bottom-10 z-10 m-auto flex w-full max-w-md flex-col rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-xl font-bold text-gray-900 md:text-2xl lg:text-3xl">
                    Create Account!
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Full Name Input */}
                    <div className="relative z-0">
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            autoComplete="name"
                            required
                            value={fullName}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder=" "
                            className="focus:outline-primary focus:border-primary peer z-5 block w-full rounded-md border border-gray-300 bg-transparent px-2 py-2.5 pt-5 text-sm text-gray-900 shadow-sm hover:cursor-text focus:ring-0"
                        />
                        <label
                            htmlFor="fullName"
                            className="text-neutral peer-focus:text-primary absolute top-3 z-10 origin-left -translate-y-2 scale-75 transform px-3 text-sm duration-300 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-2 peer-focus:scale-75 hover:cursor-text rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 peer-focus:dark:text-blue-500"
                        >
                            Full Name
                        </label>
                    </div>

                    {/* Username Input */}
                    <div className="relative z-0">
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder=" "
                            className="focus:outline-primary focus:border-primary peer z-5 block w-full rounded-md border border-gray-300 bg-transparent px-2 py-2.5 pt-5 text-sm text-gray-900 shadow-sm hover:cursor-text focus:ring-0"
                        />
                        <label
                            htmlFor="username"
                            className="text-neutral peer-focus:text-primary absolute top-3 z-10 origin-left -translate-y-2 scale-75 transform px-3 text-sm duration-300 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-2 peer-focus:scale-75 hover:cursor-text rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 peer-focus:dark:text-blue-500"
                        >
                            Username
                        </label>
                    </div>

                    {/* Password Input */}
                    <div className="relative z-0">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=" "
                            className="focus:outline-primary focus:border-primary peer block w-full rounded-md border border-gray-300 bg-transparent px-2 py-2.5 pt-5 text-sm text-gray-900 shadow-sm focus:ring-0"
                        />
                        <label
                            htmlFor="password"
                            className="text-neutral peer-focus:text-primary absolute top-3 -z-10 origin-left -translate-y-2 scale-75 transform px-3 text-sm duration-300 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-2 peer-focus:scale-75 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 peer-focus:dark:text-blue-500"
                        >
                            Password
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="bg-primary flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                        >
                            Sign Up
                        </button>
                    </div>
                    <p className="text-neutral text-center text-xs">
                        Already have an account?
                        <Link
                            href="/login"
                            className="text-primary ml-1 rounded-xl border border-gray-300 p-2 font-semibold shadow-md hover:bg-gray-100"
                        >
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
            <hr />
            <p className="text-neutral text-center text-xs">
                By signing up, you agree to PhiliPC&apos;s{' '}
                <Link
                    href="/signup"
                    className="font-semibold underline"
                >
                    Terms of Service & Privacy Policy
                </Link>
            </p>
        </>
    );
};

export default SignupPage;
