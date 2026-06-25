import { useState, Suspense } from 'react';
import { Toaster } from 'sonner';
import { AuthFlow } from '@features/auth';
import { Layout } from '@shared/components';
import { useAuth } from '@shared/hooks';
import AppRoutes from '@core/routes/AppRoutes';

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
  const { isAuthenticated, userName, avatarUrl } = useAuth();
  const [activeTab, setActiveTab] = useState('scales');
  const [showNavigation, setShowNavigation] = useState(true);

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
          onTabChange={setActiveTab}
          showHeader={activeTab === 'scales'}
          showNavigation={showNavigation}
          userName={userName}
          avatarUrl={avatarUrl}
          contentClassName={
            activeTab === 'profile' || activeTab === 'songs' || activeTab === 'ranking'
              ? `flex-1 scroll-container-native ${!showNavigation ? 'pb-0' : 'pb-24'} scrollbar-hide overflow-x-hidden`
              : undefined
          }
          onNotificationClick={() => console.info('[Header] Notifications clicked')}
        >
          <AppRoutes activeTab={activeTab} onShowNavigationChange={setShowNavigation} />
        </Layout>
      </Suspense>
    </>
  );
}

export default App;

