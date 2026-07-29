import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { UserListView } from '@features/user';
import { ProfileView } from '@features/profile';
import { ScalesPreviewView } from '@features/scales';
import { SongsView } from '@features/songs';
import { RankingView } from '@features/ranking';
import { NotificationsView } from '@features/notifications';

// ── Animation ──────────────────────────────────────────────────────────────────

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

// ── AppRoutes ──────────────────────────────────────────────────────────────────

export const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...TAB_FADE} style={TAB_STYLE}>
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/scales" replace />} />
          <Route path="/scales" element={<ScalesPreviewView />} />
          <Route path="/songs" element={<SongsView />} />
          <Route path="/songs/:songId" element={<SongsView />} />
          <Route path="/ranking" element={<RankingView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/notifications" element={<NotificationsView />} />
          <Route path="/users" element={<UserListView />} />
          <Route path="*" element={<Navigate to="/scales" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppRoutes;
