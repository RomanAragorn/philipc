import React from 'react';

export interface UserSetting {
    id: number;
    label: string;
    href: string;
    icon?: React.ReactNode; // optional icon (e.g. from lucide-react)
}

export const userSettings: UserSetting[] = [
    {
        id: 1,
        label: 'Profile',
        href: '/profile',
    },
    {
        id: 2,
        label: 'Settings',
        href: '/settings',
    },
    {
        id: 3,
        label: 'Logout',
        href: '/logout',
    },
];
