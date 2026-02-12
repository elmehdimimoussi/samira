import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
            className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-500 dark:text-slate-400 text-[13px] font-medium hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-800 dark:hover:text-slate-200 transition-all rounded-xl cursor-pointer"
            onClick={toggleTheme}
            title={`Passer en mode ${theme === 'light' ? 'sombre' : 'clair'}`}
        >
            <span className="w-6 flex justify-center">
                {theme === 'light' ? <Moon size={19} strokeWidth={1.5} /> : <Sun size={19} strokeWidth={1.5} />}
            </span>
            <span>{theme === 'light' ? 'Mode Sombre' : 'Mode Clair'}</span>
        </button>
    );
};
