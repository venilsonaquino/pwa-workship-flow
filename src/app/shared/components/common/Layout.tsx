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
  onSearchClick,
  onNotificationClick,
  hasUnreadNotifications,
  activeTab,
  onTabChange,
  contentClassName,
}) => {
  return (
    <main className="flex flex-col min-h-screen bg-background" style={{ padding: '10px' }}>
      {showHeader && !pageHeader && (
        <Header
          userName={userName}
          avatarUrl={avatarUrl}
          onSearchClick={onSearchClick}
          onNotificationClick={onNotificationClick}
          hasUnreadNotifications={hasUnreadNotifications}
        />
      )}

      {pageHeader}

      <div className={contentClassName ?? 'flex-1 scroll-container-native p-4 flex flex-col gap-4 pb-24'}>
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
