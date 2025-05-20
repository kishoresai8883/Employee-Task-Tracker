import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, Clock, Edit, Trash2, CheckCircle, AlertTriangle, MessageSquare, Send } from 'lucide-react';
import { useTask } from '../../hooks/useTask';
import { useAuth } from '../../hooks/useAuth';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Avatar from '../../components/common/Avatar';
import { formatDate, formatTimestamp, isDeadlinePast, isDeadlineApproaching } from '../../utils/helpers';

const TaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTask, deleteTask, updateTaskStatus, addComment } = useTask();
  const { user, isAdmin } = useAuth();
  const [task, setTask] = useState(id ? getTask(id) : undefined);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchedTask = getTask(id);
      setTask(fetchedTask);
      
      if (!fetchedTask) {
        navigate('/tasks');
      }
    }
  }, [id, getTask, navigate]);

  if (!task) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const deadline = new Date(task.deadline);
  const isOverdue = isDeadlinePast(task.deadline) && task.status !== 'completed';
  const isApproaching = isDeadlineApproaching(task.deadline) && task.status !== 'completed';
  const canEdit = isAdmin || user?.id === task.assigneeId;

  const handleStatusChange = async (status: 'pending' | 'in-progress' | 'completed') => {
    if (id) {
      await updateTaskStatus(id, status);
      setTask(getTask(id));
    }
  };

  const handleDelete = async () => {
    if (id && confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(id);
      if (result.success) {
        navigate('/tasks');
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !id) return;
    
    setLoading(true);
    await addComment(id, comment);
    setComment('');
    setTask(getTask(id));
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/tasks" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ChevronLeft size={16} className="mr-1" />
          Back to tasks
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">{task.title}</h1>
          {canEdit && (
            <div className="flex space-x-2">
              <Link
                to={`/tasks/${task.id}/edit`}
                className="btn btn-secondary flex items-center py-1.5"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-danger flex items-center py-1.5"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </div>
            
            {isOverdue && (
              <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg flex items-start">
                <AlertTriangle size={20} className="text-error-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-error-700">Task Overdue</h3>
                  <p className="text-sm text-error-600">
                    This task was due on {formatDate(task.deadline)}. Please update the status or extend the deadline.
                  </p>
                </div>
              </div>
            )}
            
            {!isOverdue && isApproaching && (
              <div className="mb-6 p-4 bg-warning-50 border border-warning-200 rounded-lg flex items-start">
                <AlertTriangle size={20} className="text-warning-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-warning-700">Deadline Approaching</h3>
                  <p className="text-sm text-warning-600">
                    This task is due on {formatDate(task.deadline)}. Make sure to complete it on time.
                  </p>
                </div>
              </div>
            )}
            
            {canEdit && (
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-2">Update Status</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusChange('pending')}
                    className={`px-4 py-2 rounded-md text-sm font-medium border ${
                      task.status === 'pending'
                        ? 'bg-warning-100 border-warning-300 text-warning-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusChange('in-progress')}
                    className={`px-4 py-2 rounded-md text-sm font-medium border ${
                      task.status === 'in-progress'
                        ? 'bg-accent-100 border-accent-300 text-accent-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className={`px-4 py-2 rounded-md text-sm font-medium border ${
                      task.status === 'completed'
                        ? 'bg-success-100 border-success-300 text-success-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2 flex items-center">
                <MessageSquare size={18} className="mr-2 text-gray-500" />
                Comments ({task.comments.length})
              </h2>
              
              {task.comments.length > 0 ? (
                <div className="space-y-4">
                  {task.comments.map(comment => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Avatar name={comment.userName} size="sm" />
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">{comment.userName}</div>
                          <div className="text-xs text-gray-500">{formatTimestamp(comment.createdAt)}</div>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No comments yet.</p>
              )}
              
              <form onSubmit={handleAddComment} className="mt-4">
                <div className="relative">
                  <textarea
                    placeholder="Add a comment..."
                    className="form-input pr-12 min-h-[80px]"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  <button
                    type="submit"
                    className="absolute bottom-2 right-2 p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50"
                    disabled={!comment.trim() || loading}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Task Details</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <StatusBadge status={task.status} />
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">Priority</div>
                  <PriorityBadge priority={task.priority} />
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">Deadline</div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    <span className={`${
                      isOverdue ? 'text-error-600 font-medium' : 
                      isApproaching ? 'text-warning-600 font-medium' : 'text-gray-900'
                    }`}>
                      {formatDate(task.deadline)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">Assigned To</div>
                  <div className="flex items-center">
                    <Avatar name={task.assigneeName} size="sm" />
                    <span className="ml-2 text-gray-900">{task.assigneeName}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">Created By</div>
                  <div className="flex items-center">
                    <Avatar name={task.createdByName} size="sm" />
                    <span className="ml-2 text-gray-900">{task.createdByName}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 mb-1">Created At</div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-gray-500" />
                    <span className="text-gray-900">{formatDate(task.createdAt)}</span>
                  </div>
                </div>
                
                {task.updatedAt !== task.createdAt && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-gray-500" />
                      <span className="text-gray-900">{formatDate(task.updatedAt)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;