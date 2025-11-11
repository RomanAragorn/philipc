'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
    }, [dark]);

    return (
        <button
            onClick={() => setDark(!dark)}
            className="mx-auto p-2 text-sm text-white"
        >
            {dark ? <Sun /> : <Moon />}
        </button>
    );
};

export default ThemeToggle;
