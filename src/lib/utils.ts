import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn
 * Utility to merge tailwind classes safely using clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves a relative avatar URL from the API to a complete absolute URL.
 * If the URL is already absolute or empty, returns it as-is.
 */
export function getAbsoluteAvatarUrl(url?: string | null): string {
  if (!url) {
    return '';
  }

  const isAbsolute = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:');
  if (isAbsolute) {
    return url;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!apiBaseUrl) {
    return url;
  }

  try {
    const origin = new URL(apiBaseUrl).origin;
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${origin}${cleanPath}`;
  } catch {
    return url;
  }
}
