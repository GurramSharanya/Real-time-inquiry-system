import { create } from 'zustand';
import { Inquiry, InquiryStatus, Message } from '../types';

interface InquiryState {
  inquiries: Inquiry[];
  messages: Message[];
  loading: boolean;
  error: string | null;
  createInquiry: (userId: string, title: string, description: string) => Promise<Inquiry>;
  updateInquiryStatus: (inquiryId: string, status: InquiryStatus) => Promise<void>;
  assignInquiry: (inquiryId: string, adminId: string) => Promise<void>;
  addMessage: (inquiryId: string, userId: string, content: string) => Promise<Message>;
  getInquiriesByUser: (userId: string) => Inquiry[];
  getInquiryById: (inquiryId: string) => Inquiry | undefined;
  getMessagesByInquiry: (inquiryId: string) => Message[];
}

// Mock data
const mockInquiries: Inquiry[] = [
  {
    id: '1',
    userId: '2',
    title: 'Account access issue',
    description: 'I cannot log into my account after password reset',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    userId: '2',
    title: 'Billing question',
    description: 'I was charged twice for my subscription',
    status: 'in-progress',
    assignedTo: '1',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: '3',
    userId: '2',
    title: 'Feature request',
    description: 'Would like to see dark mode implemented',
    status: 'resolved',
    assignedTo: '1',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    inquiryId: '2',
    userId: '2',
    content: 'I noticed I was charged twice this month.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    inquiryId: '2',
    userId: '1',
    content: 'I apologize for the inconvenience. I can see the duplicate charge and will process a refund right away.',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: '3',
    inquiryId: '3',
    userId: '2',
    content: 'Would it be possible to add a dark mode option?',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    inquiryId: '3',
    userId: '1',
    content: 'Great suggestion! We\'ve added this to our roadmap and it will be available in the next update.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const useInquiryStore = create<InquiryState>((set, get) => ({
  inquiries: mockInquiries,
  messages: mockMessages,
  loading: false,
  error: null,
  
  createInquiry: async (userId: string, title: string, description: string) => {
    set({ loading: true, error: null });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newInquiry: Inquiry = {
      id: `${get().inquiries.length + 1}`,
      userId,
      title,
      description,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set(state => ({
      loading: false,
      inquiries: [...state.inquiries, newInquiry],
    }));
    
    return newInquiry;
  },
  
  updateInquiryStatus: async (inquiryId: string, status: InquiryStatus) => {
    set({ loading: true, error: null });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      loading: false,
      inquiries: state.inquiries.map(inquiry => 
        inquiry.id === inquiryId 
          ? { ...inquiry, status, updatedAt: new Date().toISOString() } 
          : inquiry
      ),
    }));
  },
  
  assignInquiry: async (inquiryId: string, adminId: string) => {
    set({ loading: true, error: null });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      loading: false,
      inquiries: state.inquiries.map(inquiry => 
        inquiry.id === inquiryId 
          ? { ...inquiry, assignedTo: adminId, updatedAt: new Date().toISOString() } 
          : inquiry
      ),
    }));
  },
  
  addMessage: async (inquiryId: string, userId: string, content: string) => {
    set({ loading: true, error: null });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMessage: Message = {
      id: `${get().messages.length + 1}`,
      inquiryId,
      userId,
      content,
      timestamp: new Date().toISOString(),
    };
    
    set(state => ({
      loading: false,
      messages: [...state.messages, newMessage],
    }));
    
    return newMessage;
  },
  
  getInquiriesByUser: (userId: string) => {
    return get().inquiries.filter(inquiry => inquiry.userId === userId);
  },
  
  getInquiryById: (inquiryId: string) => {
    return get().inquiries.find(inquiry => inquiry.id === inquiryId);
  },
  
  getMessagesByInquiry: (inquiryId: string) => {
    return get().messages.filter(message => message.inquiryId === inquiryId);
  },
}));