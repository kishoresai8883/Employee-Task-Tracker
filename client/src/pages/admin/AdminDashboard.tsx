import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Users, CheckCircle, Clock, AlertTriangle, User } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTask } from '../../hooks/useTask';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../../components/dashboard/StatCard';
import { getTasksCountByStatus, isDeadlinePast } from '../../utils/helpers';
import Avatar from '../../components/common/Avatar';

const AdminDashboard = () => {
  const { tasks, fetchTasks } = useTask();
  const { users } = useAuth();
  const [productivityData, setProductivityData] = useState<any[]>([]);
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  // Calculate productivity data per employee
  useEffect(() => {
    if (!tasks.length || !users.length) return;
    
    const employees = users.filter(user => user.role === 'employee');
    
    const data = employees.map(employee => {
      const employeeTasks = tasks.filter(task => task.assigneeId === employee.id);
      const completedTasks = employeeTasks.filter(task => task.status === 'completed').length;
      const totalTasks = employeeTasks.length;
      const productivityRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
      
      return {
        name: employee.name,
        totalTasks,
        completedTasks,
        pendingTasks: employeeTasks.filter(task => task.status === 'pending').length,
        inProgressTasks: employeeTasks.filter(task => task.status === 'in-progress').length,
        productivityRate: Math.round(productivityRate),
      };
    });
    
    setProductivityData(data);
  }, [tasks, users]);
  
  // Calculate task metrics
  const overdueTasks = tasks.filter(task => task.status !== 'completed' && isDeadlinePast(task.deadline));
  const completedToday = tasks.filter(
    task => 
      task.status === 'completed' && 
      new Date(task.updatedAt).toDateString() === new Date().toDateString()
  );
  
  const tasksByStatus = getTasksCountByStatus(tasks);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor team productivity and task status</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Tasks"
          value={tasks.length}
          icon={<BarChart2 size={20} />}
          color="primary"
        />
        <StatCard
          title="Total Employees"
          value={users.filter(user => user.role === 'employee').length}
          icon={<Users size={20} />}
          color="accent"
        />
        <StatCard
          title="Completed Tasks"
          value={tasksByStatus.completed || 0}
          icon={<CheckCircle size={20} />}
          color="success"
          change={completedToday.length}
          changeText="today"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueTasks.length}
          icon={<AlertTriangle size={20} />}
          color="error"
        />
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Team Productivity</h2>
          <Link to="/admin/employees" className="text-sm text-primary-600 hover:text-primary-800">
            View all employees
          </Link>
        </div>
        
        {productivityData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productivityData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completedTasks" name="Completed" fill="#10b981" />
                <Bar dataKey="inProgressTasks" name="In Progress" fill="#0ea5e9" />
                <Bar dataKey="pendingTasks" name="Pending" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">No productivity data available</div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium mb-4">Employee Overview</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tasks
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  In Progress
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productivity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productivityData.map((employee, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar name={employee.name} size="sm" />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {employee.totalTasks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-success-100 text-success-800">
                      {employee.completedTasks}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-accent-100 text-accent-800">
                      {employee.inProgressTasks}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-warning-100 text-warning-800">
                      {employee.pendingTasks}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="h-2.5 rounded-full bg-primary-500" 
                          style={{ width: `${employee.productivityRate}%` }}
                        ></div>
                      </div>
                      <span>{employee.productivityRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;