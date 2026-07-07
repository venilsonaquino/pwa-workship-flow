import { useState, useEffect, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('pwa-prompt-dismissed') === 'true';
  });

  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && (navigator as NavigatorWithStandalone).standalone === true)
    );
  });

  const [isIOS] = useState(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  });

  const handleBeforeInstallPrompt = useCallback((e: Event) => {
    e.preventDefault();
    setDeferredPrompt(e as BeforeInstallPromptEvent);
    setIsInstallable(true);
  }, []);

  const handleAppInstalled = useCallback(() => {
    setIsInstalled(true);
    setIsInstallable(false);
    setDeferredPrompt(null);
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [handleBeforeInstallPrompt, handleAppInstalled]);

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
    } catch (err) {
      console.error('[PWA] Error prompting installation:', err);
    }
    return false;
  };

  const dismiss = () => {
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    setIsDismissed(true);
  };

  // The prompt should be showable if the browser event fired (isInstallable)
  // OR if we are on an iOS device (non-standalone), and the user hasn't dismissed or already installed it.
  const showPrompt = (isInstallable || isIOS) && !isDismissed && !isInstalled;

  return {
    showPrompt,
    isInstallable,
    isInstalled,
    isIOS,
    install,
    dismiss,
  };
}

