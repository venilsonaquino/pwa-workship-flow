import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@src/lib/utils';
import { useAuth, Permission } from '@shared/hooks/useAuth';

// ── Types ──────────────────────────────────────────────────────────────────────

interface TabItem {
  path: string;
  label: string;
  icon: string;
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

export const NavigationMenu: React.FC = () => {
  const { pathname } = useLocation();
  const { hasPermission } = useAuth();

  const visibleTabs = TABS.filter((tab) => isTabAllowed(tab.path, hasPermission));

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md h-[72px] z-50 transition-all duration-300">
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
