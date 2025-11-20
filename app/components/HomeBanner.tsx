import { MoveRight, ShieldCheck } from 'lucide-react';
import React from 'react';

const Banner: React.FC = () => {
    return (
        <div className="mx-auto flex h-fit w-full max-w-7xl grid-cols-2 grid-rows-1 justify-center px-5 py-10">
            {/* Left */}
            <div className="flex min-h-80 w-md flex-col justify-between gap-5 rounded-3xl bg-blue-100 p-7 md:rounded-r-none">
                <div className="text-black">
                    <h1 className="mb-4 text-2xl font-extrabold lg:text-4xl">
                        Tech Enthusiasts, Welcome Home
                    </h1>
                    <span className="text-neutral md:text-md text-sm">
                        Performance-grade GPUs, high refresh monitors, and custom-key peripherals:
                        the hardware to perfect your setup
                    </span>
                </div>
                <div className="">
                    <button className="bg-light-primary hover:bg-dark-primary hover:border-dark-primary hover:text-light-primary flex rounded-4xl border-4 border-[#33444A] px-5 py-2 text-[#33444A] hover:cursor-pointer lg:w-50">
                        <span className="m-auto text-xl font-extrabold">Buy now</span>
                        <MoveRight className="m-auto inline h-10 w-10" />
                    </button>
                </div>
            </div>

            {/* Right */}
            <div className="relative z-0 hidden w-4xl rounded-r-3xl bg-[#7AA2B8] md:inline">
                <div className="absolute -inset-x-2 inset-y-15 flex h-30 w-fit border-b-4 border-gray-500 bg-[#A3D4D3] p-3">
                    <ShieldCheck className="m-auto h-15 w-15 text-gray-600 lg:h-17 lg:w-17" />
                    <span className="m-auto mask-linear-from-neutral-800 text-3xl font-extrabold text-gray-600 lg:text-4xl">
                        Shop with Confidence
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Banner;
