import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserListView } from '@features/user';
import { ProfileView } from '@features/profile';
import { ScalesPreviewView } from '@features/scales';
import { SongsView } from '@features/songs';
import { RankingView } from '@features/ranking';
import { useAuth } from '@shared/hooks';

interface AppRoutesProps {
  activeTab: string;
}

const handleNotificationClick = () => console.info('[Header] Notifications clicked');

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

export const AppRoutes: React.FC<AppRoutesProps> = ({ activeTab }) => {
  const { userName, userEmail, userRole, avatarUrl } = useAuth();

  const tabComponents: Record<string, React.ReactNode> = {
    profile: (
      <ProfileView
        userName={userName}
        userEmail={userEmail}
        userRole={userRole ?? undefined}
        avatarUrl={avatarUrl}
        onNotificationClick={handleNotificationClick}
        hasUnreadNotifications={true}
      />
    ),
    songs: (
      <SongsView
        onNotificationClick={handleNotificationClick}
        hasUnreadNotifications={true}
      />
    ),
    scales: <ScalesPreviewView />,
    ranking: <RankingView />,
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

