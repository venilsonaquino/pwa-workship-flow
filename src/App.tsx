import { useState, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UserListView } from '@features/user';
import { ProfileView } from '@features/profile';
import { ScalesPreviewView } from '@features/scales';
import { SongsView } from '@features/songs';
import { AuthFlow } from '@features/auth';
import { MinistryView } from '@features/ministry';
import { Layout, PageHeader } from '@shared/components';
import { useAuth } from '@shared/hooks';

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
  const { isAuthenticated, userName, userEmail, userRole, avatarUrl } = useAuth();
  const [activeTab, setActiveTab] = useState('scales');

  const handleBack = () => {
    setActiveTab('scales');
  };

  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <AuthFlow />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      {/* Replace with a Router (e.g. react-router-dom) as the app grows */}
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showHeader={activeTab !== 'profile' && activeTab !== 'songs' && activeTab !== 'ministry'}
        userName={userName}
        avatarUrl={avatarUrl}
        pageHeader={
          activeTab === 'profile' ? (
            <PageHeader title="Perfil" onBack={handleBack} />
          ) : activeTab === 'ministry' ? (
            <PageHeader
              title="Gestão de Equipe"
              onBack={() => setActiveTab('profile')}
            />
          ) : undefined
        }
        contentClassName={
          activeTab === 'profile' || activeTab === 'songs' || activeTab === 'ministry'
            ? 'flex-1 scroll-container-native pb-24 scrollbar-hide overflow-x-hidden'
            : undefined
        }
        onNotificationClick={() => console.info('[Header] Notifications clicked')}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100%' }}
          >
            {activeTab === 'profile' ? (
              <ProfileView
                userName={userName}
                userEmail={userEmail}
                userRole={userRole ?? undefined}
                avatarUrl={avatarUrl}
                onNavigateToTeam={() => setActiveTab('ministry')}
              />
            ) : activeTab === 'ministry' ? (
              <MinistryView />
            ) : activeTab === 'songs' ? (
              <SongsView onBack={handleBack} />
            ) : activeTab === 'scales' ? (
              <ScalesPreviewView />
            ) : (
              <UserListView />
            )}
          </motion.div>
        </AnimatePresence>
      </Layout>
    </Suspense>
  );
}

export default App;

