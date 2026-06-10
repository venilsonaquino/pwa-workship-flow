import { useState, Suspense } from 'react';
import { UserListView } from '@features/user';
import { ProfileView } from '@features/profile';
import { ScalesPreviewView } from '@features/scales';
import { Layout, PageHeader } from '@shared/components';

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
  const [activeTab, setActiveTab] = useState('scales');

  const handleBack = () => {
    setActiveTab('scales');
  };

  return (
    <Suspense fallback={<LoadingScreen />}>
      {/* Replace with a Router (e.g. react-router-dom) as the app grows */}
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showHeader={activeTab !== 'profile'}
        pageHeader={
          activeTab === 'profile' ? (
            <PageHeader title="Perfil" onBack={handleBack} />
          ) : undefined
        }
        contentClassName={
          activeTab === 'profile'
            ? 'flex-1 scroll-container-native pb-24 scrollbar-hide overflow-x-hidden'
            : undefined
        }
        onNotificationClick={() => console.info('[Header] Notifications clicked')}
      >
        {activeTab === 'profile' ? (
          <ProfileView />
        ) : activeTab === 'scales' ? (
          <ScalesPreviewView />
        ) : (
          <UserListView />
        )}
      </Layout>
    </Suspense>
  );
}

export default App;

