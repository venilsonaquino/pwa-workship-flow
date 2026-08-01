import React from 'react';
import type { Instrument } from '../services/ministryService';

export interface Member {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  avatarUrl: string;
  isActive: boolean;
  role: 'admin' | 'member';
  instruments: string[];
  permissions: {
    accountStatus: boolean;
    adminAccess: boolean;
    scaleView?: boolean;
    rankingView?: boolean;
    songViewEngagement?: boolean;
    songViewListeners?: boolean;
    songEditColumns?: boolean;
  };
}

interface MemberRowProps {
  member: Member;
  instruments: Instrument[];
  onAction?: (member: Member) => void;
}

export const MemberRow: React.FC<MemberRowProps> = ({ member, instruments = [], onAction }) => {
  const { name, avatarUrl, instruments: memberInstruments } = member;

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
            {memberInstruments && memberInstruments.length > 0 ? (
              memberInstruments.map((instCode, idx) => {
                const code = typeof instCode === 'string' ? instCode : (instCode as unknown as { code?: string })?.code || '';
                if (!code) return null;
                const match = instruments.find((i) => i.code === code);
                const displayName = match ? match.name : (code.charAt(0).toUpperCase() + code.slice(1));
                const icon = match ? match.icon : 'music_note';
                return (
                  <span key={idx} className="text-on-surface-variant text-[12px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      {icon}
                    </span>
                    {displayName}
                  </span>
                );
              })
            ) : (
              <span className="text-on-surface-variant text-[12px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">
                  music_note
                </span>
                Nenhum
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberRow;

