import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = ({ compact = false }) => {
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
            className={`inline-flex items-center rounded-xl px-2 py-1.5 text-[13px] font-medium text-slate-500 transition-all hover:bg-slate-100/80 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200 ${compact ? 'gap-1.5' : 'gap-3 px-3 py-2.5'}`}
            onClick={toggleTheme}
            aria-label={`Activer le mode ${theme === 'light' ? 'sombre' : 'clair'}`}
            title={`Passer en mode ${theme === 'light' ? 'sombre' : 'clair'}`}
        >
            <span className="flex w-6 justify-center" aria-hidden="true">
                {theme === 'light' ? <Moon size={19} strokeWidth={1.5} /> : <Sun size={19} strokeWidth={1.5} />}
            </span>
            <span className={compact ? 'sr-only' : ''}>{theme === 'light' ? 'Mode Sombre' : 'Mode Clair'}</span>
        </button>
    );
};
