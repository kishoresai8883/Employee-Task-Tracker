import React from 'react';
import { ClipboardList } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-center">
        <ClipboardList className="h-16 w-16 text-gray-400" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">{description}</p>
      {(actionText && actionLink) || onAction ? (
        <div className="mt-6">
          {actionLink ? (
            <a
              href={actionLink}
              className="btn btn-primary"
            >
              {actionText}
            </a>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onAction}
            >
              {actionText}
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default EmptyState;