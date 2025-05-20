import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-6xl font-bold text-primary-600">404</h2>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Page Not Found</h1>
        <p className="mt-2 text-center text-lg text-gray-600">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/"
            className="btn btn-primary flex items-center"
          >
            <Home size={18} className="mr-2" />
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary flex items-center"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;