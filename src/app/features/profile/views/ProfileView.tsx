import React from 'react';
import ProfileHeader from '../components/ProfileHeader';
import ProfileSettings from '../components/ProfileSettings';

interface ProfileViewProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
  avatarUrl?: string;
}

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsgr8hEMXWD3smxicINNeHHDp0jwIqYfk5L1SbzfC3lc5hacvBys6Kl-HfnwinW9P736vU3aCr8_FCkKzcqbP0fay92KwJX0jl1HKM7L-umYIaLMI4th2yFjFtkfbqfgVq__LDCfZeLPN0fJ-buEJ1hK1bDzdUBxG9-KblIiMgRcPPAcRzhk7DFIRNTr8yTdJJcedXJEh6ER_UgRl0mh_mLFgtw-gddkh8tF0vi2Un9eVjBgUHVQVhGL85Ae8pDytSaDiFk1iRRtE';

export const ProfileView: React.FC<ProfileViewProps> = ({
  userName = 'Manu Silveira',
  userEmail = 'manusilveira@worshipflow.com',
  userRole = 'Líder de Louvor',
  avatarUrl = DEFAULT_AVATAR,
}) => {
  return (
    <div className="w-full flex flex-col">
      <ProfileHeader
        userName={userName}
        userEmail={userEmail}
        userRole={userRole}
        avatarUrl={avatarUrl}
      />
      <ProfileSettings />
    </div>
  );
};

export default ProfileView;
