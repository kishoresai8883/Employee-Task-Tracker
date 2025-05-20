import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, AlertTriangle } from 'lucide-react';
import { useTask } from '../../hooks/useTask';
import TaskCard from '../../components/task/TaskCard';
import TaskFilter from '../../components/task/TaskFilter';
import EmptyState from '../../components/common/EmptyState';
import { sortTasks, isDeadlinePast } from '../../utils/helpers';
import { TaskFilter as TaskFilterType } from '../../types';

const TaskList = () => {
  const { filteredTasks, fetchTasks, filter, setFilter } = useTask();
  const [sortBy, setSortBy] = useState<string>('newest');
  const [sortedTasks, setSortedTasks] = useState(filteredTasks);
  
  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  // Sort tasks when filteredTasks or sortBy changes
  useEffect(() => {
    setSortedTasks(sortTasks(filteredTasks, sortBy));
  }, [filteredTasks, sortBy]);
  
  const handleFilterChange = (newFilter: TaskFilterType) => {
    setFilter(newFilter);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">Manage and organize your tasks</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/tasks/create"
            className="btn btn-primary flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Add New Task
          </Link>
        </div>
      </div>
      
      <TaskFilter onFilter={handleFilterChange} currentFilter={filter} />
      
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
        </div>
        <div className="flex items-center">
          <label htmlFor="sortBy" className="text-sm font-medium text-gray-700 mr-2">
            Sort by:
          </label>
          <select
            id="sortBy"
            className="form-input py-1 pl-2 pr-8 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="deadline">Deadline</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
      
      {sortedTasks.length > 0 ? (
        <>
          {/* Show overdue tasks first */}
          {sortedTasks.some(task => task.status !== 'completed' && isDeadlinePast(task.deadline)) && (
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <AlertTriangle size={18} className="text-error-500 mr-2" />
                <h2 className="text-lg font-medium text-error-700">Overdue Tasks</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedTasks
                  .filter(task => task.status !== 'completed' && isDeadlinePast(task.deadline))
                  .map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))}
              </div>
            </div>
          )}
          
          {/* Regular tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedTasks
              .filter(task => !(task.status !== 'completed' && isDeadlinePast(task.deadline)))
              .map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
          </div>
        </>
      ) : (
        <EmptyState
          title="No tasks found"
          description="Get started by creating a new task or adjust your filters to see more tasks."
          actionText="Create Task"
          actionLink="/tasks/create"
        />
      )}
    </div>
  );
};

export default TaskList;