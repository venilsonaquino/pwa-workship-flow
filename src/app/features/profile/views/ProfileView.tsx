import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSettings from '../components/ProfileSettings';
import { MinistryView } from '@features/ministry';
import { PageHeader } from '@shared/components';

interface ProfileViewProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
  avatarUrl?: string;
  onBackToScales?: () => void;
}

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsgr8hEMXWD3smxicINNeHHDp0jwIqYfk5L1SbzfC3lc5hacvBys6Kl-HfnwinW9P736vU3aCr8_FCkKzcqbP0fay92KwJX0jl1HKM7L-umYIaLMI4th2yFjFtkfbqfgVq__LDCfZeLPN0fJ-buEJ1hK1bDzdUBxG9-KblIiMgRcPPAcRzhk7DFIRNTr8yTdJJcedXJEh6ER_UgRl0mh_mLFgtw-gddkh8tF0vi2Un9eVjBgUHVQVhGL85Ae8pDytSaDiFk1iRRtE';

export const ProfileView: React.FC<ProfileViewProps> = ({
  userName = 'Manu Silveira',
  userEmail = 'manusilveira@worshipflow.com',
  userRole = 'Líder de Louvor',
  avatarUrl = DEFAULT_AVATAR,
  onBackToScales,
}) => {
  const [showMinistryView, setShowMinistryView] = useState(false);

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
          {onBackToScales && (
            <PageHeader title="Perfil" onBack={onBackToScales} />
          )}
          <ProfileHeader
            userName={userName}
            userEmail={userEmail}
            userRole={userRole}
            avatarUrl={avatarUrl}
          />
          <ProfileSettings onNavigateToTeam={() => setShowMinistryView(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileView;
