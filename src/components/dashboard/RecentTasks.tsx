import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { Task } from '../../types';
import { formatDate } from '../../utils/helpers';
import StatusBadge from '../common/StatusBadge';

interface RecentTasksProps {
  tasks: Task[];
}

const RecentTasks: React.FC<RecentTasksProps> = ({ tasks }) => {
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Recent Tasks</h3>
        <Link to="/tasks" className="text-sm text-primary-600 hover:text-primary-800 flex items-center">
          View all
          <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
      
      <div className="space-y-4">
        {recentTasks.length > 0 ? (
          recentTasks.map((task) => (
            <div key={task.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <Link to={`/tasks/${task.id}`} className="block hover:bg-gray-50 -mx-4 px-4 py-2 rounded-lg transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <Clock size={14} className="mr-1" />
                  {formatDate(task.createdAt)}
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default RecentTasks;