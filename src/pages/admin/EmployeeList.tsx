import { useState } from 'react';
import { User, Mail, Search, Filter, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTask } from '../../hooks/useTask';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import { filterUsersByRole } from '../../utils/helpers';

const EmployeeList = () => {
  const { users } = useAuth();
  const { tasks } = useTask();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Apply filters
  const filteredUsers = users
    .filter(
      user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter(user => filterUsersByRole(users, roleFilter).includes(user));
  
  // Get tasks count for each user
  const getUserTasksCount = (userId: string) => {
    return tasks.filter(task => task.assigneeId === userId).length;
  };
  
  // Get completed tasks count for each user
  const getUserCompletedTasksCount = (userId: string) => {
    return tasks.filter(task => task.assigneeId === userId && task.status === 'completed').length;
  };
  
  // Calculate productivity percentage
  const getProductivityPercentage = (userId: string) => {
    const totalTasks = getUserTasksCount(userId);
    const completedTasks = getUserCompletedTasksCount(userId);
    
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearch('');
    setRoleFilter('all');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <p className="text-gray-600 mt-1">Manage and track employee productivity</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm mb-6">
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees..."
            className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Filter size={18} />
            </button>
          </div>
        </form>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              className="form-input"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
        </div>
        
        {(search || roleFilter !== 'all') && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'employee' : 'employees'} found
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
      
      {filteredUsers.length > 0 ? (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Tasks
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Productivity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar name={user.name} src={user.avatar} size="sm" />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-primary-100 text-primary-800' 
                            : 'bg-accent-100 text-accent-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail size={14} className="mr-1 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getUserTasksCount(user.id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getUserCompletedTasksCount(user.id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className="h-2.5 rounded-full bg-primary-500" 
                            style={{ width: `${getProductivityPercentage(user.id)}%` }}
                          ></div>
                        </div>
                        <span>{getProductivityPercentage(user.id)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No employees found"
          description="Try adjusting your search criteria or adding new employees."
          actionText="Clear Filters"
          onAction={clearFilters}
        />
      )}
    </div>
  );
};

export default EmployeeList;