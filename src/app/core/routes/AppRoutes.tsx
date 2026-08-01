import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { UserListView } from '@features/user';
import { ProfileView } from '@features/profile';
import { ScalesPreviewView } from '@features/scales';
import { SongsView } from '@features/songs';
import { RankingView } from '@features/ranking';
import { NotificationsView } from '@features/notifications';
import { ServiceUnavailableView } from '@features/error';
import { useAuth, Permission } from '@shared/hooks/useAuth';

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

// ── Helpers ────────────────────────────────────────────────────────────────────

function getDefaultRoute(hasPermission: (permission: Permission) => boolean): string {
  if (hasPermission(Permission.ScaleView)) {
    return '/scales';
  }
  if (hasPermission(Permission.SongView)) {
    return '/songs';
  }
  if (hasPermission(Permission.RankingView)) {
    return '/ranking';
  }
  return '/profile';
}

// ── AppRoutes ──────────────────────────────────────────────────────────────────

export const AppRoutes: React.FC = () => {
  const location = useLocation();
  const { hasPermission } = useAuth();

  const canViewScales = hasPermission(Permission.ScaleView);
  const canViewSongs = hasPermission(Permission.SongView);
  const canViewRanking = hasPermission(Permission.RankingView);
  const defaultRoute = getDefaultRoute(hasPermission);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...TAB_FADE} style={TAB_STYLE}>
        <Routes location={location}>
          <Route path="/" element={<Navigate to={defaultRoute} replace />} />
          <Route
            path="/scales"
            element={canViewScales ? <ScalesPreviewView /> : <Navigate to={defaultRoute} replace />}
          />
          <Route
            path="/songs"
            element={canViewSongs ? <SongsView /> : <Navigate to={defaultRoute} replace />}
          />
          <Route
            path="/songs/:songId"
            element={canViewSongs ? <SongsView /> : <Navigate to={defaultRoute} replace />}
          />
          <Route
            path="/ranking"
            element={canViewRanking ? <RankingView /> : <Navigate to={defaultRoute} replace />}
          />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/notifications" element={<NotificationsView />} />
          <Route path="/users" element={<UserListView />} />
          <Route path="/503" element={<ServiceUnavailableView />} />
          <Route path="/maintenance" element={<ServiceUnavailableView />} />
          <Route path="*" element={<Navigate to={defaultRoute} replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppRoutes;
