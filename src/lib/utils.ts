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

/**
 * Converts a URL-safe base64 string (like a VAPID public key) to a Uint8Array.
 * Required for PushManager.subscribe({ applicationServerKey }).
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const cleanStr = (base64String || '').trim();
  const padding = '='.repeat((4 - (cleanStr.length % 4)) % 4);
  const base64 = (cleanStr + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
