import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useState } from 'react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="fixed inset-0 bg-gray-900/50" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64 border-r border-gray-200 bg-white">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;