import React, { useState } from 'react';
import { useThemeStore } from '@shared/hooks/useThemeStore';

export interface HeaderProps {
  userName?: string;
  avatarUrl?: string;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  hasUnreadNotifications?: boolean;
}

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD06iOmChUDtHnvRGKmvPX3VM5ICai2yvJgMXluA85CE_dqlTUe3cKybaHYSGfsOJ3CJlXF33lgznYR40NhswT7HhMw8z0qs_YwXv0QMIuwML1_5HrdnHvK9keVZm-3kHh1vLdde5dMY62IshBGZz51y_KPLMYZ2vJpPz7CTRT9SlF750Qb9f-51ZHAcQCgJHELIhQZbEbopGaakirZ6N6cBaPFQb6fTWgI8yaIXKl_XMU_pEk4Pxnn5TzdF8O47i6Ry4UpSw8jNFE';

export const Header: React.FC<HeaderProps> = ({
  userName = 'Manu Admin',
  avatarUrl = DEFAULT_AVATAR,
  onSearchClick,
  onNotificationClick,
  hasUnreadNotifications = true, // Defaulting to true for visual polish, matching mock indicators
}) => {
  const { theme, toggleTheme } = useThemeStore();
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  });

  // Compute initials as fallback
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-[200] w-full h-16 px-4 bg-background flex items-center justify-between transition-colors duration-250">
      {/* Left section: User Profile Info */}
      <div className="flex items-center gap-3 select-none">
        {/* Profile Avatar with primary-tinted ring */}
        <div className="w-[38px] h-[38px] rounded-full border-2 border-primary/20 dark:border-primary/30 overflow-hidden shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95 bg-surface-variant flex items-center justify-center">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={userName} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                // Remove image on error to trigger fallback initials
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <span className="text-xs font-bold text-primary dark:text-primary-variant">
              {initials}
            </span>
          )}
        </div>

        {/* Greetings and User Name */}
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-semibold text-on-surface-variant/70 dark:text-on-surface-variant/80 tracking-wider uppercase font-sans leading-none mb-0.5">
            {greeting},
          </span>
          <h2 className="text-[14px] font-bold text-on-surface dark:text-on-surface leading-tight font-sans">
            {userName}
          </h2>
        </div>
      </div>

      {/* Right section: Action Controls */}
      <div className="flex items-center gap-1.5">
        {/* Search Toggle Button */}
        {onSearchClick && (
          <button
            onClick={onSearchClick}
            className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant dark:text-on-surface-variant/90 hover:bg-surface-variant/60 dark:hover:bg-surface-container-high/60 active:scale-95 transition-all cursor-pointer"
            aria-label="Buscar"
            title="Buscar"
          >
            <span className="material-symbols-outlined text-[22px] select-none">
              search
            </span>
          </button>
        )}

        {/* Notifications Button */}
        <button
          onClick={onNotificationClick}
          className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant dark:text-on-surface-variant/90 hover:bg-surface-variant/60 dark:hover:bg-surface-container-high/60 active:scale-95 transition-all cursor-pointer relative"
          aria-label="Notificações"
          title="Notificações"
        >
          <span className="material-symbols-outlined text-[22px] select-none">
            notifications
          </span>
          {hasUnreadNotifications && (
            <span className="absolute top-[6px] right-[6px] w-[9px] h-[9px] rounded-full bg-error border border-background animate-pulse" />
          )}
        </button>

        {/* Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant dark:text-on-surface-variant/90 hover:bg-surface-variant/60 dark:hover:bg-surface-container-high/60 active:scale-95 transition-all cursor-pointer"
          aria-label="Alternar tema"
          title={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
        >
          <span className="material-symbols-outlined text-[22px] select-none">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
