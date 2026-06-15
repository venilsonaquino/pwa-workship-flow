import React from 'react';
import { cn } from '@src/lib/utils';

export interface Member {
  id: string;
  name: string;
  avatarUrl: string;
  isActive: boolean;
  isSelf: boolean;
  roles: string;
}

interface MemberRowProps {
  member: Member;
  onAction?: (member: Member) => void;
}

export const MemberRow: React.FC<MemberRowProps> = ({ member, onAction }) => {
  const { name, avatarUrl, isActive, isSelf, roles } = member;

  return (
    <div className="flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors group">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            alt={name}
            className={cn(
              "w-12 h-12 rounded-full object-cover border-2",
              isSelf ? "border-primary-container" : "border-transparent"
            )}
            src={avatarUrl}
            onError={(e) => {
              // Fallback default avatar icon
              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
            }}
          />
          {isActive && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-surface-container-lowest rounded-full" />
          )}
        </div>
        <div>
          <h3 className="font-bold text-on-surface text-[16px]">
            {name}
            {isSelf && <span className="text-on-surface-variant font-medium"> (Você)</span>}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant text-[12px] flex items-center gap-1">
              {roles}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onAction && onAction(member)}
        className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-surface-container"
        aria-label={isSelf ? "Configurações da minha conta" : `Mais opções para ${name}`}
      >
        <span className="material-symbols-outlined">
          {isSelf ? 'settings' : 'more_vert'}
        </span>
      </button>
    </div>
  );
};

export default MemberRow;
