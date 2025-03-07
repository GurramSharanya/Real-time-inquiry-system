import axios from "axios";
import { create } from "zustand";
import { Inquiry, InquiryStatus, Message } from "../types";
import { io } from "socket.io-client"; // ✅ Import WebSocket client

const socket = io("http://localhost:5000"); // ✅ Connect to backend WebSocket

interface InquiryState {
  inquiries: Inquiry[];
  messages: Message[];
  loading: boolean;
  error: string | null;
  fetchInquiries: () => Promise<void>;
  createInquiry: (userId: string, title: string, description: string) => Promise<Inquiry>;
  updateInquiryStatus: (inquiryId: string, status: InquiryStatus) => Promise<void>;
  assignInquiry: (inquiryId: string, adminId: string) => Promise<void>;
  addMessage: (inquiryId: string, userId: string, content: string) => Promise<Message>;
  getInquiriesByUser: (userId: string) => Inquiry[];
  getInquiryById: (inquiryId: string) => Inquiry | undefined;
  getMessagesByInquiry: (inquiryId: string) => Message[];
}

export const useInquiryStore = create<InquiryState>((set, get) => ({
  inquiries: [],  
  messages: [],
  loading: false,
  error: null,

  // ✅ Fetch inquiries from backend
  fetchInquiries: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("http://localhost:5000/api/inquiries");
      set({ inquiries: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch inquiries", loading: false });
      console.error(error);
    }
  },

  createInquiry: async (userId: string, title: string, description: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("http://localhost:5000/api/inquiries", {
        userId,
        title,
        description,
      });
  
      set(state => ({
        inquiries: [...state.inquiries, response.data],
        loading: false,
      }));
  
      socket.emit("newInquiry", response.data); // ✅ Notify all connected users
  
      return response.data;
    } catch (error) {
      set({ error: "Failed to create inquiry", loading: false });
      console.error(error);
    }
  },
  

  updateInquiryStatus: async (inquiryId: string, status: InquiryStatus) => {
    set({ loading: true, error: null });
    try {
      await axios.put(`http://localhost:5000/api/inquiries/${inquiryId}/status`, { status });
      set(state => ({
        inquiries: state.inquiries.map(inquiry =>
          inquiry.id === inquiryId ? { ...inquiry, status } : inquiry
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update status", loading: false });
      console.error(error);
    }
  },

  assignInquiry: async (inquiryId: string, adminId: string) => {
    set({ loading: true, error: null });
    try {
      await axios.put(`http://localhost:5000/api/inquiries/${inquiryId}/assign`, { adminId });
      set(state => ({
        inquiries: state.inquiries.map(inquiry =>
          inquiry.id === inquiryId ? { ...inquiry, assignedTo: adminId } : inquiry
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: "Failed to assign inquiry", loading: false });
      console.error(error);
    }
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

// ✅ Listen for real-time WebSocket updates
socket.on("inquiryUpdated", (newInquiry) => {
  useInquiryStore.setState((state) => ({
    inquiries: [...state.inquiries, newInquiry], // Add new inquiries dynamically
  }));
});

// ✅ Listen for status updates in real time
socket.on("statusUpdated", ({ inquiryId, status }) => {
  useInquiryStore.setState((state) => ({
    inquiries: state.inquiries.map(inquiry =>
      inquiry.id === inquiryId ? { ...inquiry, status } : inquiry
    ),
  }));
});


// ✅ Use useEffect in a React component (not inside Zustand)
import { useEffect } from "react";
const InquiryLoader = () => {
  const { fetchInquiries } = useInquiryStore();
  
  useEffect(() => {
    fetchInquiries(); // ✅ Fetch inquiries when the component loads
  }, []);

  return null;
};
export default InquiryLoader;
