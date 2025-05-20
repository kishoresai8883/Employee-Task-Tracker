import React from 'react';
import { getInitials } from '../../utils/helpers';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  if (src) {
    return (
      <img
        className={`${sizeClasses[size]} rounded-full object-cover`}
        src={src}
        alt={name}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-primary-500 flex items-center justify-center text-white font-medium`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;