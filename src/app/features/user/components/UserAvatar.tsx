import React from 'react';
import type { User } from '../types';

interface UserAvatarProps {
  user: Pick<User, 'name' | 'avatar'>;
  size?: number;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 40 }) => {
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="rounded-full overflow-hidden shrink-0 bg-surface-variant border-2 border-border"
      style={{ width: `${size}px`, height: `${size}px` }}
      role="img"
      aria-label={`Avatar de ${user.name}`}
    >
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-on-primary font-semibold"
          style={{ fontSize: `${size * 0.4}px` }}
        >
          {initials}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
