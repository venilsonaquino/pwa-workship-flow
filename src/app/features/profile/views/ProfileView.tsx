import React from 'react';

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
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        width: '100%',
        paddingTop: 16,
      }}
    >
      {/* ── Avatar Block ─────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', marginBottom: 32 }}>

        {/* Gradient ring: outermost layer */}
        <div
          style={{
            width: 128,
            height: 128,
            borderRadius: '50%',
            padding: 3,
            background: 'linear-gradient(135deg, #630ed4 0%, #0058be 100%)',
            boxShadow: '0 8px 24px rgba(99, 14, 212, 0.25)',
          }}
        >
          {/* White spacer ring: middle layer */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '3px solid #ffffff',
              overflow: 'hidden',
              background: '#e8e0f0',
            }}
          >
            {/* Photo: innermost layer */}
            <img
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              src={avatarUrl}
              alt={userName}
            />
          </div>
        </div>

        {/* Badge: verified + role label, overlaps bottom of avatar */}
        <div
          style={{
            position: 'absolute',
            bottom: -14,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--primary)',
            color: '#ffffff',
            borderRadius: 9999,
            padding: '4px 14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            whiteSpace: 'nowrap',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            {userRole}
          </span>
        </div>
      </div>

      {/* ── Name & Email (clear of badge via marginBottom on avatar block) ── */}
      <div>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            lineHeight: '28px',
            color: 'var(--on-surface)',
            margin: 0,
          }}
        >
          {userName}
        </h2>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: '20px',
            color: 'var(--on-surface-variant)',
            marginTop: 4,
          }}
        >
          {userEmail}
        </p>
      </div>
    </section>
  );
};

export default ProfileView;
