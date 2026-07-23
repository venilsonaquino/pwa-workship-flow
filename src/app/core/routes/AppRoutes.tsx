import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserListView } from '@features/user';
import { ProfileView } from '@features/profile';
import { ScalesPreviewView } from '@features/scales';
import { SongsView } from '@features/songs';
import { RankingView } from '@features/ranking';
import { NotificationsView } from '@features/notifications';
import { useAuth } from '@shared/hooks/useAuth';

interface AppRoutesProps {
  activeTab: string;
  onShowNavigationChange?: (show: boolean) => void;
  onNotificationClick?: (prevTab?: string) => void;
  onBack?: () => void;
  onSongNavigate?: (songId: string) => void;
  songIdToPlay?: string | null;
  onSongIdConsumed?: () => void;
}

const TAB_FADE = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

const TAB_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  minHeight: '100%',
};

export const AppRoutes: React.FC<AppRoutesProps> = ({
  activeTab,
  onShowNavigationChange,
  onNotificationClick,
  onBack,
  onSongNavigate,
  songIdToPlay,
  onSongIdConsumed,
}) => {
  const { userName, userEmail, userRole, avatarUrl } = useAuth();

  const handleNotificationClickWithTab = (tab: string) => {
    if (onNotificationClick) {
      onNotificationClick(tab);
    }
  };

  const tabComponents: Record<string, React.ReactNode> = {
    profile: (
      <ProfileView
        userName={userName}
        userEmail={userEmail}
        userRole={userRole ?? undefined}
        avatarUrl={avatarUrl}
        onNotificationClick={() => handleNotificationClickWithTab('profile')}
      />
    ),
    songs: (
      <SongsView
        onNotificationClick={() => handleNotificationClickWithTab('songs')}
        onShowNavigationChange={onShowNavigationChange}
        songIdToPlay={songIdToPlay ?? null}
        onSongIdConsumed={onSongIdConsumed}
      />
    ),
    scales: <ScalesPreviewView />,
    ranking: (
      <RankingView
        onNotificationClick={() => handleNotificationClickWithTab('ranking')}
      />
    ),
    notifications: (
      <NotificationsView
        onBack={onBack ?? (() => {})}
        onSongNavigate={onSongNavigate}
      />
    ),
  };

  const activeView = tabComponents[activeTab] ?? <UserListView />;

  return (
    <AnimatePresence mode="wait">
      <motion.div key={activeTab} {...TAB_FADE} style={TAB_STYLE}>
        {activeView}
      </motion.div>
    </AnimatePresence>
  );
};

export default AppRoutes;

