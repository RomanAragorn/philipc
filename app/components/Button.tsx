import React from 'react';

const Button: React.FC<{ label: string }> = ({ label }) => {
    return (
        <button
            type="button"
            className="bg-dark-primary focus:ring-dark-primary w-full rounded-lg px-8 py-2.5 text-sm font-semibold text-nowrap text-white hover:cursor-pointer hover:bg-[#0C587B] focus:ring-2 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            {label}
        </button>
    );
};

export default Button;
