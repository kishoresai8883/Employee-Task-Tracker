import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  CheckSquare,
  Users,
  ClipboardList,
  Settings,
  X,
  BarChart3,
  UserCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    ...(isAdmin
      ? [
          { name: 'Admin Dashboard', href: '/admin', icon: BarChart3 },
          { name: 'Employees', href: '/admin/employees', icon: Users },
        ]
      : []),
    { name: 'Your Profile', href: '/profile', icon: UserCircle },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-4 py-6 flex items-center justify-between border-b border-gray-200">
        <Link to="/" className="flex items-center">
          <ClipboardList className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">TaskFlow</span>
        </Link>
        {onClose && (
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  active
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                onClick={onClose}
              >
                <item.icon
                  className={`${
                    active ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-900'
                  } mr-3 flex-shrink-0 h-5 w-5 transition-colors`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="pt-8">
          <div className="px-3 mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Settings
            </h3>
          </div>
          <Link
            to="/settings"
            className={`${
              isActive('/settings')
                ? 'bg-primary-50 text-primary-600'
                : 'text-gray-700 hover:bg-gray-100'
            } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
            onClick={onClose}
          >
            <Settings
              className={`${
                isActive('/settings') ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-900'
              } mr-3 flex-shrink-0 h-5 w-5 transition-colors`}
            />
            Settings
          </Link>
        </div>
      </nav>
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-3">
            <img
              className="h-10 w-10 rounded-full"
              src="https://source.unsplash.com/random/100x100/?portrait,1"
              alt="User"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">Admin User</div>
            <div className="text-xs text-gray-500 truncate">admin@example.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;