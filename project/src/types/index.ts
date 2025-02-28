export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type InquiryStatus = 'pending' | 'in-progress' | 'resolved';

export interface Inquiry {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface Message {
  id: string;
  inquiryId: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  timestamp: string;
}