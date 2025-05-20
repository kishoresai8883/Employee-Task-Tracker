import React from 'react';
import { getStatusColor } from '../../utils/helpers';

interface StatusBadgeProps {
  status: 'pending' | 'in-progress' | 'completed';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const displayStatus = status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <span className={`badge ${getStatusColor(status)}`}>
      {displayStatus}
    </span>
  );
};

export default StatusBadge;