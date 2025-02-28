import React, { useState } from 'react';
import { PlusCircle, Filter, BarChart2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useInquiryStore } from '../store/inquiryStore';
import InquiryCard from '../components/InquiryCard';
import { InquiryStatus } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { inquiries, getInquiriesByUser } = useInquiryStore();
  
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');
  const [showNewInquiryForm, setShowNewInquiryForm] = useState(false);
  const [newInquiryTitle, setNewInquiryTitle] = useState('');
  const [newInquiryDescription, setNewInquiryDescription] = useState('');
  
  const { createInquiry } = useInquiryStore();
  
  const handleCreateInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user && newInquiryTitle && newInquiryDescription) {
      await createInquiry(user.id, newInquiryTitle, newInquiryDescription);
      setNewInquiryTitle('');
      setNewInquiryDescription('');
      setShowNewInquiryForm(false);
    }
  };
  
  const filteredInquiries = user?.role === 'admin' 
    ? inquiries.filter(inquiry => statusFilter === 'all' || inquiry.status === statusFilter)
    : getInquiriesByUser(user?.id || '').filter(inquiry => statusFilter === 'all' || inquiry.status === statusFilter);
  
  const pendingCount = inquiries.filter(i => i.status === 'pending').length;
  const inProgressCount = inquiries.filter(i => i.status === 'in-progress').length;
  const resolvedCount = inquiries.filter(i => i.status === 'resolved').length;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.role === 'admin' ? 'Admin Dashboard' : 'My Inquiries'}
        </h1>
        
        {user?.role === 'user' && (
          <button
            onClick={() => setShowNewInquiryForm(!showNewInquiryForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
          >
            <PlusCircle size={18} className="mr-2" />
            New Inquiry
          </button>
        )}
      </div>
      
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <BarChart2 className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Inquiries</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <BarChart2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold">{inProgressCount}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <BarChart2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-bold">{resolvedCount}</p>
            </div>
          </div>
        </div>
      )}
      
      {showNewInquiryForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Inquiry</h2>
          <form onSubmit={handleCreateInquiry}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newInquiryTitle}
                onChange={(e) => setNewInquiryTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={newInquiryDescription}
                onChange={(e) => setNewInquiryDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewInquiryForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Inquiry
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center mb-4">
          <Filter size={18} className="text-gray-500 mr-2" />
          <span className="text-gray-700 font-medium">Filter by status:</span>
          <div className="ml-4 flex space-x-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                statusFilter === 'all'
                  ? 'bg-gray-200 text-gray-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1 rounded-full text-sm ${
                statusFilter === 'pending'
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter('in-progress')}
              className={`px-3 py-1 rounded-full text-sm ${
                statusFilter === 'in-progress'
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1 rounded-full text-sm ${
                statusFilter === 'resolved'
                  ? 'bg-green-200 text-green-800'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>
      
      {filteredInquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No inquiries found.</p>
          {user?.role === 'user' && statusFilter === ' all' && (
        <button
          onClick={() => setShowNewInquiryForm(true)}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle size={16} className="mr-2" />
          Create your first inquiry
        </button>
      )}
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredInquiries.map(inquiry => (
        <InquiryCard key={inquiry.id} inquiry={inquiry} />
      ))}
    </div>
  )}
</div>
);
};

export default Dashboard;