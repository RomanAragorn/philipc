'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { signup, SignupState } from './actions';

const SignupPage: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [state, signupAction] = useActionState<SignupState, FormData>(signup, undefined);

    return (
        <>
            <div className="relative bottom-10 z-10 m-auto flex w-full max-w-md flex-col rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-xl font-bold text-gray-900 md:text-2xl lg:text-3xl">
                    Create Account!
                </h2>
                <form
                    action={signupAction}
                    className="space-y-4"
                >
                    {/* General Error */}
                    {state?.errors?.general && (
                        <div className="rounded-md bg-red-50 p-3">
                            <p className="text-sm text-red-800">{state.errors.general[0]}</p>
                        </div>
                    )}

                    {/* First Name Input */}
                    <div className="relative z-0">
                        <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            autoComplete="given-name"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder=" "
                            className="focus:outline-primary focus:border-primary peer z-5 block w-full rounded-md border border-gray-300 bg-transparent px-2 py-2.5 pt-5 text-sm text-gray-900 shadow-sm hover:cursor-text focus:ring-0"
                        />
                        <label
                            htmlFor="first_name"
                            className="text-neutral peer-focus:text-primary absolute top-3 z-10 origin-left -translate-y-2 scale-75 transform px-3 text-sm duration-300 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-2 peer-focus:scale-75 hover:cursor-text rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 peer-focus:dark:text-blue-500"
                        >
                            First Name
                        </label>
                        {state?.errors?.first_name && (
                            <p className="mt-1 text-xs text-red-600">
                                {state.errors.first_name[0]}
                            </p>
                        )}
                    </div>

                    {/* Middle Name Input (Optional) */}
                    <div className="relative z-0">
                        <input
                            id="middle_name"
                            name="middle_name"
                            type="text"
                            autoComplete="additional-name"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                            placeholder=" "
                            className="focus:outline-primary focus:border-primary peer z-5 block w-full rounded-md border border-gray-300 bg-transparent px-2 py-2.5 pt-5 text-sm text-gray-900 shadow-sm hover:cursor-text focus:ring-0"
                        />
                        <label
                            htmlFor="middle_name"
                            className="text-neutral peer-focus:text-primary absolute top-3 z-10 origin-left -translate-y-2 scale-75 transform px-3 text-sm duration-300 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-2 peer-focus:scale-75 hover:cursor-text rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 peer-focus:dark:text-blue-500"
                        >
                            Middle Name (Optional)
                        </label>
                    </div>

                    {/* Last Name Input */}
                    <div className="relative z-0">
                        <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            autoComplete="family-name"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder=" "
                            className="focus:outline-primary focus:border-primary peer z-5 block w-full rounded-md border border-gray-300 bg-transparent px-2 py-2.5 pt-5 text-sm text-gray-900 shadow-sm hover:cursor-text focus:ring-0"
                        />
                        <label
                            htmlFor="last_name"
                            className="text-neutral peer-focus:text-primary absolute top-3 z-10 origin-left -translate-y-2 scale-75 transform px-3 text-sm duration-300 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-2 peer-focus:scale-75 hover:cursor-text rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 peer-focus:dark:text-blue-500"
                        >
                            Last Name
                        </label>
                        {state?.errors?.last_name && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.last_name[0]}</p>
                        )}
                    </div>

                    {/* Email Input */}
                    <div className="relative z-0">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=" "
                            className="focus:outline-primary focus:border-primary peer z-5 block w-full rounded-md border border-gray-300 bg-transparent px-2 py-2.5 pt-5 text-sm text-gray-900 shadow-sm hover:cursor-text focus:ring-0"
                        />
                        <label
                            htmlFor="email"
                            className="text-neutral peer-focus:text-primary absolute top-3 z-10 origin-left -translate-y-2 scale-75 transform px-3 text-sm duration-300 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-2 peer-focus:scale-75 hover:cursor-text rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 peer-focus:dark:text-blue-500"
                        >
                            Email Address
                        </label>
                        {state?.errors?.email && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p>
                        )}
                    </div>

                    {/* Contact Number Input */}
                    <div className="relative z-0">
                        <input
                            id="contact_no"
                            name="contact_no"
                            type="tel"
                            autoComplete="tel"
                            required
                            value={contactNo}
                            onChange={(e) => setContactNo(e.target.value)}
                            placeholder=" "
                            className="focus:outline-primary focus:border-primary peer z-5 block w-full rounded-md border border-gray-300 bg-transparent px-2 py-2.5 pt-5 text-sm text-gray-900 shadow-sm hover:cursor-text focus:ring-0"
                        />
                        <label
                            htmlFor="contact_no"
                            className="text-neutral peer-focus:text-primary absolute top-3 z-10 origin-left -translate-y-2 scale-75 transform px-3 text-sm duration-300 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-2 peer-focus:scale-75 hover:cursor-text rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 peer-focus:dark:text-blue-500"
                        >
                            Contact Number (09XXXXXXXXX)
                        </label>
                        {state?.errors?.contact_no && (
                            <p className="mt-1 text-xs text-red-600">
                                {state.errors.contact_no[0]}
                            </p>
                        )}
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
                        {state?.errors?.username && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.username[0]}</p>
                        )}
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
                        {state?.errors?.password && (
                            <p className="mt-1 text-xs text-red-600">{state.errors.password[0]}</p>
                        )}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative z-0">
                        <input
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder=" "
                            className="focus:outline-primary focus:border-primary peer block w-full rounded-md border border-gray-300 bg-transparent px-2 py-2.5 pt-5 text-sm text-gray-900 shadow-sm focus:ring-0"
                        />
                        <label
                            htmlFor="confirm_password"
                            className="text-neutral peer-focus:text-primary absolute top-3 -z-10 origin-left -translate-y-2 scale-75 transform px-3 text-sm duration-300 peer-placeholder-shown:translate-y-1 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-2 peer-focus:scale-75 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 peer-focus:dark:text-blue-500"
                        >
                            Confirm Password
                        </label>
                        {state?.errors?.confirm_password && (
                            <p className="mt-1 text-xs text-red-600">
                                {state.errors.confirm_password[0]}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
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
