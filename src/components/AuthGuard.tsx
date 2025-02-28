import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (requiredRole && user?.role !== requiredRole) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, user, requiredRole, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }
  
  return <>{children}</>;
};

export default AuthGuard;