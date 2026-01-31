import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            className="w-full flex items-center gap-3 px-6 py-3 text-slate-400 text-sm font-medium hover:bg-slate-800 hover:text-white transition-all rounded-lg"
            onClick={toggleTheme}
            title={`Passer en mode ${theme === 'light' ? 'sombre' : 'clair'}`}
        >
            <span className="w-6 text-center flex items-center justify-center">
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </span>
            <span>{theme === 'light' ? 'Mode Sombre' : 'Mode Clair'}</span>
        </button>
    );
};
