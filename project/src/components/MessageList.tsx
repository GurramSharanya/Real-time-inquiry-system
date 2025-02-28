import React from 'react';
import { Message, User } from '../types';

interface MessageListProps {
  messages: Message[];
  currentUser: User;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUser }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="space-y-4 mb-4">
      {messages.map(message => {
        const isCurrentUser = message.userId === currentUser.id;
        
        return (
          <div 
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] rounded-lg p-3 ${
                isCurrentUser 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p>{message.content}</p>
              <div 
                className={`text-xs mt-1 ${
                  isCurrentUser ? 'text-indigo-200' : 'text-gray-500'
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;