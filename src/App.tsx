import { useState, Suspense } from 'react';
import { Toaster } from 'sonner';
import { AuthFlow } from '@features/auth';
import { Layout } from '@shared/components';
import { useAuth } from '@shared/hooks/useAuth';
import AppRoutes from '@core/routes/AppRoutes';
import { useThemeStore } from '@shared/hooks/useThemeStore';

// ── Suspense Fallback ──────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-10 h-10 border-3 border-border border-t-primary rounded-full animate-spin-slow" />
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────

function App() {
  useThemeStore();
  const { isAuthenticated, userName, avatarUrl } = useAuth();
  const [activeTab, setActiveTab] = useState('scales');
  const [previousTab, setPreviousTab] = useState('scales');
  const [showNavigation, setShowNavigation] = useState(true);
  const [songIdToPlay, setSongIdToPlay] = useState<string | null>(null);

  const [wasAuthenticated, setWasAuthenticated] = useState(isAuthenticated);
  if (isAuthenticated !== wasAuthenticated) {
    setWasAuthenticated(isAuthenticated);
    if (!isAuthenticated) {
      setActiveTab('scales');
      setPreviousTab('scales');
    }
  }

  const handleTabChange = (tab: string) => {
    if (activeTab !== 'notifications') {
      setPreviousTab(activeTab);
    }
    setActiveTab(tab);
  };

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AuthFlow />
      </Suspense>
    );
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <Suspense fallback={<LoadingScreen />}>
        {/* Replace with a Router (e.g. react-router-dom) as the app grows */}
        <Layout
          activeTab={activeTab}
          onTabChange={handleTabChange}
          showHeader={activeTab === 'scales'}
          showNavigation={showNavigation}
          userName={userName}
          avatarUrl={avatarUrl}
          contentClassName={
            activeTab === 'profile' || activeTab === 'songs' || activeTab === 'ranking' || activeTab === 'notifications'
              ? `flex-1 scroll-container-native ${!showNavigation ? 'pb-0' : 'pb-24'} scrollbar-hide overflow-x-hidden`
              : undefined
          }
          onNotificationClick={() => {
            setPreviousTab(activeTab);
            setActiveTab('notifications');
          }}
        >
          <AppRoutes
            activeTab={activeTab}
            onShowNavigationChange={setShowNavigation}
            onNotificationClick={(prevTab) => {
              if (prevTab) setPreviousTab(prevTab);
              setActiveTab('notifications');
            }}
            onBack={() => {
              setActiveTab(previousTab);
            }}
            onSongNavigate={(songId) => {
              setSongIdToPlay(songId);
              setActiveTab('songs');
            }}
            songIdToPlay={songIdToPlay}
            onSongIdConsumed={() => setSongIdToPlay(null)}
          />
        </Layout>
      </Suspense>
    </>
  );
}

export default App;

