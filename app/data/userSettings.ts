import React from 'react';

export interface UserSetting {
    id: number;
    label: string;
    href: string;
    icon?: React.ReactNode; // optional icon (e.g. from lucide-react)
}

export const userSettings: UserSetting[] = [
    {
        id: 2,
        label: 'Settings',
        href: '/settings',
    },
];
