import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Bell, LogOut, MessageSquare, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { getUnreadCount } = useNotificationStore();
  const navigate = useNavigate();
  
  const unreadCount = user ? getUnreadCount(user.id) : 0;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) {
    return <Outlet />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <MessageSquare className="mr-2" />
            Inquiry System
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/notifications" className="relative">
              <Bell />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
            
            <div className="flex items-center">
              <User className="mr-2" />
              <span>{user.name}</span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center text-white hover:text-gray-200"
            >
              <LogOut className="mr-1" size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} Real-time Inquiry System
        </div>
      </footer>
    </div>
  );
};

export default Layout;