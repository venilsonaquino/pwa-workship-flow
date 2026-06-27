import { useState } from 'react';
import Button from '@shared/components/ui/button';
import { useAuth } from '@shared/hooks/useAuth';

export interface HeaderProps {
  userName?: string;
  avatarUrl?: string;
  onNotificationClick?: () => void;
  hasUnreadNotifications?: boolean;
  title?: React.ReactNode;
  rightAction?: React.ReactNode;
  showNotification?: boolean;
}

const DEFAULT_AVATAR = '';

export const Header = ({
  userName,
  avatarUrl,
  onNotificationClick,
  hasUnreadNotifications = true,
  title,
  rightAction,
  showNotification = !title,
}: HeaderProps) => {
  const { userName: authUserName, avatarUrl: authAvatarUrl } = useAuth();
  const resolvedUserName = userName ?? authUserName ?? 'Admin';
  const resolvedAvatarUrl = avatarUrl ?? authAvatarUrl ?? DEFAULT_AVATAR;

  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  });


  return (
    <header
      className="sticky top-0 z-[200] w-full h-16 bg-background flex items-center justify-between transition-colors duration-250 relative"
    >
      <div className="flex items-center select-none gap-4">
        {title ? (
          <div
            className="w-[38px] h-[38px] rounded-full border-2 border-primary/20 dark:border-primary/30 overflow-hidden shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95 bg-surface-variant flex items-center justify-center"
          >
            {resolvedAvatarUrl ? (
              <img
                src={resolvedAvatarUrl}
                alt={resolvedUserName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                person
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div
              className="w-[38px] h-[38px] rounded-full border-2 border-primary/20 dark:border-primary/30 overflow-hidden shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95 bg-surface-variant flex items-center justify-center"
            >
              {resolvedAvatarUrl ? (
                <img
                  src={resolvedAvatarUrl}
                  alt={resolvedUserName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                  person
                </span>
              )}
            </div>

            <div className="flex flex-col text-left">
              <span
                className="text-[10px] font-semibold text-on-surface-variant/70 dark:text-on-surface-variant/80 tracking-wider uppercase font-sans leading-none mb-[2px]"
              >
                {greeting},
              </span>
              <h2 className="text-[14px] font-bold text-on-surface dark:text-on-surface leading-tight font-sans">
                {resolvedUserName}
              </h2>
            </div>
          </div>
        )}
      </div>

      {title && (
        <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
          {typeof title === 'string' ? (
            <h1 className="text-[18px] font-bold text-on-surface font-sans whitespace-nowrap pointer-events-auto">
              {title}
            </h1>
          ) : (
            <div className="pointer-events-auto flex justify-center">
              {title}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 z-10">
        {rightAction}
        {showNotification && (
          <Button
            onClick={onNotificationClick}
            variant="ghost"
            size="sm"
            iconOnly
            className="text-on-surface-variant dark:text-on-surface-variant/90 relative"
            aria-label="Notificações"
            title="Notificações"
          >
            <span className="material-symbols-outlined text-[22px] select-none">
              notifications
            </span>
            {hasUnreadNotifications && (
              <span
                className="absolute w-[9px] h-[9px] rounded-full bg-error border border-background animate-pulse top-1.5 right-1.5"
              />
            )}
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
