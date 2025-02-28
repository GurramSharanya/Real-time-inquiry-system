import { create } from 'zustand';
import { Notification } from '../types';

interface NotificationState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  addNotification: (userId: string, message: string) => Promise<Notification>;
  markAsRead: (notificationId: string) => Promise<void>;
  getNotificationsByUser: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    message: 'New inquiry submitted: Account access issue',
    read: false,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    userId: '2',
    message: 'Your inquiry "Billing question" has been updated',
    read: true,
    timestamp: new Date(Date.now() - 43200000).toISOString(),
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: mockNotifications,
  loading: false,
  error: null,
  
  addNotification: async (userId: string, message: string) => {
    set({ loading: true, error: null });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newNotification: Notification = {
      id: `${get().notifications.length + 1}`,
      userId,
      message,
      read: false,
      timestamp: new Date().toISOString(),
    };
    
    set(state => ({
      loading: false,
      notifications: [...state.notifications, newNotification],
    }));
    
    return newNotification;
  },
  
  markAsRead: async (notificationId: string) => {
    set({ loading: true, error: null });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      loading: false,
      notifications: state.notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ),
    }));
  },
  
  getNotificationsByUser: (userId: string) => {
    return get().notifications.filter(notification => notification.userId === userId);
  },
  
  getUnreadCount: (userId: string) => {
    return get().notifications.filter(notification => notification.userId === userId && !notification.read).length;
  },
}));