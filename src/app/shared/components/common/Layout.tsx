import React from 'react';
import Header from './Header';
import NavigationMenu from './NavigationMenu';
import PWAInstallPrompt from './PWAInstallPrompt';

export interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  pageHeader?: React.ReactNode;
  showNavigation?: boolean;
  showInstallPrompt?: boolean;
  userName?: string;
  avatarUrl?: string;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  hasUnreadNotifications?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  contentClassName?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  pageHeader,
  showNavigation = true,
  showInstallPrompt = true,
  userName,
  avatarUrl,
  onNotificationClick,
  hasUnreadNotifications,
  activeTab,
  onTabChange,
  contentClassName,
}) => {
  return (
    <main className="flex flex-col h-screen bg-background overflow-hidden p-2.5">
      {showHeader && !pageHeader && (
        <Header
          userName={userName}
          avatarUrl={avatarUrl}
          onNotificationClick={onNotificationClick}
          hasUnreadNotifications={hasUnreadNotifications}
        />
      )}

      {pageHeader}

      <div className={`relative ${contentClassName ?? 'flex-1 scroll-container-native flex flex-col gap-4 pb-24 scrollbar-hide overflow-x-hidden'}`}>
        {children}
      </div>

      {showNavigation && (
        <NavigationMenu activeTab={activeTab} onChange={onTabChange} />
      )}
      {showInstallPrompt && <PWAInstallPrompt />}
    </main>
  );
};

export default Layout;
