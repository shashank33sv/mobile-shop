// src/App.jsx
import React, { useState, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PublicWebsite from './components/PublicWebsite';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginPage(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
      <AdminDashboard
        onLogout={handleLogout}
        // Pass other props as needed
      />
    );
  }

  if (showLoginPage) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBack={() => setShowLoginPage(false)}
      />
    );
  }

  return <PublicWebsite onAdminLoginClick={() => setShowLoginPage(true)} />;
}
