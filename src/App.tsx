import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import TaskList from './pages/tasks/TaskList';
import TaskDetail from './pages/tasks/TaskDetail';
import CreateTask from './pages/tasks/CreateTask';
import EditTask from './pages/tasks/EditTask';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeList from './pages/admin/EmployeeList';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';

function App() {
  const { user, checkAuth } = useAuth();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
      
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/create" element={<CreateTask />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/tasks/:id/edit" element={<EditTask />} />
          
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/employees" element={<EmployeeList />} />
          </Route>
        </Route>
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;