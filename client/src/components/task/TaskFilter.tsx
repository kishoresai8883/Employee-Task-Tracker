import { useEffect, useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { TaskFilter as TaskFilterType } from '../../types';

interface TaskFilterProps {
  onFilter: (filter: TaskFilterType) => void;
  currentFilter: TaskFilterType;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilter, currentFilter }) => {
  const { users, isAdmin } = useAuth();
  const [search, setSearch] = useState(currentFilter.search || '');
  const [status, setStatus] = useState(currentFilter.status || 'all');
  const [priority, setPriority] = useState(currentFilter.priority || 'all');
  const [assignee, setAssignee] = useState(currentFilter.assigneeId || 'all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const employees = users.filter(user => user.role === 'employee');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    onFilter({
      search,
      status: status !== 'all' ? status : undefined,
      priority: priority !== 'all' ? priority : undefined,
      assigneeId: assignee !== 'all' ? assignee : undefined,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setPriority('all');
    setAssignee('all');
    onFilter({});
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, priority, assignee]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-6">
      <form onSubmit={handleSearch} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={18} />
          </button>
        </div>
      </form>

      {isFilterOpen && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="form-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              className="form-input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
              <select
                className="form-input"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option value="all">All Employees</option>
                {employees.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      
      {(search || status !== 'all' || priority !== 'all' || assignee !== 'all') && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {Object.values(currentFilter).some(val => val !== undefined) ? 'Filtered results' : 'All tasks'}
          </div>
          <button
            type="button"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            onClick={clearFilters}
          >
            <X size={14} className="mr-1" />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskFilter;