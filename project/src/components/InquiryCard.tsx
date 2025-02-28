import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Inquiry } from '../types';

interface InquiryCardProps {
  inquiry: Inquiry;
}

const InquiryCard: React.FC<InquiryCardProps> = ({ inquiry }) => {
  const getStatusIcon = () => {
    switch (inquiry.status) {
      case 'pending':
        return <Clock className="text-yellow-500" />;
      case 'in-progress':
        return <ArrowRight className="text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="text-green-500" />;
      default:
        return <AlertCircle className="text-gray-500" />;
    }
  };
  
  const getStatusClass = () => {
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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{inquiry.title}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass()}`}>
          {getStatusIcon()}
          <span className="ml-1 capitalize">{inquiry.status.replace('-', ' ')}</span>
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{inquiry.description}</p>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Created: {formatDate(inquiry.createdAt)}</span>
        <Link 
          to={`/inquiries/${inquiry.id}`}
          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
        >
          View Details
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default InquiryCard;