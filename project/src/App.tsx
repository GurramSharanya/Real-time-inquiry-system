import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InquiryDetail from './pages/InquiryDetail';
import Notifications from './pages/Notifications';
import Unauthorized from './pages/Unauthorized';
import { useSocketClient } from './socket/socketClient';

function App() {
  // Initialize socket connection
  useSocketClient();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
          
          <Route path="inquiries/:id" element={
            <AuthGuard>
              <InquiryDetail />
            </AuthGuard>
          } />
          
          <Route path="notifications" element={
            <AuthGuard>
              <Notifications />
            </AuthGuard>
          } />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;