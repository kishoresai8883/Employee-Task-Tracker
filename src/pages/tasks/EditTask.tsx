import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Calendar } from 'lucide-react';
import { TaskFormData } from '../../types';
import { useTask } from '../../hooks/useTask';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';

const EditTask = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTask, updateTask } = useTask();
  const { users, isAdmin, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [task, setTask] = useState(id ? getTask(id) : undefined);
  
  const employees = users.filter(user => user.role === 'employee');
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'pending',
    priority: task?.priority || 'medium',
    assigneeId: task?.assigneeId || '',
    deadline: task?.deadline ? format(new Date(task.deadline), 'yyyy-MM-dd') : '',
  });
  
  // Check if the user has permission to edit this task
  useEffect(() => {
    if (id) {
      const task = getTask(id);
      setTask(task);
      
      if (!task) {
        navigate('/tasks');
        return;
      }
      
      // If not admin and not the assignee, redirect
      if (!isAdmin && user?.id !== task.assigneeId) {
        navigate(`/tasks/${id}`);
        return;
      }
      
      // Populate form data
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assigneeId,
        deadline: format(new Date(task.deadline), 'yyyy-MM-dd'),
      });
    }
  }, [id, getTask, navigate, isAdmin, user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const result = await updateTask(id, formData);
      
      if (result.success) {
        navigate(`/tasks/${id}`);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred while updating the task.');
    }
    
    setLoading(false);
  };

  if (!task) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to={`/tasks/${id}`} className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ChevronLeft size={16} className="mr-1" />
          Back to task
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Edit Task</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-error-50 text-error-700 p-3 rounded-md border border-error-200">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="form-label">
                Task Title <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="form-label">
                Description <span className="text-error-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                className="form-input"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-input"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="priority" className="form-label">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  className="form-input"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="assigneeId" className="form-label">
                  Assign To <span className="text-error-500">*</span>
                </label>
                <select
                  id="assigneeId"
                  name="assigneeId"
                  className="form-input"
                  value={formData.assigneeId}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select an employee</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="deadline" className="form-label">
                  Deadline <span className="text-error-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    className="form-input pl-10"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <Link to={`/tasks/${id}`} className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;