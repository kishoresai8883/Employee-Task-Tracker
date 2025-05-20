import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MessageSquare, MoreVertical } from 'lucide-react';
import { Task } from '../../types';
import { formatDate, isDeadlineApproaching, isDeadlinePast } from '../../utils/helpers';
import { useTask } from '../../hooks/useTask';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import PriorityBadge from '../common/PriorityBadge';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { updateTaskStatus, deleteTask } = useTask();
  const { isAdmin, user } = useAuth();
  const menuRef = useState<HTMLDivElement | null>(null)[0];

  const deadline = new Date(task.deadline);
  const isApproaching = isDeadlineApproaching(task.deadline);
  const isPast = isDeadlinePast(task.deadline);
  const canEdit = isAdmin || user?.id === task.assigneeId;

  // Handler for status change
  const handleStatusChange = async (status: 'pending' | 'in-progress' | 'completed') => {
    await updateTaskStatus(task.id, status);
    setShowMenu(false);
  };

  // Handler for task deletion
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task.id);
    }
    setShowMenu(false);
  };

  return (
    <div className="card p-4 hover:translate-y-[-2px] transition-all duration-200">
      <div className="flex justify-between items-start">
        <Link to={`/tasks/${task.id}`} className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{task.title}</h3>
        </Link>
        {canEdit && (
          <div className="relative ml-2">
            <button
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreVertical size={16} className="text-gray-500" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200" ref={menuRef}>
                <div className="py-1">
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
                    Change Status
                  </div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleStatusChange('pending')}
                  >
                    Pending
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleStatusChange('in-progress')}
                  >
                    In Progress
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleStatusChange('completed')}
                  >
                    Completed
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link
                    to={`/tasks/${task.id}/edit`}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowMenu(false)}
                  >
                    Edit Task
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-gray-100"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{task.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>
      
      <div className="flex items-center text-xs text-gray-500 mb-3">
        <Calendar size={14} className="mr-1" />
        <span className={`${
          isPast && task.status !== 'completed' ? 'text-error-600 font-medium' : 
          isApproaching && task.status !== 'completed' ? 'text-warning-600 font-medium' : ''
        }`}>
          {formatDate(task.deadline)}
        </span>
        
        {task.comments.length > 0 && (
          <div className="flex items-center ml-4">
            <MessageSquare size={14} className="mr-1" />
            <span>{task.comments.length}</span>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <div className="flex items-center">
          <Avatar name={task.assigneeName} size="sm" />
          <span className="ml-2 text-xs text-gray-600">{task.assigneeName}</span>
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <Clock size={14} className="mr-1" />
          <span>
            {formatDate(task.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;