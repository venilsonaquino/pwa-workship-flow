import React from 'react';
import type { User, UserStatus } from '../types';
import { UserAvatar } from './UserAvatar';
import { cn } from '@src/lib/utils';

// ── Status Badge Styles ────────────────────────────────────────────────────────

const statusClasses: Record<UserStatus, string> = {
  active: 'bg-success/15 text-success border-success/30',
  inactive: 'bg-disabled/15 text-disabled border-disabled/30',
  pending: 'bg-warning/15 text-warning border-warning/30',
};

// ── Types ──────────────────────────────────────────────────────────────────────

interface UserTableRowProps {
  user: User;
  onClick?: (user: User) => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

export const UserTableRow: React.FC<UserTableRowProps> = ({ user, onClick }) => {
  return (
    <article
      onClick={() => onClick?.(user)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(user)}
      className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl shadow-sm transition-all duration-150 ease-in-out cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 active:translate-y-0 active:shadow-sm"
    >
      <UserAvatar user={user} size={48} />
      <div className="flex-1 min-w-0 text-left">
        <h3 className="text-base font-semibold text-on-surface truncate">{user.name}</h3>
        <p className="text-sm text-placeholder truncate mt-0.5">{user.email}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm capitalize">
            {user.role}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize border before:content-[""] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current',
              statusClasses[user.status]
            )}
          >
            {user.status}
          </span>
        </div>
      </div>
    </article>
  );
};

export default UserTableRow;
