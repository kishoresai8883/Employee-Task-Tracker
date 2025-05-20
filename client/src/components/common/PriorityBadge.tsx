import React from 'react';
import { getPriorityColor, formatPriority } from '../../utils/helpers';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  return (
    <span className={`badge ${getPriorityColor(priority)}`}>
      {formatPriority(priority)}
    </span>
  );
};

export default PriorityBadge;