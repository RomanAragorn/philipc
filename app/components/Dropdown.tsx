'use client';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronsUpDown, CheckIcon } from 'lucide-react';
import React from 'react';

interface DropdownProps {
    label: string;
    options: Array<{ id: number; label: string; value: string }>;
    selected: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
    label,
    options,
    selected,
    onChange,
    placeholder = 'Select an option',
    className = '',
}) => {
    const selectedOption = options.find((opt) => opt.value === selected);

    return (
        <div className={`w-full ${className}`}>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>

            <Listbox
                value={selected}
                onChange={onChange}
            >
                <div className="relative">
                    <ListboxButton className="relative w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-left shadow-sm transition-all duration-200 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-300">
                        <span className="block truncate text-sm">
                            {selectedOption?.label || placeholder}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronsUpDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        </span>
                    </ListboxButton>

                    <ListboxOptions
                        transition
                        className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg ring-1 ring-black/5 transition-all duration-200 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0 data-open:scale-100 data-open:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:ring-white/10"
                    >
                        {options.map((option) => (
                            <ListboxOption
                                key={option.id}
                                value={option.value}
                                className="group relative cursor-pointer py-2.5 pr-9 pl-3 text-sm transition-colors duration-150 select-none data-focus:bg-blue-50 data-focus:text-blue-900 dark:text-gray-300 dark:data-focus:bg-blue-900/20 dark:data-focus:text-blue-200"
                            >
                                <span className="block truncate font-normal group-data-selected:font-semibold group-data-selected:text-blue-600 dark:group-data-selected:text-blue-400">
                                    {option.label}
                                </span>

                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 opacity-0 transition-opacity duration-150 group-data-selected:opacity-100 dark:text-blue-400">
                                    <CheckIcon className="h-4 w-4" />
                                </span>
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>
        </div>
    );
};

export default Dropdown;
