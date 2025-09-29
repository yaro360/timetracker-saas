import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Settings, LogOut, Menu, X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerDashboard from './ManagerDashboard';
import OwnerDashboard from './OwnerDashboard';
import CompanyRegistration from './CompanyRegistration';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { DataProvider } from '../contexts/DataContext';

// Main App Component
function AppContent() {
  const { user, login, logout, register, createCompany } = useAuth();
  const [currentView, setCurrentView] = useState('login');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      login(userData.username, userData.password);
    }
  }, []);

  const handleLogin = (username, password) => {
    if (login(username, password)) {
      setCurrentView('dashboard');
    }
  };

  const handleRegister = (userData) => {
    if (register(userData)) {
      setCurrentView('dashboard');
    }
  };

  const handleCompanyRegistration = (companyData, ownerData) => {
    if (createCompany(companyData, ownerData)) {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentView('login');
  };

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'owner':
        return <OwnerDashboard onLogout={handleLogout} />;
      case 'manager':
        return <ManagerDashboard onLogout={handleLogout} />;
      case 'employee':
        return <EmployeeDashboard onLogout={handleLogout} />;
      default:
        return <EmployeeDashboard onLogout={handleLogout} />;
    }
  };

  if (user) {
    return (
      <div className="app">
        {renderDashboard()}
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <div className="login-card">
          <div className="logo">
            <Clock size={32} />
          </div>
          <h1>TimeTracker</h1>
          <p className="subtitle">Multi-Company Location-Based Timesheet Platform</p>
          
          <div className="tab-container">
            <button 
              className={`tab ${currentView === 'login' ? 'active' : ''}`}
              onClick={() => setCurrentView('login')}
            >
              Login
            </button>
            <button 
              className={`tab ${currentView === 'register' ? 'active' : ''}`}
              onClick={() => setCurrentView('register')}
            >
              Register
            </button>
            <button 
              className={`tab ${currentView === 'company' ? 'active' : ''}`}
              onClick={() => setCurrentView('company')}
            >
              Start Company
            </button>
          </div>

          {currentView === 'login' && (
            <LoginForm onLogin={handleLogin} />
          )}
          
          {currentView === 'register' && (
            <RegisterForm onRegister={handleRegister} />
          )}
          
          {currentView === 'company' && (
            <CompanyRegistration onCompanyRegistration={handleCompanyRegistration} />
          )}
        </div>
      </div>
    </div>
  );
}

// Main App with Providers
function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;

