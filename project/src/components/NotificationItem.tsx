import React from 'react';
import { Bell } from 'lucide-react';
import { Notification } from '../types';
import { useNotificationStore } from '../store/notificationStore';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { markAsRead } = useNotificationStore();
  
  const handleMarkAsRead = async () => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div 
      className={`p-4 border-b ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-full ${notification.read ? 'bg-gray-100' : 'bg-blue-100'} mr-3`}>
          <Bell size={16} className={notification.read ? 'text-gray-500' : 'text-blue-500'} />
        </div>
        
        <div className="flex-1">
          <p className={`${notification.read ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">{formatTime(notification.timestamp)}</p>
        </div>
        
        {!notification.read && (
          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;