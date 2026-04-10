import React, { createContext, useContext, useState, useCallback } from 'react';
import translations from './translations.js';

const LocaleContext = createContext(null);

const STORAGE_KEY = 'wbgl_locale';

export function LocaleProvider({ children }) {
    const [locale, setLocaleState] = useState(
        () => localStorage.getItem(STORAGE_KEY) || 'tr'
    );

    const setLocale = (lang) => {
        setLocaleState(lang);
        localStorage.setItem(STORAGE_KEY, lang);
    };

    /**
     * t('topbar.title')  →  translations[locale].topbar.title
     * Supports dot-notation paths. Falls back to the key itself if not found.
     */
    const t = useCallback((path, vars) => {
        const parts = path.split('.');
        let node = translations[locale];
        for (const part of parts) {
            if (node == null) return path;
            node = node[part];
        }
        if (node == null) return path;
        // Simple variable interpolation: t('key', { count: 5 }) → 'Added {{count}} games' → 'Added 5 games'
        if (vars && typeof node === 'string') {
            return node.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
        }
        return node;
    }, [locale]);

    return (
        <LocaleContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const ctx = useContext(LocaleContext);
    if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>');
    return ctx;
}
