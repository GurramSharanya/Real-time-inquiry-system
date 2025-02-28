import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, ArrowRight, Send, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useInquiryStore } from '../store/inquiryStore';
import { useNotificationStore } from '../store/notificationStore';
import MessageList from '../components/MessageList';
import { InquiryStatus } from '../types';

const InquiryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getInquiryById, getMessagesByInquiry, updateInquiryStatus, assignInquiry, addMessage } = useInquiryStore();
  const { addNotification } = useNotificationStore();
  
  const [newMessage, setNewMessage] = useState('');
  
  if (!id || !user) {
    return <div>Loading...</div>;
  }
  
  const inquiry = getInquiryById(id);
  const messages = getMessagesByInquiry(id);
  
  if (!inquiry) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Inquiry not found</h2>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  const handleStatusChange = async (status: InquiryStatus) => {
    await updateInquiryStatus(id, status);
    
    // Notify the user about status change
    if (user.role === 'admin' && user.id !== inquiry.userId) {
      await addNotification(
        inquiry.userId,
        `Your inquiry "${inquiry.title}" status has been updated to ${status.replace('-', ' ')}`
      );
    }
  };
  
  const handleAssignToMe = async () => {
    if (user.role === 'admin') {
      await assignInquiry(id, user.id);
      
      // Notify the user about assignment
      if (user.id !== inquiry.userId) {
        await addNotification(
          inquiry.userId,
          `Your inquiry "${inquiry.title}" has been assigned to an admin`
        );
      }
    }
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim() && user) {
      await addMessage(id, user.id, newMessage.trim());
      setNewMessage('');
      
      // Notify the other party about new message
      const recipientId = user.id === inquiry.userId 
        ? inquiry.assignedTo || '' 
        : inquiry.userId;
      
      if (recipientId) {
        await addNotification(
          recipientId,
          `New message in inquiry "${inquiry.title}"`
        );
      }
    }
  };
  
  const getStatusBadgeClass = () => {
    switch (inquiry.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = () => {
    switch (inquiry.status) {
      case 'pending':
        return <Clock className="text-yellow-500" />;
      case 'in-progress':
        return <ArrowRight className="text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="text-green-500" />;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{inquiry.title}</h1>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span className="mr-4">Created: {formatDate(inquiry.createdAt)}</span>
                <span>Last updated: {formatDate(inquiry.updatedAt)}</span>
              </div>
            </div>
            
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass()}`}>
              {getStatusIcon()}
              <span className="ml-1 capitalize">{inquiry.status.replace('-', ' ')}</span>
            </span>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-gray-800 whitespace-pre-line">{inquiry.description}</p>
          </div>
          
          {user.role === 'admin' && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => handleStatusChange('pending')}
                disabled={inquiry.status === 'pending'}
                className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                  inquiry.status === 'pending'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
              >
                <Clock size={14} className="mr-1" />
                Mark as Pending
              </button>
              
              <button
                onClick={() => handleStatusChange('in-progress')}
                disabled={inquiry.status === 'in-progress'}
                className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                  inquiry.status === 'in-progress'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                <ArrowRight size={14} className="mr-1" />
                Mark as In Progress
              </button>
              
              <button
                onClick={() => handleStatusChange('resolved')}
                disabled={inquiry.status === 'resolved'}
                className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                  inquiry.status === 'resolved'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                <CheckCircle size={14} className="mr-1" />
                Mark as Resolved
              </button>
              
              {!inquiry.assignedTo && (
                <button
                  onClick={handleAssignToMe}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                >
                  Assign to me
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Conversation</h2>
          
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No messages yet. Start the conversation below.
            </div>
          ) : (
            <MessageList messages={messages} currentUser={user} />
          )}
          
          <form onSubmit={handleSendMessage} className="mt-4">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <Send size={16} className="mr-2" />
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;