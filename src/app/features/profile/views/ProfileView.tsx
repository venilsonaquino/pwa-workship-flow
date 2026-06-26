import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSettings from '../components/ProfileSettings';
import EditProfileView from './EditProfileView';
import SecurityView from './SecurityView';
import { useProfile } from '../hooks/useProfile';
import { MinistryView } from '@features/ministry';
import { Header } from '@shared/components';

interface ProfileViewProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
  avatarUrl?: string;
  onNotificationClick?: () => void;
  hasUnreadNotifications?: boolean;
}

const DEFAULT_AVATAR = '';

const ProfileSkeleton: React.FC = () => (
  <div className="w-full flex flex-col p-6 animate-pulse space-y-6">
    <div className="flex flex-col items-center space-y-4 pt-8">
      <div className="w-32 h-32 rounded-full bg-surface-container-high" />
      <div className="h-6 w-1/2 bg-surface-container-high rounded-lg" />
      <div className="h-4 w-1/3 bg-surface-container-high rounded-lg" />
    </div>
    <div className="space-y-4 pt-6">
      <div className="h-16 w-full bg-surface-container-high rounded-xl" />
      <div className="h-16 w-full bg-surface-container-high rounded-xl" />
      <div className="h-16 w-full bg-surface-container-high rounded-xl" />
    </div>
  </div>
);

interface ProfileErrorProps {
  message: string;
  onRetry: () => void;
}

const ProfileError: React.FC<ProfileErrorProps> = ({ message, onRetry }) => (
  <div className="w-full flex flex-col items-center justify-center p-8 text-center space-y-4 pt-16">
    <div className="w-16 h-16 rounded-full bg-error-container/20 flex items-center justify-center text-error">
      <span className="material-symbols-outlined text-[32px]">warning</span>
    </div>
    <h3 className="text-headline-sm font-bold text-on-surface">Erro ao Carregar Perfil</h3>
    <p className="text-body-md text-on-surface-variant max-w-sm">{message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-2 bg-primary text-on-primary rounded-full hover:bg-primary/95 active:scale-95 transition-all text-label-lg font-semibold shadow-sm"
    >
      Tentar Novamente
    </button>
  </div>
);

export const ProfileView: React.FC<ProfileViewProps> = ({
  userName = '',
  userEmail = '',
  userRole = '',
  avatarUrl = DEFAULT_AVATAR,
  onNotificationClick,
  hasUnreadNotifications = true,
}) => {
  const [showMinistryView, setShowMinistryView] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSecurityView, setShowSecurityView] = useState(false);

  const { profile, isLoading, isUpdating, error, fetchProfile, updateProfile } = useProfile();

  const renderContent = () => {
    if (isLoading) {
      return <ProfileSkeleton />;
    }

    if (error) {
      return <ProfileError message={error} onRetry={fetchProfile} />;
    }

    return (
      <>
        <ProfileHeader
          userName={profile?.name || userName}
          userEmail={profile?.email || userEmail}
          userRole={profile?.role || userRole}
          avatarUrl={profile?.avatarUrl || avatarUrl}
        />
        <ProfileSettings
          onNavigateToTeam={() => setShowMinistryView(true)}
          onEditPersonalData={() => setShowEditProfile(true)}
          onNavigateToSecurity={() => setShowSecurityView(true)}
          memberCount={profile?.memberCount}
        />
      </>
    );
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {showMinistryView ? (
        <motion.div
          key="ministry-view"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100%' }}
        >
          <MinistryView onBack={() => setShowMinistryView(false)} />
        </motion.div>
      ) : showEditProfile ? (
        <motion.div
          key="edit-profile-view"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100%' }}
        >
          <EditProfileView
            profile={profile}
            onSave={updateProfile}
            isSaving={isUpdating}
            onBack={() => setShowEditProfile(false)}
          />
        </motion.div>
      ) : showSecurityView ? (
        <motion.div
          key="security-view"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100%' }}
        >
          <SecurityView onBack={() => setShowSecurityView(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="profile-settings"
          initial={{ x: '-30%' }}
          animate={{ x: 0 }}
          exit={{ x: '-30%' }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', minHeight: '100%' }}
          className="w-full flex flex-col"
        >
          <Header
            title="Perfil"
            showNotification={true}
            onNotificationClick={onNotificationClick}
            hasUnreadNotifications={hasUnreadNotifications}
          />
          {renderContent()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileView;

