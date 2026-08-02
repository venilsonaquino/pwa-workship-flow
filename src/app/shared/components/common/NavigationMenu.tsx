import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@src/lib/utils';
import { useAuth, Permission } from '@shared/hooks/useAuth';

// ── Types ──────────────────────────────────────────────────────────────────────

interface TabItem {
  path: string;
  label: string;
  icon: string;
}

interface NavigationMenuProps {
  scrollContainerRef: React.RefObject<HTMLElement | null>;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const TABS: TabItem[] = [
  { path: '/scales', label: 'Escalas', icon: 'event_note' },
  { path: '/songs', label: 'Músicas', icon: 'music_note' },
  { path: '/ranking', label: 'Ranking', icon: 'leaderboard' },
  { path: '/profile', label: 'Perfil', icon: 'account_circle' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function isTabActive(tabPath: string, currentPath: string): boolean {
  if (tabPath === '/songs') {
    return currentPath === '/songs' || currentPath.startsWith('/songs/');
  }
  return currentPath === tabPath;
}

function isTabAllowed(tabPath: string, hasPermission: (permission: Permission) => boolean): boolean {
  if (tabPath === '/scales') {
    return hasPermission(Permission.ScaleView);
  }
  if (tabPath === '/ranking') {
    return hasPermission(Permission.RankingView);
  }
  if (tabPath === '/songs') {
    return hasPermission(Permission.SongView);
  }
  return true;
}

// ── NavigationMenu ─────────────────────────────────────────────────────────────

const SCROLL_DELTA_THRESHOLD = 6;
const TOP_VISIBILITY_THRESHOLD = 16;

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ scrollContainerRef }) => {
  const { pathname } = useLocation();
  const { hasPermission } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number | null = null;
    lastScrollTopRef.current = scrollContainer.scrollTop;
    setIsVisible(true);

    const updateNavigationVisibility = () => {
      const currentScrollTop = Math.max(scrollContainer.scrollTop, 0);
      const scrollDelta = currentScrollTop - lastScrollTopRef.current;

      if (currentScrollTop <= TOP_VISIBILITY_THRESHOLD) {
        setIsVisible(true);
      } else if (Math.abs(scrollDelta) >= SCROLL_DELTA_THRESHOLD) {
        setIsVisible(scrollDelta < 0);
      }

      lastScrollTopRef.current = currentScrollTop;
      animationFrameId = null;
    };

    const handleScroll = () => {
      if (animationFrameId === null) {
        animationFrameId = window.requestAnimationFrame(updateNavigationVisibility);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [pathname, scrollContainerRef]);

  const visibleTabs = TABS.filter((tab) => isTabAllowed(tab.path, hasPermission));

  return (
    <nav
      className={cn(
        'fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md h-[72px] z-50 transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-[calc(100%+2rem)] opacity-0 pointer-events-none'
      )}
      aria-hidden={!isVisible}
    >
      <div className="absolute inset-0 rounded-xl bg-surface-container-lowest border border-outline-variant/10 shadow-lg -z-10 pointer-events-none" />

      <div className="flex justify-around items-center px-4 h-full relative">
        {visibleTabs.map((tab) => {
          const active = isTabActive(tab.path, pathname);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full select-none cursor-pointer transition-all duration-200 active:scale-95',
                active
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant opacity-70 hover:opacity-100'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{
                  fontVariationSettings: active ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400",
                }}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] mt-0.5 tracking-wide font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationMenu;
