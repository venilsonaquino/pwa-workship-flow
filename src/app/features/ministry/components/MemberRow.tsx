import React from 'react';

export interface Member {
  id: string;
  name: string;
  avatarUrl: string;
  isActive: boolean;
  roles: string;
  role: 'admin' | 'member';
  permissions: {
    accountStatus: boolean;
    editScales: boolean;
    manageRepertoire: boolean;
    adminAccess: boolean;
  };
}

interface MemberRowProps {
  member: Member;
  onAction?: (member: Member) => void;
}

import instrumentsData from '@app/data/instruments.json';

const getInstrumentIcon = (instrumentName: string) => {
  const clean = instrumentName.trim().toLowerCase();
  const matched = (instrumentsData as Array<{ name: string; icon: string }>).find(
    (item) => clean.includes(item.name.toLowerCase())
  );
  return matched ? matched.icon : 'music_note';
};

export const MemberRow: React.FC<MemberRowProps> = ({ member, onAction }) => {
  const { name, avatarUrl, roles } = member;

  return (
    <div
      onClick={() => onAction?.(member)}
      className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors group cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 shrink-0">
          {avatarUrl ? (
            <img
              alt={name}
              className="w-full h-full rounded-full object-cover border-2 border-primary-container"
              src={avatarUrl}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  const fallback = parent.querySelector('.fallback-profile');
                  if (fallback) {
                    (fallback as HTMLElement).style.display = 'flex';
                  }
                }
              }}
            />
          ) : null}
          <div
            className="fallback-profile w-full h-full rounded-full border-2 border-primary-container bg-surface-container flex items-center justify-center text-on-surface-variant"
            style={{ display: avatarUrl ? 'none' : 'flex' }}
          >
            <span className="material-symbols-outlined text-[24px]">person</span>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-on-surface text-[16px]">
            {name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            {roles && roles.split(',').map((role, idx) => {
              const trimmed = role.trim();
              if (!trimmed) return null;
              return (
                <span key={idx} className="text-on-surface-variant text-[12px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    {getInstrumentIcon(trimmed)}
                  </span>
                  {trimmed}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberRow;

