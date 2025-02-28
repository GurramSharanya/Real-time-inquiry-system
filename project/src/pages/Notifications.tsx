import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import NotificationItem from '../components/NotificationItem';

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getNotificationsByUser } = useNotificationStore();
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  const notifications = getNotificationsByUser(user.id);
  
  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Dashboard
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            You have no notifications.
          </div>
        ) : (
          <div className="divide-y">
            {notifications
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;