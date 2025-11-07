import React from "react";
import Image from "next/image";

const User = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-100">
			<div className="hidden lg:flex items-center justify-center bg-[url('/images/form-bg.jpg')] bg-cover bg-center">
				<div className="max-w-lg text-white px-5">
					{/* <h2 className="text-4xl font-extrabold">Frontend na maangas</h2>
					<p className="mt-4 text-lg opacity-90">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem modi repudiandae vel eum magni
						natus.
					</p> */}
					<div className="mt-8 w-full rounded-md shadow-xl overflow-hidden"></div>
				</div>
			</div>

			<div className="flex relative flex-col items-center 10 p-10 pt-10">
				<div className="w-60 h-15 lg:w-85 lg:h-20 relative mb-20">
					<Image src="/logo.svg" alt="PhiliPC Logo" fill priority className="object-contain" />
				</div>
				{children}
			</div>
		</div>
	);
};

export default User;
