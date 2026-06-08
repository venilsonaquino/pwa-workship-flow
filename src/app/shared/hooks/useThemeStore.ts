import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

const THEME_KEY = 'pwa_theme_preference';

// Internal module-level store (lightweight alternative to a state management library)
let _theme: Theme = (localStorage.getItem(THEME_KEY) as Theme) ?? 'dark';
const _subscribers = new Set<() => void>();

function notifySubscribers() {
  _subscribers.forEach((cb) => cb());
}

/**
 * useThemeStore
 * Lightweight global store for the active theme.
 * Synchronizes with localStorage and respects the system preference on first load.
 */
export function useThemeStore() {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const rerender = () => forceRender((n) => n + 1);
    _subscribers.add(rerender);
    return () => { _subscribers.delete(rerender); };
  }, []);

  // Apply theme class to <html> for non-styled-components targets (e.g. scrollbar)
  useEffect(() => {
    document.documentElement.dataset.theme = _theme;
    if (_theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, _theme);
  }, []);

  const toggleTheme = useCallback(() => {
    _theme = _theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = _theme;
    if (_theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, _theme);
    notifySubscribers();
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    _theme = newTheme;
    document.documentElement.dataset.theme = _theme;
    if (_theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, _theme);
    notifySubscribers();
  }, []);

  return { theme: _theme, toggleTheme, setTheme };
}
