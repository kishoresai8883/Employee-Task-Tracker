import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, AlertTriangle, Plus, BarChart2, Users } from 'lucide-react';
import { useTask } from '../../hooks/useTask';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../../components/dashboard/StatCard';
import StatusChart from '../../components/dashboard/StatusChart';
import RecentTasks from '../../components/dashboard/RecentTasks';
import { getTasksCountByStatus, isDeadlinePast } from '../../utils/helpers';

const Dashboard = () => {
  const { tasks, filteredTasks, fetchTasks } = useTask();
  const { user, isAdmin } = useAuth();
  const [statusData, setStatusData] = useState<{ name: string; value: number; color: string }[]>([]);
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  useEffect(() => {
    // Prepare data for the chart
    const statusCounts = getTasksCountByStatus(tasks);
    
    const data = [
      {
        name: 'Pending',
        value: statusCounts.pending || 0,
        color: '#f59e0b', // warning-500
      },
      {
        name: 'In Progress',
        value: statusCounts['in-progress'] || 0,
        color: '#0ea5e9', // accent-500
      },
      {
        name: 'Completed',
        value: statusCounts.completed || 0,
        color: '#10b981', // success-500
      },
    ];
    
    setStatusData(data);
  }, [tasks]);
  
  // Calculate overdue tasks
  const overdueTasks = tasks.filter(
    (task) => task.status !== 'completed' && isDeadlinePast(task.deadline)
  );
  
  // Get today's completed tasks
  const todayCompletedTasks = tasks.filter(
    (task) => 
      task.status === 'completed' && 
      new Date(task.updatedAt).toDateString() === new Date().toDateString()
  );
  
  // Get tasks assigned to current user
  const userTasks = tasks.filter((task) => task.assigneeId === user?.id);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Tasks"
          value={tasks.length}
          icon={<BarChart2 size={20} />}
          color="primary"
        />
        <StatCard
          title="Completed Tasks"
          value={tasks.filter(task => task.status === 'completed').length}
          icon={<CheckCircle size={20} />}
          color="success"
          changeText="today"
          change={todayCompletedTasks.length}
        />
        <StatCard
          title="Pending Tasks"
          value={tasks.filter(task => task.status === 'pending').length}
          icon={<Clock size={20} />}
          color="warning"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueTasks.length}
          icon={<AlertTriangle size={20} />}
          color="error"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Your Tasks</h3>
              <Link to="/tasks/create" className="btn btn-primary flex items-center">
                <Plus size={18} className="mr-1" />
                Add New Task
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-warning-50 rounded-lg p-4 border border-warning-200">
                <h4 className="font-medium text-warning-800 mb-2 flex items-center">
                  <Clock size={16} className="mr-2" />
                  Pending
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {userTasks.filter(task => task.status === 'pending').length}
                </p>
              </div>
              
              <div className="bg-accent-50 rounded-lg p-4 border border-accent-200">
                <h4 className="font-medium text-accent-800 mb-2 flex items-center">
                  <BarChart2 size={16} className="mr-2" />
                  In Progress
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {userTasks.filter(task => task.status === 'in-progress').length}
                </p>
              </div>
              
              <div className="bg-success-50 rounded-lg p-4 border border-success-200">
                <h4 className="font-medium text-success-800 mb-2 flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  Completed
                </h4>
                <p className="text-2xl font-bold text-gray-900">
                  {userTasks.filter(task => task.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          {isAdmin && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Team Overview</h3>
                <Link to="/admin/employees" className="text-sm text-primary-600 hover:text-primary-800 flex items-center">
                  View all employees
                </Link>
              </div>
              
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-primary-100 text-primary-500">
                  <Users size={20} />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-500">Total Employees</h4>
                  <div className="mt-1 text-2xl font-semibold">
                    {tasks.reduce((acc, task) => {
                      if (!acc.includes(task.assigneeId)) {
                        acc.push(task.assigneeId);
                      }
                      return acc;
                    }, [] as string[]).length}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <StatusChart data={statusData} />
        </div>
        
        <div className="lg:col-span-1">
          <RecentTasks tasks={tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;