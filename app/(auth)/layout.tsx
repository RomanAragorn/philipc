import React from 'react';
import Image from 'next/image';

const User: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="grid min-h-screen grid-cols-1 bg-gray-100 lg:grid-cols-2">
            <div className="hidden items-center justify-center bg-[url('/images/form-bg.jpg')] bg-cover bg-center lg:flex">
                <div className="max-w-lg px-5 text-white">
                    {/* <h2 className="text-4xl font-extrabold">Frontend na maangas</h2>
					<p className="mt-4 text-lg opacity-90">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem modi repudiandae vel eum magni
						natus.
					</p> */}
                    <div className="mt-8 w-full overflow-hidden rounded-md shadow-xl"></div>
                </div>
            </div>

            <div className="relative flex flex-col items-center p-10 pt-10">
                <div className="relative mb-20 h-15 w-60 lg:h-20 lg:w-85">
                    <Image
                        src="/logo.svg"
                        alt="PhiliPC Logo"
                        fill
                        priority
                        className="object-contain"
                    />
                </div>
                {children}
            </div>
        </div>
    );
};

export default User;
