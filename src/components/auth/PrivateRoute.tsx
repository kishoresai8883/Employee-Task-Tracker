import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  // Show loading or redirect based on auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;