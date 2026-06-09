import React from 'react';

interface ProfileHeaderProps {
  userName: string;
  userEmail: string;
  userRole: string;
  avatarUrl: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userName,
  userEmail,
  userRole,
  avatarUrl,
}) => {
  return (
    <section className='flex flex-col items-center text-center w-full pt-4'>
      <div className='relative' style={{ marginBottom: 32 }}>
        {/* Gradient ring: outermost layer */}
        <div className='w-32 h-32 rounded-full' style={{ padding: 3, background: 'linear-gradient(135deg, #630ed4 0%, #0058be 100%)', boxShadow: '0 8px 24px rgba(99, 14, 212, 0.25)' }}>
          <div className='w-full h-full rounded-full border-[3px] border-white overflow-hidden'>
            <img className='w-full h-full object-cover' src={avatarUrl} alt={userName} />
          </div>
        </div>
        {/* Badge: verified + role label, overlaps bottom of avatar */}
        <div className='absolute -bottom-[14px] left-1/2 -translate-x-1/2 bg-primary text-on-primary rounded-full flex items-center gap-1 whitespace-nowrap'
          style={{ padding: '2px 7px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
        >
          <span className="material-symbols-outlined icon-fill text-[14px]" >
            verified
          </span>
          <span className="text-label-sm font-semibold">
            {userRole}
          </span>
        </div>
      </div>

      {/* ── Name & Email (clear of badge via marginBottom on avatar block) ── */}
      <div>
        <h2 className="text-headline-md text-on-surface m-0">
          {userName}
        </h2>
        <p className="text-body-md text-on-surface-variant mt-1">
          {userEmail}
        </p>
      </div>
    </section>
  );
};

export default ProfileHeader;
