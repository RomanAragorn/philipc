import { Cpu, Gpu, MemoryStick, HardDrive, Keyboard } from 'lucide-react';
import React from 'react';

export const navItems = [
    { id: 'cpu', label: 'CPU', href: '/#', icon: Cpu },
    { id: 'gpu', label: 'GPU', href: '/#', icon: Gpu },
    { id: 'ram', label: 'RAM', href: '/#', icon: MemoryStick },
    { id: 'memory', label: 'Memory', href: '/#', icon: HardDrive },
    { id: 'peripherals', label: 'Peripherals', href: '/#', icon: Keyboard },
];

export const moreItems = [
    { id: 'monitors', label: 'Monitors', href: '/#' },
    { id: 'miscellaneous', label: 'Miscellaneous', href: '/#' },
];

export interface NavItem {
    id: string;
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    current?: boolean;
}
