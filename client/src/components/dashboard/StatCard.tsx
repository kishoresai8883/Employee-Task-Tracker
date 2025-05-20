import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeText?: string;
  color?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeText,
  color = 'default',
}) => {
  const colorClasses = {
    default: 'bg-white',
    primary: 'bg-primary-50',
    success: 'bg-success-50',
    warning: 'bg-warning-50',
    error: 'bg-error-50',
  };

  const iconColorClasses = {
    default: 'text-gray-500 bg-gray-100',
    primary: 'text-primary-500 bg-primary-100',
    success: 'text-success-500 bg-success-100',
    warning: 'text-warning-500 bg-warning-100',
    error: 'text-error-500 bg-error-100',
  };

  return (
    <div className={`rounded-xl p-6 ${colorClasses[color]} border border-gray-200 shadow-sm`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${iconColorClasses[color]}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h4 className="text-sm font-medium text-gray-500">{title}</h4>
          <div className="mt-1 text-2xl font-semibold">{value}</div>
        </div>
      </div>
      
      {(change !== undefined || changeText) && (
        <div className="mt-4 flex items-center">
          {change !== undefined && (
            <span
              className={`flex items-center text-sm font-medium ${
                change > 0 ? 'text-success-500' : change < 0 ? 'text-error-500' : 'text-gray-500'
              }`}
            >
              {change > 0 ? (
                <ArrowUp size={16} className="mr-1" />
              ) : change < 0 ? (
                <ArrowDown size={16} className="mr-1" />
              ) : null}
              {Math.abs(change)}%
            </span>
          )}
          {changeText && (
            <span className="text-sm text-gray-500 ml-2">{changeText}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;