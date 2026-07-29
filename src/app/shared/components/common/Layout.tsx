import React from 'react';
import { useLocation } from 'react-router-dom';
import NavigationMenu from './NavigationMenu';
import PWAInstallPrompt from './PWAInstallPrompt';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface LayoutProps {
  children: React.ReactNode;
  showInstallPrompt?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const ROUTES_WITHOUT_NAV = ['/notifications'];

function shouldShowNavigation(pathname: string): boolean {
  return !ROUTES_WITHOUT_NAV.includes(pathname);
}

function resolveContentClassName(pathname: string, showNavigation: boolean): string {
  const noNavPadding = showNavigation ? 'pb-24' : 'pb-0';
  const isScrollable = ['/profile', '/songs', '/ranking', '/notifications'].some((path) =>
    pathname.startsWith(path)
  );

  if (isScrollable) {
    return `flex-1 scroll-container-native ${noNavPadding} scrollbar-hide overflow-x-hidden`;
  }

  return `relative flex-1 scroll-container-native flex flex-col gap-4 ${noNavPadding} scrollbar-hide overflow-x-hidden`;
}

// ── Layout ─────────────────────────────────────────────────────────────────────

export const Layout: React.FC<LayoutProps> = ({ children, showInstallPrompt = true }) => {
  const { pathname } = useLocation();
  const showNavigation = shouldShowNavigation(pathname);
  const contentClassName = resolveContentClassName(pathname, showNavigation);

  return (
    <main className="flex flex-col h-screen bg-background overflow-hidden px-2.5">
      <div className={`relative ${contentClassName}`}>{children}</div>

      {showNavigation && <NavigationMenu />}
      {showInstallPrompt && <PWAInstallPrompt />}
    </main>
  );
};

export default Layout;
