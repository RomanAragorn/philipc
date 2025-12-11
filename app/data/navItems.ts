import { Cpu, Gpu, MemoryStick, HardDrive, Keyboard } from 'lucide-react';
import React from 'react';

export const navItems = [
    { id: 'cpu', label: 'CPU', href: '/products?category=cpu', icon: Cpu },
    { id: 'gpu', label: 'GPU', href: '/products?category=gpu', icon: Gpu },
    { id: 'ram', label: 'RAM', href: '/products?category=ram', icon: MemoryStick },
    { id: 'memory', label: 'Memory', href: '/products?category=memory', icon: HardDrive },
    { id: 'peripherals', label: 'Peripherals', href: '/products?category=peripherals', icon: Keyboard },
];

export const moreItems = [
    { id: 'monitors', label: 'Monitors', href: '/products?category=monitors' },
    { id: 'miscellaneous', label: 'Miscellaneous', href: '/products?category=misc' },
];

export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    current?: boolean;
}
