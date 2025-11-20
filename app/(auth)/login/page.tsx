'use client';

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { useState } from "react";
import Link from "next/link";

const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isRemembered, setIsRemembered] = useState(false);
=======
import { useState, useActionState } from 'react';
=======
import { useState } from 'react';
>>>>>>> 4bbed28 (fix: undefined import/variable)
import Link from 'next/link'

=======
import { useState, useActionState } from 'react';
import Link from 'next/link'
import { login } from "./actions";

>>>>>>> d370e076b91b2be690216a72938f3153464dc51c
const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRemembered, setIsRemembered] = useState(false);
<<<<<<< HEAD
<<<<<<< HEAD
    const [state, action] = useActionState(login, undefined);
>>>>>>> 100787c (feat(app): add fetching of all products and specific products from db)
=======
>>>>>>> 4bbed28 (fix: undefined import/variable)
=======
    const [state, action] = useActionState(login, undefined);
>>>>>>> d370e076b91b2be690216a72938f3153464dc51c

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log('Logging in with:', { username, password });

        // connect to backend
    };

    return (
        <div className="relative bottom-10 z-10 m-auto flex w-full max-w-md flex-col rounded-lg bg-white p-8 shadow-md">
            <h2 className="mb-6 text-center text-xl font-bold text-gray-900 md:text-2xl lg:text-3xl">
                Welcome Back!
            </h2>
            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
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
                        autoComplete="current-password"
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

                {/* Remember me Checkbox */}
                <div className="flex gap-3">
                    <input
                        type="checkbox"
                        name="remember"
                        id="remember"
                        checked={isRemembered}
                        onChange={() => setIsRemembered(!isRemembered)}
                        className="peer w-4"
                    />
                    <label
                        htmlFor="remember"
                        className={`text-xs hover:cursor-pointer md:text-sm ${
                            isRemembered ? 'text-primary' : 'text-neutral'
                        }`}
                    >
                        Remember Me
                    </label>
                </div>
                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="bg-primary flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                    >
                        Log in
                    </button>
                </div>
                <p className="text-neutral text-center text-xs">
                    Don&apos;t have an account yet?
                    <Link
                        href="/signup"
                        className="text-primary ml-1 rounded-xl border border-gray-300 p-2 font-semibold shadow-md hover:bg-gray-100"
                    >
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;
