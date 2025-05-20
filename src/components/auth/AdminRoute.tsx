import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminRoute = () => {
  const { isAdmin, loading } = useAuth();

  // Show loading or redirect based on admin state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default AdminRoute;